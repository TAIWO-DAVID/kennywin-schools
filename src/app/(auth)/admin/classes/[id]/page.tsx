
"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import supabase from "@/lib/supabase/supabaseClient"
import { Class } from "@/types"
import type { Student } from "@/types/student"
import { ClassHeader } from "@/components/classes/ClassHeader"
// import { ClassStudents } from "@/components/classes/ClassStudents2"
import LoadingSpinner from "@/components/LoadingSpinner"
import toast from "react-hot-toast"
import { StudentDetailsModal } from "@/components/student-details-modal"
import { AddStudentModal } from "@/components/add-student-modal"
import { EditClassModal } from "@/components/classes/EditClassModal"
import { useClasses } from "@/hooks/useClasses"
import AssignTeacherModal from "@/components/classes/AssignTeacherModal"
import { useTeachersData } from "@/hooks/useTeachersData"
import { StudentsSection } from "@/features/students/StudentsSection"
import { useStudentsManager } from "@/hooks/useStudentsManager"

export default function ClassDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { teachers } = useTeachersData()
  const { handleUpdateClass } = useClasses()

  const [classData, setClassData] = useState<Class | null>(null)

  const {
    students,
    setStudents,
    selectedStudents,
    toggleStudent,
    deleteStudents,
    setSelectedStudents,
  } = useStudentsManager([])

  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [editingClass, setEditingClass] = useState<Class | null>(null)

  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editForm, setEditForm] = useState({ level: '', grade: '', stream: '' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const classId = Number(id)

        // FETCH CLASS
        const { data: cls, error: classError } = await supabase
          .from("classes")
          .select(`
            *,
            class_teacher:teachers!class_teacher_id (
              first_name,
              last_name
            )
            `)
          .eq("id", classId)
          .single()

        if (classError || !cls) throw new Error("Class not found")

        setClassData(cls)

        // FETCH STUDENTS
        const { data: studentsData, error: studentError } = await supabase
          .from("students")
          .select("*")
          .eq("class_id", classId)

        if (studentError) throw studentError

        setStudents(studentsData || [])

      } catch (err: any) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchData()
  }, [id])

  const handleAssignTeacher = (cls: Class) => {
    setSelectedClass(cls)
    setIsAssignOpen(true)
  }

  const handleEditClass = (cls: Class) => {
    setEditingClass(cls)
    setEditForm({
      level: cls.level || "",
      grade: cls.grade?.toString() || "",
      stream: cls.stream || "",
    })
    setIsEditOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !classData) {
    console.log(classData)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <p className="text-lg font-semibold text-red-600">
          {error || "Class not found"}
        </p>

        <button
          onClick={() => router.push("/admin/classes")}
          className="text-sm text-blue-600 underline"
        >
          Go back to classes
        </button>
      </div>
    )
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="space-y-6 p-2">

      {/* HEADER */}
      <ClassHeader
        cls={classData}
        studentCount={students.length}
        onAssignTeacher={() => handleAssignTeacher(classData)}
        onEditClass={() => handleEditClass(classData)}
      />

      {/* STUDENTS */}
      {/* <ClassStudents
        students={students}
        onStudentClick={(student) => {
          setSelectedStudent(student)
          setIsStudentModalOpen(true)
        }}
      /> */}
      <StudentsSection
        students={students}
        selectedStudents={selectedStudents}
        onToggleStudent={toggleStudent}
        onDelete={() => deleteStudents(selectedStudents)}
        onClear={() => setSelectedStudents([])}
        onStudentClick={(student) => {
          setSelectedStudent(student)
          setIsStudentModalOpen(true)
        }}
      />

      {/* MODALS */}
      <StudentDetailsModal
        student={selectedStudent}
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
      />

      <AddStudentModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onStudentAdded={(s) => setStudents((prev) => [...prev, s])}
      />

      <EditClassModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        form={editForm}
        setForm={setEditForm}
        onSubmit={async () => {
          if (!classData) return

          const success = await handleUpdateClass(classData.id, editForm)

          if (success) {
            setIsEditOpen(false)
          }
        }}
      />

      <AssignTeacherModal
        open={isAssignOpen}
        classItem={selectedClass}
        teachers={teachers}
        onClose={() => setIsAssignOpen(false)}
        onAssign={async (teacherId) => {
          if (!selectedClass) return
          setIsAssignOpen(false)
          router.refresh()
        }}
      />

    </div>
  )
}
