"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarUpload } from "@/components/AvatarUpload"
import toast from "react-hot-toast"
import { User } from "lucide-react"

interface AddTeacherModalProps {
  isOpen: boolean
  onClose: () => void
  onTeacherAdded?: () => void
}

export function AddTeacherModal({ isOpen, onClose, onTeacherAdded }: AddTeacherModalProps) {
  const [loading, setLoading] = useState(false)
  const [newTeacher, setNewTeacher] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    profile_img: "",
  })

  const handleAddTeacher = async () => {
    if (!newTeacher.first_name || !newTeacher.last_name || !newTeacher.email) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...newTeacher,
        profile_img: newTeacher.profile_img || null,
        role: "staff",
      }

      if (!payload.profile_img) {
        payload.profile_img = null
      }

      const res = await fetch("/api/admin/teachers/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTeacher,
          profile_img: newTeacher.profile_img || null,
          role: "staff", // attach role metadata
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send invite")

      onTeacherAdded?.()
      setNewTeacher({ first_name: "", last_name: "", email: "", phone_number: "", profile_img: "" })
      onClose()
      toast.success(`Invite sent to ${newTeacher.email}`)
    } catch (error: any) {
      console.error("[AddTeacherModal] Failed:", error)
      toast.error(error.message || "Failed to add teacher")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            Add New Teacher
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="mx-auto">
            <AvatarUpload
              teacherName={`${newTeacher.first_name} ${newTeacher.last_name}`}
              currentAvatarUrl={newTeacher.profile_img}
              onAvatarChange={(url) => setNewTeacher({ ...newTeacher, profile_img: url })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <Label>First Name *</Label>
              <Input
                placeholder="John"
                value={newTeacher.first_name}
                onChange={(e) => setNewTeacher({ ...newTeacher, first_name: e.target.value })}
              />
            </div>

            <div className="flex flex-col space-y-1">
              <Label>Last Name *</Label>
              <Input
                placeholder="Doe"
                value={newTeacher.last_name}
                onChange={(e) => setNewTeacher({ ...newTeacher, last_name: e.target.value })}
              />
            </div>

            <div className="flex flex-col space-y-1 sm:col-span-2">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="teacher@email.com"
                value={newTeacher.email}
                onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
              />
            </div>

            <div className="flex flex-col space-y-1 sm:col-span-2">
              <Label>Phone Number</Label>
              <Input
                placeholder="+234 901 234 5678"
                value={newTeacher.phone_number}
                onChange={(e) => setNewTeacher({ ...newTeacher, phone_number: e.target.value })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleAddTeacher} disabled={loading}>
            {loading ? "Sending Invite..." : "Add Teacher"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}