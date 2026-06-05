import supabase from "@/lib/supabase/supabaseClient"
import { Class } from "@/types"

export const assignTeacher = async (classId: number, teacherId: string) => {
  const { error } = await supabase
    .from("classes")
    .update({ class_teacher_id: teacherId })
    .eq("id", classId)

  if (error) throw error
}

export const updateClass = async (id: number, payload: Partial<Class>) => {
  const { error } = await supabase
    .from("classes")
    .update(payload)
    .eq("id", id)

  if (error) throw error
}

export const createClass = async (payload: any) => {
  const { data, error } = await supabase
    .from("classes")
    .insert([payload])
    .select()

  if (error) throw error
  return data
}

export const archiveClass = async (id: number) => {
  const { error } = await supabase
    .from("classes")
    .update({ status: "archived" })
    .eq("id", id)

  if (error) throw error
}

export const countStudentsInClass = async (classId: number) => {
  const { count, error } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("class_id", classId)

  if (error) throw error
  return count ?? 0
}

export async function getClasses() {
  const { data, error } = await supabase
    .from("classes")
    .select("id, level, grade, stream");

  if (error) throw error;

  return data;
}