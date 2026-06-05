import { supabase } from "@/lib/supabase/supabase"
import { Teacher } from "@/types"

export const getTeachers = async () => {
  const { data, error } = await supabase
    .from("teachers")
    .select("*")

  if (error) throw error
  return data || []
}

export const createTeacher = async (
    teacher: Omit<Teacher, "id" | "created_at">
) => {
  const { data, error } = await supabase
    .from("teachers")
    .insert([teacher])
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateTeacherById = async (
  id: string,
  updates: Partial<Teacher>
) => {
  const { data, error } = await supabase
    .from("teachers")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteTeacherById = async (id: string) => {
  const { error } = await supabase
    .from("teachers")
    .delete()
    .eq("id", id)

  if (error) throw error
}