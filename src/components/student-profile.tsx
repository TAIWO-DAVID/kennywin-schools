"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StudentAvatar } from "./student-avatar"
import type { Student } from "@/types/student"
import { User, Mail, MapPin, Calendar, GraduationCap, BookOpen } from "lucide-react"

interface StudentProfileProps {
  student: Student
}

export function StudentProfile({ student }: StudentProfileProps) {

  const getClassName = (cls?: any) => {
    if (!cls) return "Unassigned"

    return [cls.level, cls.grade, cls.stream]
      .filter(Boolean)
      .join(" ")
  }

  const getEducationLevelDisplay = (level: string) => {
    const levels = {
      "early-years": "Early Years",
      primary: "Primary",
      "junior-secondary": "Junior Secondary",
      "senior-secondary": "Senior Secondary",
    }
    return levels[level as keyof typeof levels] || level
  }

  const getStreamColor = (stream?: string) => {
    const colors = {
      science: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      arts: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      commercial: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    }
    return colors[stream as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  }

  return (
    <div className="animate-slide-in">
      <Card className="shadow-lg border-0 bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <StudentAvatar firstName={student.first_name} lastName={student.last_name} size="lg" />
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-balance">
                {student.first_name} {student.middle_name} {student.last_name}
              </CardTitle>
              <p className="text-muted-foreground text-lg">Student ID: {student.student_id}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-sm">
                  {student.status}
                </Badge>
                {student.stream && (
                  <Badge className={getStreamColor(student.stream)}>
                    {/* {student.stream.charAt(0).toUpperCase() + student.stream.slice(1)} */}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span>{student.email || "Not provided"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span>{new Date(student.dob).toLocaleDateString()}</span>
                  {student.age && <span className="text-muted-foreground">({student.age} years)</span>}
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Gender:</span>
                  <span>{student.gender}</span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="text-muted-foreground">Address:</span>
                  <span className="flex-1">{student.address}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Academic Information
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Level:</span>
                  <span>{getEducationLevelDisplay(student.educational_level)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Class:</span>
                  <span>{getClassName(student) ?? "Not assigned"}</span>
                </div>

                {student.stream && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Stream:</span>
                    {/* <span>{student.stream.charAt(0).toUpperCase() + student.stream.slice(1)}</span> */}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {/* Subjects ({student.subjects.length}) */}
            </h3>

            {/* <div className="flex flex-wrap gap-2">
              {student.subjects.map((subject, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {subject}
                </Badge>
              ))}
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
