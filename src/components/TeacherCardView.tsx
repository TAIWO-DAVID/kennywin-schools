'use client'

import { Trash2, Edit, BookOpen, Mail } from 'lucide-react'
// import { Teacher } from '@/hooks/useTeachersData'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Teacher } from '@/types'
import { getClassName } from '@/utils/school/classes/classes'
import { Class } from "@/types/class"

interface TeacherCardViewProps {
  teacher: Teacher
  isSelected: boolean
  onSelect: (checked: boolean) => void
  assignmentCount: number
  classTeacherClass?: Class | null 
  onEdit: () => void
  onAssign: () => void
  onViewAssignments: () => void
  // onSendInvitation: () => void
  onDelete: () => void
}

export function TeacherCardView({
  teacher,
  isSelected,
  onSelect,
  assignmentCount,
  classTeacherClass,
  onEdit,
  onAssign,
  onViewAssignments,
  // onSendInvitation,
  onDelete,
}: TeacherCardViewProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
  }

  return (
    <Card
      className="
        group relative overflow-hidden
        rounded-xl border border-slate-200/70
        bg-white shadow-sm
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-2xl
      "
    >
      {/* top glow */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

      {/* selection */}
      <div className="absolute right-3 top-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          className="h-4 w-4 cursor-pointer accent-primary"
        />
      </div>

      {/* HEADER */}
      <CardHeader className="pt-2 pb-2">
        <div className="flex flex-col items-center gap-1.5">

          <Avatar className="h-16 w-16 border-2 border-slate-200">
            <AvatarImage
              src={teacher.profile_img || "/placeholder.png"}
              alt={`${teacher.first_name} ${teacher.last_name}`}
            />
            <AvatarFallback className="text-base font-semibold">
              {getInitials(teacher.first_name, teacher.last_name)}
            </AvatarFallback>
          </Avatar>

          <div className="text-center space-y-0.5">
            <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
              {teacher.first_name} {teacher.last_name}
            </h3>

            <p className="text-xs text-slate-400">
              {teacher.email}
            </p>
          </div>

          {classTeacherClass && (
            <Badge className="mt-2 bg-primary/10 text-primary hover:bg-primary/15">
              Class Teacher • {getClassName(classTeacherClass)}
            </Badge>
          )}
        </div>
      </CardHeader>

      {/* BODY */}
      <CardContent className="space-y-1.5">

        {/* STATUS */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Status</span>

          <Badge
            variant="secondary"
            className={statusColors[teacher.status as keyof typeof statusColors]}
          >
            {teacher.status}
          </Badge>
        </div>

        {/* PHONE */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">Phone</span>
          <span className="font-medium text-slate-700">
            {teacher.phone_number || "N/A"}
          </span>
        </div>

        {/* ASSIGNMENTS */}
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-2.5 py-1.5">
          <span className="text-xs font-medium text-slate-600">
            Assignments
          </span>

          <Badge className="bg-slate-900 text-white">
            {assignmentCount}
          </Badge>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-2 gap-2 pt-2">

          <Button
            variant="outline"
            size="sm"
            onClick={onViewAssignments}
            className="h-8 text-xs hover:bg-slate-100 active:scale-95"
          >
            <BookOpen size={14} className="mr-1" />
            View
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onAssign}
            className="h-8 text-xs hover:bg-slate-100 active:scale-95"
          >
            <Edit size={14} className="mr-1" />
            Assign
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[11px] hover:bg-slate-100 active:scale-95"
          >
            <Mail size={14} className="mr-1" />
            Invite
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="h-8 text-xs text-red-500 hover:bg-red-50 hover:text-red-600 active:scale-95"
          >
            <Trash2 size={14} className="mr-1" />
            Delete
          </Button>

        </div>
      </CardContent>

      {/* hover glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
    </Card>
  )
}
