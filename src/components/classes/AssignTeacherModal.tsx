import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import type { Class } from "@/types"
import type { Teacher } from "@/types"

interface AssignTeacherModalProps {
  open: boolean
  classItem: Class | null
  teachers: Teacher[]
  onClose: () => void
  onAssign: (teacherId: string) => void
}

export default function AssignTeacherModal({
  open,
  classItem,
  teachers,
  onClose,
  onAssign,
}: AssignTeacherModalProps) {
  const [teacherId, setTeacherId] = useState("")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>
          Assign Class Teacher - {classItem ? `${classItem.level} ${classItem.grade} ${classItem.stream || ""}` : ""}
        </DialogTitle>

        <Select value={teacherId} onValueChange={setTeacherId}>
          <SelectTrigger>
            <SelectValue placeholder="Choose teacher" />
          </SelectTrigger>

          <SelectContent>
            {teachers.map((t) => (
              <SelectItem key={t.teacher_id} value={t.teacher_id}>
                {t.first_name} {t.last_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={() => onAssign(teacherId)} >
            Assign
        </Button>
      </DialogContent>
    </Dialog>
  )
}