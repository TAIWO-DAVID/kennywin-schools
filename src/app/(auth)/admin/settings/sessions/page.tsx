"use client"

import { useEffect, useState } from "react"
import {
  getSessions,
  setCurrentSession,
  createSession,
} from "@/lib/sessions"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import supabase from "@/lib/supabase/supabaseClient"
import { AcademicSessionsSkeleton } from "@/components/skeletons/academic-sessions-skeletons"

type Session = {
  id: string
  name: string
  is_current: boolean
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [newSession, setNewSession] = useState({
    name: "",
    is_current: false,
  })

  const fetchSessions = async () => {
    try {
      const data = await getSessions()
      setSessions(data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleSetCurrent = async (id: string) => {
    await setCurrentSession(id)
    await fetchSessions()
  }

  const handleCreate = async () => {
    try {
      if (!newSession.name) {
        alert("Session name is required")
        return
      }

      // If user checked "set as current"
      if (newSession.is_current) {
        await supabase
          .from("sessions")
          .update({ is_current: false })
          .not("id", "is", null)
      }

      const { error } = await supabase.from("sessions").insert({
        name: newSession.name,
        is_current: newSession.is_current,
      })

      if (error) throw error

      // ✅ Reset form
      setNewSession({ name: "", is_current: false })

      // ✅ Close modal
      setOpen(false)

      // ✅ Refetch sessions
      fetchSessions()

    } catch (err: any) {
      console.error("Create session error:", err?.message || err)
    }
  }

  if (loading) {
    <AcademicSessionsSkeleton/>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Academic Sessions</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Session</Button>
          </DialogTrigger>

          <DialogContent className="space-y-4">
            <DialogHeader>
              <DialogTitle>Create Session</DialogTitle>
            </DialogHeader>

            <Input
              placeholder="e.g. 2024/2025"
              value={newSession.name}
              onChange={(e) =>
                setNewSession({ ...newSession, name: e.target.value })
              }
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newSession.is_current}
                onChange={(e) =>
                  setNewSession({
                    ...newSession,
                    is_current: e.target.checked,
                  })
                }
              />
              <span className="text-sm">Set as current</span>
            </div>

            <Button onClick={handleCreate}>Create</Button>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sessions list */}
      <Card>
        <CardHeader>
          <CardTitle>All Sessions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex justify-between items-center border p-3 rounded-md"
            >
              <div>
                <p className="font-medium">{session.name}</p>

                {session.is_current && (
                  <span className="text-xs text-green-600">
                    Current Session
                  </span>
                )}
              </div>

              <Button
                variant={session.is_current ? "secondary" : "outline"}
                disabled={session.is_current}
                onClick={() => handleSetCurrent(session.id)}
              >
                {session.is_current ? "Active" : "Set Current"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}