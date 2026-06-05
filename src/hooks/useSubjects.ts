"use client"

import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/supabaseClient"
import toast from "react-hot-toast"
import { Subject } from "@/types/subject"
import { getSubjectUsage } from "@/lib/subjects/subjectUsage"
import {
  isDuplicateSubject,
} from "@/lib/subjects/subjectRules"
import {
  normalizeSubjectName,
  isEmptySubjectName,
} from "@/lib/subjects/subjectValidation"

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(true)

  // =========================
  // FETCH ACTIVE SUBJECTS
  // =========================
  const fetchSubjects = useCallback(async () => {
    try {
      setLoadingSubjects(true)

      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true })

      if (error) throw error

      setSubjects(data || [])
    } catch (err) {
      console.error("fetchSubjects error:", err)
      toast.error("Failed to load subjects")
    } finally {
      setLoadingSubjects(false)
    }
  }, [])

  // =========================
  // CREATE SUBJECT
  // =========================
  const createSubject = useCallback(
    async (payload: Omit<Subject, "id" | "created_at">) => {
      try {
        const name = normalizeSubjectName(payload.name)

        if (isEmptySubjectName(name)) {
          toast.error("Subject name is required")
          return false
        }

        if (isDuplicateSubject(subjects, name)) {
          toast.error("Subject already exists")
          return false
        }

        const { error } = await supabase.from("subjects").insert({
          ...payload,
          name,
        })

        if (error) throw error

        toast.success("Subject created")
        await fetchSubjects()
        return true
      } catch (err) {
        console.error("createSubject error:", err)
        toast.error("Failed to create subject")
        return false
      }
    },
    [subjects, fetchSubjects]
  )

  // =========================
  // UPDATE SUBJECT
  // =========================
  const updateSubject = useCallback(
    async (id: string, payload: Partial<Subject>) => {
      try {
        if (payload.name !== undefined) {
          const name = normalizeSubjectName(payload.name)

          if (isEmptySubjectName(name)) {
            toast.error("Subject name is required")
            return false
          }

          if (isDuplicateSubject(subjects, name, id)) {
            toast.error("Another subject already exists with this name")
            return false
          }

          payload.name = name
        }

        const { error } = await supabase
          .from("subjects")
          .update(payload)
          .eq("id", id)

        if (error) throw error

        toast.success("Subject updated")
        await fetchSubjects()
        return true
      } catch (err) {
        console.error("updateSubject error:", err)
        toast.error("Failed to update subject")
        return false
      }
    },
    [subjects, fetchSubjects]
  )

  // =========================
  // ARCHIVE SUBJECT
  // =========================
  const archiveSubject = async (id: string) => {
    const usage = await getSubjectUsage(id)

    if (usage.isInUse) {
      toast.error(
        `Cannot archive. Used in ${usage.teacherAssignments === 1 ? "an assignment" : `${usage.teacherAssignments} "assignments"` }`
      )
      return false
    }

    const { error } = await supabase
      .from("subjects")
      .update({ is_active: false })
      .eq("id", id)

    if (error) {
      toast.error("Archive failed")
      return false
    }

    toast.success("Subject archived")
    await fetchSubjects()
    return true
  }

  // =========================
  // RESTORE SUBJECT
  // =========================
  const restoreSubject = async (id: string) => {
    const { data } = await supabase
      .from("subjects")
      .select("name")
      .eq("id", id)
      .single()

    const duplicate = await supabase
      .from("subjects")
      .select("id")
      .eq("name", data?.name)
      .eq("is_active", true)
      .maybeSingle()

    if (duplicate.data) {
      toast.error("Active subject with same name exists")
      return false
    }

    await supabase
      .from("subjects")
      .update({ is_active: true })
      .eq("id", id)

    toast.success("Subject restored")
    await fetchSubjects()
    return true
  }

  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  return {
    subjects,
    loadingSubjects,

    fetchSubjects,
    createSubject,
    updateSubject,
    archiveSubject,
    restoreSubject,
  }
}