import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase/supabaseClient'
import { Subject } from '@/types/subject'
import { Assignment } from '@/types/teacherAssignment'
import { Teacher } from '@/types'
import toast from 'react-hot-toast'

export function useTeachersData() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  // FETCH TEACHERS
  const fetchTeachers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('first_name', { ascending: true })

      if (error) {
        console.error('[v0] fetchTeachers error:', error)
        return
      }

      setTeachers(data || [])
    } catch (err) {
      console.error('[v0] fetchTeachers exception:', err)
    }
  }, [])

  // FETCH SUBJECTS
  const fetchSubjects = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.error('[v0] fetchSubjects error:', error)
        return
      }

      setSubjects(data || [])
    } catch (err) {
      console.error('[v0] fetchSubjects exception:', err)
    }
  }, [])

  // // FETCH ASSIGNMENTS
  // const fetchAssignments = useCallback(async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('teacher_assignments')
  //       .select(
  //         `
  //         *,
  //         class:classes(*),
  //         subject:subjects(*)
  //       `
  //       )

  //     if (error) {
  //       console.error('[v0] fetchAssignments error:', error)
  //       return
  //     }

  //     setAssignments(data || [])
  //   } catch (err) {
  //     console.error('[v0] fetchAssignments exception:', err)
  //   }
  // }, [])

  // Initial fetch and subscriptions
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)
        await Promise.all([fetchTeachers(), fetchSubjects()])
      } catch (err) {
        console.error('[v0] Failed to initialize teacher data:', err)
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    initializeData()

    // Subscribe to teachers realtime changes
    const teachersSubscription = supabase
      .channel('teachers-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teachers' },
        () => fetchTeachers()
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIPTION_FAILED') {
          console.error('[v0] Teachers subscription failed')
          toast.error('Sync failed - please refresh')
        }
      })

    // Subscribe to assignments realtime changes
    // const assignmentsSubscription = supabase
    //   .channel('assignments-realtime')
    //   .on(
    //     'postgres_changes',
    //     { event: '*', schema: 'public', table: 'teacher_assignments' },
    //     () => fetchAssignments()
    //   )
    //   .subscribe((status: string) => {
    //     if (status === 'SUBSCRIPTION_FAILED') {
    //       console.error('[v0] Assignments subscription failed')
    //     }
    //   })

    return () => {
      teachersSubscription.unsubscribe()
      // assignmentsSubscription.unsubscribe()
    }
  }, [fetchTeachers, fetchSubjects])

  const addTeacher = useCallback(
    async (teacherData: Omit<Teacher, 'id' | 'created_at'>) => {
      try {
        const { data, error } = await supabase
          .from('teachers')
          .insert([teacherData])
          .select()

        if (error) throw error

        if (data) {
          setTeachers((prev) => [...prev, ...data])
        }
      } catch (err) {
        console.error('[v0] addTeacher error:', err)
        throw err
      }
    },
    []
  )

  const updateTeacher = useCallback(
    async (id: number, updates: Partial<Teacher>) => {
      try {
        const { data, error } = await supabase
          .from('teachers')
          .update(updates)
          .eq('id', id)
          .select()

        if (error) throw error

        if (data) {
          setTeachers((prev) =>
            prev.map((t) => (t.id === id ? { ...t, ...data[0] } : t))
          )
        }
      } catch (err) {
        console.error('[v0] updateTeacher error:', err)
        throw err
      }
    },
    []
  )

  const deleteTeacher = useCallback(
    async (teacherId: string) => {
      try {
        const { error } = await supabase
          .from('teachers')
          .delete()
          .eq('teacher_id', teacherId)

        if (error) throw error

        setTeachers((prev) => prev.filter((t) => t.teacher_id !== teacherId))
        toast.success('Teacher deleted')
      } catch (err) {
        console.error('[v0] deleteTeacher error:', err)
        toast.error('Failed to delete teacher')
        throw err
      }
    },
    []
  )

  const deleteMultipleTeachers = useCallback(
    async (ids: string[]) => {
      try {
        const { error } = await supabase
          .from('teachers')
          .delete()
          .in('teacher_id', ids)

        if (error) throw error

        setTeachers((prev) => prev.filter((t) => !ids.includes(t.teacher_id)))
        toast.success('Teachers deleted')
      } catch (err) {
        console.error('[v0] deleteMultipleTeachers error:', err)
        toast.error('Failed to delete teachers')
        throw err
      }
    },
    []
  )

  return {
    teachers,
    subjects,
    // assignments,
    loading,
    fetchTeachers,
    fetchSubjects,
    // fetchAssignments,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    deleteMultipleTeachers,
  }
}
