import { useState } from "react"
import supabase from "@/lib/supabase/supabaseClient"
import toast from "react-hot-toast"
import { Student } from "@/types/student"

export function useStudentsManager(initial: Student[]) {
  const [students, setStudents] = useState<Student[]>(initial)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    )
  }

  const deleteStudents = (ids: string[]) => {
    if (!ids.length) return

    const backup = students

    setStudents((prev) =>
      prev.filter((s) => !ids.includes(s.id))
    )
    setSelectedStudents([])

    let timeout: NodeJS.Timeout | null = null

    const undo = (toastId: string) => {
      if (timeout) clearTimeout(timeout)
      setStudents(backup)
      setSelectedStudents(ids)
      toast.success("Restored")
      toast.dismiss(toastId)
    }

    const toastId = toast.success(
      (t) => (
        <div className="flex items-center gap-2">
          <span>
            {ids.length === 1
              ? "Student deleted"
              : `${ids.length} students deleted`}
          </span>

          <button
            onClick={() => undo(t.id)}
            className="text-blue-600 font-medium"
          >
            Undo
          </button>
        </div>
      ),
      { duration: 5000 }
    )

    timeout = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from("students")
          .delete()
          .in("id", ids)

        if (error) throw error

        toast.dismiss(toastId)
      } catch (err: any) {
        toast.error(err.message || "Delete failed")
        setStudents(backup)
      }
    }, 5000)
  }

  return {
    students,
    setStudents,
    selectedStudents,
    toggleStudent,
    deleteStudents,
    setSelectedStudents,
  }
}