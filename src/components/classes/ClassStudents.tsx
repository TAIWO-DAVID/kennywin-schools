"use client"

import { useState, useMemo, useRef } from "react"
import type { Student } from "@/types/student"
import supabase from "@/lib/supabase/supabaseClient"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import {
  Search,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

type Props = {
  students: Student[]
  onStudentClick?: (student: Student) => void
}

export function ClassStudents({ students, onStudentClick }: Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [page, setPage] = useState(1)
  const itemsPerPage = 6

  const backupRef = useRef<Student[]>(students)

  // =========================
  // HELPERS
  // =========================

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    )
  }

  const toggleAll = (list: Student[]) => {
    const ids = list.map((s) => s.id!).filter(Boolean)

    const allSelected = ids.every((id) =>
      selectedStudents.includes(id)
    )

    if (allSelected) {
      setSelectedStudents((prev) =>
        prev.filter((id) => !ids.includes(id))
      )
    } else {
      setSelectedStudents(ids)
    }
  }

  const getInitials = (name?: string) => {
    if (!name) return "NA"
    const parts = name.split(" ")
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : parts[0][0].toUpperCase() +
          parts[parts.length - 1][0].toUpperCase()
  }

  // =========================
  // FILTER
  // =========================

  const filtered = useMemo(() => {
    return students.filter((student) => {
      const fullName =
        `${student.first_name} ${student.last_name}`.toLowerCase()

      return fullName.includes(searchQuery.toLowerCase())
    })
  }, [students, searchQuery])

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const paginated = filtered.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  // =========================
  // DELETE (WITH UNDO)
  // =========================

  const handleDelete = (ids: string[]) => {
    if (!ids.length) return

    const backup = students

    setIsDeleteOpen(false)
    setSelectedStudents([])

    // optimistic UI handled by parent ideally
    let timeout: NodeJS.Timeout

    const toastId = toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span>
            {ids.length === 1
              ? "Student deleted"
              : `${ids.length} students deleted`}
          </span>

          <button
            onClick={() => {
              clearTimeout(timeout)
              toast.dismiss(t.id)
              toast.success("Restored")
            }}
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
      }
    }, 5000)
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-4">

      {/* SEARCH + ACTIONS */}
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students..."
            className="pl-9 pr-3 py-2 border rounded-md w-full"
          />
        </div>

        {filtered.length > 0 && (
          <button
            onClick={() => toggleAll(filtered)}
            className="text-sm text-muted-foreground hover:text-black"
          >
            Select all
          </button>
        )}
      </div>

      {/* BULK ACTION BAR */}
      {selectedStudents.length > 0 && (
        <div className="flex items-center justify-between bg-white border rounded-md px-4 py-2 shadow-sm">
          <span className="text-sm font-medium">
            {selectedStudents.length} selected
          </span>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedStudents([])}
            >
              Clear
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* STUDENTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {paginated.length === 0 && (
          <div className="col-span-full text-center py-8 text-sm text-muted-foreground">
            No students found
          </div>
        )}

        {paginated.map((student) => (
          <Card
            key={student.id}
            className="hover:bg-muted/30 cursor-pointer"
            onClick={(e) => {
              const target = e.target as HTMLElement
              if (target.closest("input")) return

              onStudentClick?.(student)
            }}
          >
            <CardContent className="px-3 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={
                    student.id
                      ? selectedStudents.includes(student.id)
                      : false
                  }
                  onChange={(e) => {
                    e.stopPropagation()
                    if (student.id) toggleStudent(student.id)
                  }}
                />

                <Avatar className="h-9 w-9">
                  <AvatarFallback className="text-xs">
                    {getInitials(
                      `${student.first_name} ${student.last_name}`
                    )}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="text-sm font-semibold">
                    {student.first_name} {student.last_name}
                  </p>
                </div>
              </div>

              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-muted-foreground hover:text-gray-900"                
                onClick={(e) => {
                  e.stopPropagation()
                  onStudentClick?.(student)
                }}
              >
                <Eye size={16} />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={16} />
          </Button>

          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>

          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* DELETE MODAL */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Students</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <strong>{selectedStudents.length}</strong> student
            {selectedStudents.length > 1 ? "s" : ""}?
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => handleDelete(selectedStudents)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}