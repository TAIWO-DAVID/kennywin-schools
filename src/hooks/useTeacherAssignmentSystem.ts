/**
 * Teacher Assignment System Hook (Refactored)
 * 
 * Responsibilities:
 * - Centralized assignment data fetching and caching
 * - Diff-based updates (not delete + insert)
 * - Per-action loading states for UI feedback
 * - Canonical data selectors (getTeacherViewModel)
 * - Toast notifications for all operations
 * 
 * Fixes:
 * #1 Assignment logic - uses diff engine
 * #3 UI mixing concerns - hook handles all operations
 * #5 Duplicated logic - single selector via getTeacherViewModel
 * #6 Missing state awareness - per-action loading states
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase/supabaseClient'
import toast from 'react-hot-toast'
import { Assignment } from '@/types/teacherAssignment'
import {
  assignmentRules,
  AssignmentDiff,
  AssignmentPayload,
} from '@/lib/assignment-rules'

/**
 * Loading state for per-action tracking
 */
export interface AssignmentLoadingState {
  removingAssignmentId: string | null
  removingClassId: string | null
  assigningClassId: number | null
}

/**
 * Teacher view model - canonical selector result
 */
export interface TeacherViewModel {
  groupedByClass: Map<
    number,
    {
      classInfo: any
      assignments: Assignment[]
      subjectIds: string[]
    }
  >
  totalCount: number
  classIds: number[]
  subjectsByClass: Map<number, string[]>
}

/**
 * Main assignment system hook - refactored with proper separation
 */
export function useTeacherAssignmentSystem() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  // Per-action loading states (fixes problem #6)
  const [loadingStates, setLoadingStates] = useState<AssignmentLoadingState>({
    removingAssignmentId: null,
    removingClassId: null,
    assigningClassId: null,
  })

  /**
   * Fetch all assignments with full data
   */
  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('teacher_assignments')
        .select(
          `
          *,
          class:classes(*),
          subject:subjects(*),
          teacher:teachers(*)
        `
        )

      if (error) throw error

      setAssignments(data || [])
    } catch (err) {
      console.error('[v0] fetchAssignments error:', err)
      toast.error('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchAssignments()
  }, [fetchAssignments])

  /**
   * Get current active session ID
   */
  const getActiveSessionId = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('id')
        .eq('is_current', true)
        .single()

      if (error || !data) {
        throw new Error('No active session found')
      }

      return data.id
    } catch (err) {
      console.error('[v0] getActiveSessionId error:', err)
      throw err
    }
  }, [])

  /**
   * Assign subjects to a class for a teacher using DIFF-BASED updates
   * This fixes problem #1: keep history, avoid flicker, track partial updates
   */
  const assignSubjectsToClass = useCallback(
    async (teacherId: string, classId: number, subjectIds: string[]) => {
      try {
        setLoadingStates((prev) => ({
          ...prev,
          assigningClassId: classId,
        }))

        // Get session
        const sessionId = await getActiveSessionId()

        // Get existing assignments
        const { data: existingAssignments, error: fetchError } = await supabase
          .from('teacher_assignments')
          .select('*')
          .eq('teacher_id', teacherId)
          .eq('class_id', classId)

        if (fetchError) throw fetchError

        const existingSubjectIds = existingAssignments.map(
          (a: any) => a.subject_id
        )

        // Compute diff (instead of delete all then insert)
        const diff = assignmentRules.diffAssignments(
          existingSubjectIds,
          subjectIds
        )

        console.log('[v0] Assignment diff:', {
          toAdd: diff.toAdd.length,
          toRemove: diff.toRemove.length,
          toKeep: diff.toKeep.length,
        })

        // Remove obsolete assignments
        if (diff.toRemove.length > 0) {
          const { error: deleteError } = await supabase
            .from('teacher_assignments')
            .delete()
            .eq('teacher_id', teacherId)
            .eq('class_id', classId)
            .in('subject_id', diff.toRemove)

          if (deleteError) throw deleteError
        }

        // Add new assignments
        if (diff.toAdd.length > 0) {
          const payload = diff.toAdd.map((subjectId) =>
            assignmentRules.buildAssignmentPayload(
              teacherId,
              classId,
              subjectId,
              sessionId
            )
          )

          const { error: insertError } = await supabase
            .from('teacher_assignments')
            .insert(payload)

          if (insertError) throw insertError
        }

        // Show summary
        const summary = assignmentRules.computeUpdateSummary(diff)
        if (summary.totalChanged === 0) {
          toast.success('Assignments unchanged')
        } else {
          toast.success(
            `Updated: +${summary.added} -${summary.removed} =${summary.unchanged}`
          )
        }

        await fetchAssignments()
        return true
      } catch (err) {
        console.error('[v0] assignSubjectsToClass error:', err)
        toast.error('Failed to update assignments')
        return false
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          assigningClassId: null,
        }))
      }
    },
    [fetchAssignments, getActiveSessionId]
  )

  /**
   * Remove a single assignment
   */
  const removeAssignment = useCallback(
    async (assignmentId: string) => {
      try {
        setLoadingStates((prev) => ({
          ...prev,
          removingAssignmentId: assignmentId,
        }))

        const { error } = await supabase
          .from('teacher_assignments')
          .delete()
          .eq('id', assignmentId)

        if (error) throw error

        toast.success('Assignment removed')

        // Optimistic update: remove from local state immediately
        setAssignments((prev) =>
          prev.filter((a) => a.id !== assignmentId)
        )

        // Verify with fresh fetch
        await fetchAssignments()
        return true
      } catch (err) {
        console.error('[v0] removeAssignment error:', err)
        toast.error('Failed to remove assignment')
        return false
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          removingAssignmentId: null,
        }))
      }
    },
    [fetchAssignments]
  )

  /**
   * Remove all assignments for a teacher in a class
   */
  const removeClassAssignments = useCallback(
    async (teacherId: string, classId: number) => {
      try {
        setLoadingStates((prev) => ({
          ...prev,
          removingClassId: `${teacherId}-${classId}`,
        }))

        const { error } = await supabase
          .from('teacher_assignments')
          .delete()
          .eq('teacher_id', teacherId)
          .eq('class_id', classId)

        if (error) throw error

        toast.success('All assignments removed')

        // Optimistic update
        setAssignments((prev) =>
          prev.filter(
            (a) => !(a.teacher_id === teacherId && a.class_id === classId)
          )
        )

        await fetchAssignments()
        return true
      } catch (err) {
        console.error('[v0] removeClassAssignments error:', err)
        toast.error('Failed to remove assignments')
        return false
      } finally {
        setLoadingStates((prev) => ({
          ...prev,
          removingClassId: null,
        }))
      }
    },
    [fetchAssignments]
  )

  /**
   * Get all assignments for a specific teacher
   */
  const getTeacherAssignments = useCallback(
    (teacherId: string) => {
      return assignments.filter((a) => a.teacher_id === teacherId)
    },
    [assignments]
  )

  /**
   * Canonical data selector - fixes problem #5
   * Returns complete teacher view model with grouped data
   * UI should NOT rebuild this structure - use this selector
   */
  const getTeacherViewModel = useCallback(
    (teacherId: string): TeacherViewModel => {
      const teacherAssignments = getTeacherAssignments(teacherId)

      // Group by class
      const groupedByClass = new Map<
        number,
        {
          classInfo: any
          assignments: Assignment[]
          subjectIds: string[]
        }
      >()

      const subjectsByClass = new Map<number, string[]>()

      teacherAssignments.forEach((assignment) => {
        const classId = assignment.class_id

        if (!groupedByClass.has(classId)) {
          groupedByClass.set(classId, {
            classInfo: assignment.class,
            assignments: [],
            subjectIds: [],
          })
        }

        const group = groupedByClass.get(classId)!
        group.assignments.push(assignment)
        group.subjectIds.push(assignment.subject_id)
        subjectsByClass.set(classId, group.subjectIds)
      })

      return {
        groupedByClass,
        totalCount: teacherAssignments.length,
        classIds: Array.from(groupedByClass.keys()),
        subjectsByClass,
      }
    },
    [getTeacherAssignments]
  )

  return {
    // Data
    assignments,
    loading,
    loadingStates,

    // Operations
    fetchAssignments,
    assignSubjectsToClass,
    removeAssignment,
    removeClassAssignments,

    // Selectors
    getTeacherAssignments,
    getTeacherViewModel,

    // Utils
    isLoadingForClass: (classId: number) =>
      loadingStates.assigningClassId === classId,
    isRemovingAssignment: (assignmentId: string) =>
      loadingStates.removingAssignmentId === assignmentId,
    isRemovingClassAssignments: (teacherId: string, classId: number) =>
      loadingStates.removingClassId === `${teacherId}-${classId}`,
  }
}
