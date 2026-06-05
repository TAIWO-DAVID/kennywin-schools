'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/supabaseClient'
import toast from 'react-hot-toast'

export function useClassTeacherSync() {
  const [loading, setLoading] = useState(false)
  const [syncErrors, setSyncErrors] = useState<string[]>([])

  // REMOVE teacher everywhere (safe cleanup)
  const removeTeacherCompletely = useCallback(async (teacherId: string) => {
    try {
      setLoading(true)

      // 1. Remove as class teacher
      const { error: classError } = await supabase
        .from('classes')
        .update({ class_teacher_id: null })
        .eq('class_teacher_id', teacherId)

      if (classError) throw classError

      // 2. Remove assignments
      const { error: assignError } = await supabase
        .from('teacher_assignments')
        .delete()
        .eq('teacher_id', teacherId)

      if (assignError) throw assignError

      toast.success('Teacher removed successfully')
      return true
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to remove teacher')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // CHECK ORPHAN CLASS TEACHERS
  const getInvalidClassTeachers = useCallback(async () => {
    try {
      setLoading(true)

      const { data: classes, error } = await supabase
        .from('classes')
        .select('id, level, grade, stream, class_teacher_id')
        .not('class_teacher_id', 'is', null)

      if (error) throw error

      const teacherIds = [
        ...new Set((classes || []).map(c => c.class_teacher_id))
      ]

      if (teacherIds.length === 0) return []

      const { data: teachers, error: teacherError } = await supabase
        .from('teachers')
        .select('teacher_id')
        .in('teacher_id', teacherIds)

      if (teacherError) throw teacherError

      const validIds = new Set((teachers || []).map(t => t.teacher_id))

      const invalid = (classes || []).filter(
        c => !validIds.has(c.class_teacher_id)
      )

      const errors = invalid.map(c => {
        const name = [c.level, c.grade, c.stream].filter(Boolean).join(' ')
        return `Invalid teacher in ${name}`
      })

      setSyncErrors(errors)

      return invalid
    } catch (err: any) {
      console.error(err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    syncErrors,
    removeTeacherCompletely,
    getInvalidClassTeachers,
  }
}