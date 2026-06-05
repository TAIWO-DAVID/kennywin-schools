import { supabase } from "@/lib/supabase/supabaseClient"
import toast from "react-hot-toast"

export type Subject = {
  id: string
  name: string
  code?: string
  category?: string
  description?: string
  is_active: boolean
}

export const fetchArchivedSubjectsService = async (): Promise<Subject[]> => {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("is_active", false)
    .order("name", { ascending: true })

  if (error) {
    console.error(error)
    toast.error("Failed to load archived subjects")
    return []
  }

  return data || []
}

export const restoreSubjectService = async (id: string) => {
  const { error } = await supabase
    .from("subjects")
    .update({ is_active: true })
    .eq("id", id)

  if (error) {
    console.error(error)
    toast.error("Restore failed")
    return false
  }

  toast.success("Subject restored")
  return true
}