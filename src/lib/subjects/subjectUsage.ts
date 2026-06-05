import { supabase } from "@/lib/supabase/supabaseClient"

export type SubjectUsage = {
  teacherAssignments: number
  isInUse: boolean
}

export const getSubjectUsage = async (
  subjectId: string
): Promise<SubjectUsage> => {
  const { data, error } = await supabase
    .from("teacher_assignments")
    .select("id", { count: "exact" })
    .eq("subject_id", subjectId)

  if (error) {
    console.error(error)
    return {
      teacherAssignments: 0,
      isInUse: false,
    }
  }

  const count = data?.length || 0

  return {
    teacherAssignments: count,
    isInUse: count > 0,
  }
}