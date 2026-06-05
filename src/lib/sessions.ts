import { supabase } from "@/lib/supabase/supabaseClient"

export async function getSessions() {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getCurrentSession() {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("is_current", true)
    .maybeSingle()

  if (error) return null
  return data
}

export async function setCurrentSession(sessionId: string) {
  // Turn everything off
  const { error: resetError } = await supabase
    .from("sessions")
    .update({ is_current: false })
    .not("id", "is", null)

  if (resetError) throw resetError

  // Turn one on
  const { error: setError } = await supabase
    .from("sessions")
    .update({ is_current: true })
    .eq("id", sessionId)

  if (setError) throw setError
}

export async function createSession(payload: {
  name: string
  start_date?: string
  end_date?: string
  is_current?: boolean
}) {
  const { data, error } = await supabase
    .from("sessions")
    .insert(payload)
    .select()
    .single()

  if (error) throw error

  // If created as current → enforce single current
  if (payload.is_current) {
    await setCurrentSession(data.id)
  }

  return data
}