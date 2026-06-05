"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import supabase from "@/lib/supabase/supabaseClient"
import toast from "react-hot-toast"
import { Class } from "@/types"
import { sortClasses } from "@/utils/school/classes/classes"
// import { useTeachersData } from "./useTeachersData"

export function useClasses(initialClasses: Class[] = []) {
  
  const [classes, setClasses] = useState<Class[]>(initialClasses)
  const [loading, setLoading] = useState(true)

  const levelOrder: Record<string, number> = {
    Creche: 1,
    KG: 2,
    Nursery: 3,
    Primary: 4,
    JSS: 5,
    SSS: 6,
  }

  const getClassName = (cls: Class) =>
    [cls.level, cls.grade, cls.stream].filter(Boolean).join(" ")

  const sortedClasses = useMemo(() => {
    return [...classes].sort((a, b) => {
      return (
        (levelOrder[a.level ?? ""] || 99) -
          (levelOrder[b.level ?? ""] || 99) ||
        (a.grade || 0) - (b.grade || 0) ||
        (a.stream || "").localeCompare(b.stream || "")
      )
    })
  }, [classes])

  const groupedClasses = useMemo(() => {
    return sortedClasses.reduce((acc, cls) => {
      const level = cls.level || "Other"
      if (!acc[level]) acc[level] = []
      acc[level].push(cls)
      return acc
    }, {} as Record<string, Class[]>)
  }, [sortedClasses])

  // =========================
  // FETCH
  // =========================

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('classes')
        .select(`
          id,
          level,
          grade,
          stream,
          class_teacher_id,
          class_teacher:teachers!classes_class_teacher_id_fkey(
            teacher_id,
            first_name,
            last_name
          )
        `)
        .order('level')
        .order('grade')

      if (error) throw error

      const formattedClasses = (data || []).map((cls: any) => {
        const teacher = Array.isArray(cls.class_teacher)
          ? cls.class_teacher[0]
          : cls.class_teacher

        return {
          id: cls.id,
          level: cls.level,
          grade: cls.grade,
          stream: cls.stream,
          class_teacher_id: cls.class_teacher_id,
          class_teacher: teacher ?? null,
        }
      })

      setClasses(formattedClasses)

    } catch (err: any) {
      console.error('fetchClasses error:', err?.message || String(err))
      toast.error(err?.message || 'Failed to load classes')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch and realtime subscription
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      await fetchClasses()
      setLoading(false)
    }

    initializeData()

    // Setup realtime subscription for classes
    const subscription = supabase
      .channel('classes-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'classes',
        },
        () => fetchClasses()
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIPTION_FAILED') {
          console.error('[v0] Realtime subscription failed')
          toast.error('Sync failed - please refresh')
        }
      })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchClasses])

  // =========================
  // CREATE
  // =========================

  const createClass = async (form: {
    level: string
    grade: string
    stream: string
  }) => {
    const gradeNumber = form.level === "Creche" ? null : parseInt(form.grade, 10)
    const stream = form.stream?.trim() === "" ? null : form.stream?.trim().toUpperCase()

    if (!form.level) {
      toast.error("Level is required")
      return false
    }

    if (form.level !== "Creche" && (gradeNumber === null || isNaN(gradeNumber))) {
      toast.error("Valid grade is required")
      return false
    }

    const exists = classes.some(
      (c) => c.level === form.level && c.grade === gradeNumber && (c.stream || null) === stream
    )

    if (exists) {
      toast.error("Class already exists")
      return false
    }

    const { error } = await supabase.from("classes").insert([
      {
        level: form.level,
        grade: gradeNumber,
        stream,
        status: "active",
      },
    ])

    if (error) {
      toast.error(error.message)
      return false
    }

    toast.success("Class created")
    await fetchClasses()
    return true
  }

  // =========================
  // UPDATE
  // =========================

  const handleUpdateClass = async (
    id: number,
    form: { level: string; grade: string; stream: string }
  ) => {
    const gradeNumber = parseInt(form.grade, 10)
    const stream = form.stream?.trim() === "" ? null : form.stream?.trim().toUpperCase()

    if (!form.level || !form.grade) {
      toast.error("Level and grade are required")
      return false
    }

    if (isNaN(gradeNumber)) {
      toast.error("Invalid grade")
      return false
    }

    const exists = classes.some(
      (c) => c.id !== id && c.level === form.level && c.grade === gradeNumber && (c.stream || null) === stream
    )

    if (exists) {
      toast.error("Duplicate class")
      return false
    }

    const { error } = await supabase
      .from("classes")
      .update({ level: form.level, grade: gradeNumber, stream })
      .eq("id", id)

    if (error) {
      toast.error("Update failed")
      return false
    }

    toast.success("Class updated")
    await fetchClasses()
    return true
  }

  // =========================
  // ARCHIVE
  // =========================

  const handleArchiveClass = async (cls: Class) => {
    const { count } = await supabase
      .from("students")
      .select("*", { count: "exact", head: true })
      .eq("class_id", cls.id)

    if ((count ?? 0) > 0) {
      toast.error("Class has students")
      return false
    }

    const { error } = await supabase
      .from("classes")
      .update({ status: "archived" })
      .eq("id", cls.id)

    if (error) {
      toast.error("Archive failed")
      return false
    }

    toast.success("Class archived")
    await fetchClasses()
    return true
  }

  // =========================
  // DELETE
  // =========================

  const deleteClass = async (id: number) => {
    const { error } = await supabase
      .from("classes")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error("Delete failed")
      return false
    }

    toast.success("Class deleted")
    await fetchClasses()
    return true
  }

    /**
     * Assign a teacher to be the class teacher
     * Updates class_teacher_id in classes table
     */
    const assignClassTeacher = async (classId: number, teacherId: string) => {
  try {
    const { error } = await supabase
      .from("classes")
      .update({ class_teacher_id: teacherId })
      .eq("id", classId)

    if (error) throw error

    toast.success("Class teacher assigned")
    await fetchClasses()
    return true
  } catch (err: any) {
    console.error("assignClassTeacher error:", err?.message || String(err))
    toast.error(err?.message || "Failed to assign class teacher")
    return false
  }
}
  
    /**
     * Remove the class teacher assignment
     */
    const removeClassTeacher = async (classId: number) => {
  try {
    const { error } = await supabase
      .from("classes")
      .update({ class_teacher_id: null })
      .eq("id", classId)

    if (error) throw error

    toast.success("Class teacher removed")
    await fetchClasses()
    return true
  } catch (err: any) {
    console.error("removeClassTeacher error:", err?.message || String(err))
    toast.error(err?.message || "Failed to remove class teacher")
    return false
  }
}

  return {
    classes,
    groupedClasses,
    sortClasses,
    loading,

    assignClassTeacher,
    removeClassTeacher,

    fetchClasses,
    getClassName,

    createClass,
    handleUpdateClass,
    handleArchiveClass,
    deleteClass,
  }
}
