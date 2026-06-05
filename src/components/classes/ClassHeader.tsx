"use client"

import { Class } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, Edit } from "lucide-react"

type Props = {
  cls: Class
  studentCount: number
  onAssignTeacher: () => void
  onEditClass: () => void
}

export function ClassHeader({
  cls,
  studentCount,
  onAssignTeacher,
  onEditClass,
}: Props) {

  const getClassName = () => {
    return [cls.level, cls.grade, cls.stream]
      .filter(Boolean)
      .join(" ")
  }

  return (
    <Card className="border shadow-sm pt-2 pb-2">
      <CardContent className="p-5 space-y-5">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Class Info */}
          <div>
            <h1 className="text-2xl font-bold text-[#020618]">
              {getClassName()}
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage class details, teacher, and students
            </p>
          </div>

          {/* Actions */}
          <div className="flex md:gap-1.5 gap-1.5 justify-between">
            <Button variant="outline" onClick={onEditClass}>
              <Edit className="mr-0 md:mr-2 h-4 w-4" />
              Edit Class
            </Button>

            <Button onClick={onAssignTeacher}>
              <UserCheck className="mr-0 md:mr-2 h-4 w-4" />
              {cls.class_teacher_id ? "Change Teacher" : "Assign Teacher"}
            </Button>
          </div>
        </div>

        {/* TEACHER + STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Teacher */}
          <div className="rounded-lg bg-muted p-4 flex flex-col justify-center">
            <span className="text-xs text-muted-foreground">
              Class Teacher
            </span>
            <span className="text-sm font-semibold text-primary mt-1">
              {cls.class_teacher
              ? `${cls.class_teacher.first_name} ${cls.class_teacher.last_name}`
              : "Not assigned"}
            </span>
          </div>

          {/* Students Count */}
          <div className="rounded-lg bg-muted p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground">
                Students
              </span>
              <p className="text-lg font-semibold">{studentCount}</p>
            </div>

            <Users className="h-5 w-5 text-muted-foreground" />
          </div>

          {/* Status */}
          <div className="rounded-lg bg-muted p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground">
                Status
              </span>

              <div className="mt-1">
                <Badge variant={cls.status === "active" ? "default" : "secondary"}>
                  {cls.status}
                </Badge>
              </div>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
