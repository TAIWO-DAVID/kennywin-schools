"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect, useMemo, useRef } from "react"
import { useAuthStore } from "@/store/useStore"
import supabase from "@/lib/supabase/supabaseClient"
import type { Student } from "@/types/student"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { StudentDetailsModal } from "@/components/student-details-modal"
import { AddStudentModal } from "@/components/add-student-modal"
import {
  Search,
  Users,
  GraduationCap,
  TrendingUp,
  UserCheck,
  UserX,
  Eye,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { getClassName } from "@/utils/school/classes/classes"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { getStudents } from "@/lib/students"
import { useGroupedStudents } from "@/hooks/useGroupedStudent"

export default function StudentDashboard() {
  const user = useAuthStore((state) => state.user)
  const router = useRouter()

  const [students, setStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([])

  const [pageByClass, setPageByClass] = useState<Record<string, number>>({})
  const [itemsPerPage, setItemsPerPage] = useState(6)

  // HELPERS

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    )
  }

  const toggleGroup = (students: Student[]) => {
    const ids = students
      .map((s) => s.id)
      .filter((id): id is string => Boolean(id))

    const allSelected = ids.every((id) =>
      selectedStudents.includes(id)
    )

    if (allSelected) {
      setSelectedStudents((prev) =>
        prev.filter((id) => !ids.includes(id))
      )
    } else {
      setSelectedStudents((prev) => [
        ...new Set([...prev, ...ids]),
      ])
    }
  }

  const handleDelete = (ids: string[]) => {
    if (!ids.length) return

    const backup = students

    // ✅ close modal immediately
    setIsDeleteOpen(false)

    // ✅ clear selection (THIS FIXES YOUR STICKY HEADER)
    setSelectedStudents([])

    // optimistic UI update
    setStudents((prev) => prev.filter((s) => !ids.includes(s.id)))

    let timeout: NodeJS.Timeout

    const undo = (toastId: string) => {
      clearTimeout(timeout)
      setStudents(backup)

      // restore selection too (optional but cleaner UX)
      setSelectedStudents(ids)

      toast.success("Restored")
      toast.dismiss(toastId)
    }

    const toastId = toast(
      (t) => (
        <div className="flex items-center gap-3">
          <span>
            {ids.length === 1
              ? "Student deleted"
              : `${ids.length} students deleted`}
          </span>

          <button
            onClick={() => undo(t.id)}
            className="text-primary font-medium"
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

  const getInitials = (name?: string) => {
    if (!name) return "NA"
    const parts = name.split(" ")
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase()
  }

  const LEVEL_ORDER = ["Creche", "KG", "Nursery", "Primary", "JSS", "SSS"]

  // FETCH

  useEffect(() => {
    setIsLoading(true)
    const loadStudents = async () => {
      try {
        const data = await getStudents()
        setStudents(data)
      } catch (err) {
        console.error("Failed to load students:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadStudents()
  }, [])

  const groupedData = useGroupedStudents(students, searchQuery)

  // RESPONSIVE PAGINATION
  useEffect(() => {
    const update = () => {
      setItemsPerPage(window.innerWidth < 640 ? 2 : window.innerWidth < 1024 ? 3 : 6)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  const handlePageChange = (key: string, page: number) => {
    setPageByClass((prev) => ({ ...prev, [key]: page }))
  }

  const stats = {
    total: students.length,
    active: students.filter((s) => s.status === "active").length,
    inactive: students.filter((s) => s.status === "inactive").length,
  }

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="animate-pulse h-6 w-40 bg-muted rounded mb-4" />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Students
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Manage students and enrollment
        </p>
      </div>

      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-40 px-4 md:px-0 py-3 md:py-3">
        <div className="
            mx-0 
            md:max-w-7xl md:mx-auto md:px-4 lg:px-6

            bg-background/0 backdrop-blur border-b
            md:bg-background/0
            md:rounded-md

            rounded-none
          ">
          {selectedStudents.length > 0 ? (
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-foreground">
                {selectedStudents.length} student
                {selectedStudents.length > 1 ? "s" : ""} selected
              </span>

              <div className="flex items-center gap-2">
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
          ) : (
            <div className="flex flex-col md:flex-row items-stretch gap-3 p-3 border-2">
              <div className="group relative flex-1">
                <div
                  className="
                    pointer-events-none absolute inset-0
                    rounded-xl
                    opacity-0
                    transition duration-300
                    group-hover:opacity-100
                    bg-gradient-to-r
                    from-primary/5
                    via-primary/10
                    to-primary/5
                    blur-xl
                  "
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students..."
                  className="
                    w-full pl-9 pr-3 py-2.5
                    h-10
                    rounded-lg
                    text-sm bg-white
                    focus-visible:ring-2
                    focus-visible:ring-primary/20
                    focus-visible:outline-none

                    group-hover:border-primary/40
                    group-hover:shadow-lg
                  "
                />
              </div>

              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="
                  h-10
                  flex items-center justify-center gap-2
                  rounded-lg
                  w-full md:w-auto
                "
              >
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8">
        {/* STATS */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <Card className="md:flex-1 w-full flex h-24 sm:h-32 min-w-[100px]">
            <CardContent className="flex flex-auto flex-col sm:flex-col items-center justify-center gap-1 text-sm">
              <Users className="mb-1 sm:mb-0" />
              <span className="sm: text-xs">{stats.total} Total</span>
            </CardContent>
          </Card>

          <Card className="md:flex-1 flex-1 h-24 sm:h-32 min-w-[100px] flex">
            <CardContent className="flex flex-auto flex-col items-center justify-center gap-1 text-sm">
              <UserCheck className="mb-1 sm:mb-0" />
              <span className="sm: text-xs">{stats.active} Active</span>
            </CardContent>
          </Card>

          <Card className="md:flex-1 flex-1 h-24 sm:h-32 min-w-[100px]">
            <CardContent className="flex flex-auto flex-col items-center justify-center gap-1 text-sm">
              <UserX className="mb-1 sm:mb-0" />
              <span className="sm: text-xs">{stats.inactive} Inactive</span>
            </CardContent>
          </Card>

          <Card className="md:flex-1 w-full min-w-[100px]">
            <CardContent className="flex flex-auto flex-col sm:flex-row items-center justify-center gap-1 text-sm">
              <TrendingUp className="mb-1 sm:mb-0" />
              {/* <span>{stats.total}% Avg</span> */}
            </CardContent>
          </Card>
        </div>

        {/* Sticky Header for Selection */}
        {/* {selectedStudents.length > 0 && (
        <div
          className="
            sticky top-0 z-40
            flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3
            bg-white
            border-b
            px-4 sm:px-6 py-3
            shadow-sm
            animate-in slide-in-from-top-2 fade-in
          "
        >
            <span className="text-sm font-semibold text-foreground">
              {selectedStudents.length} student{selectedStudents.length > 1 ? "s" : ""} selected
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedStudents([])}
                className="flex-1 sm:flex-none"
              >
                Clear
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => setIsDeleteOpen(true)}
                className="flex-1 sm:flex-none"
              >
                Delete
              </Button>
            </div>
          </div>
        )} */}

        {/* GROUPED STUDENTS */}
        <div className="space-y-6">
          {(groupedData || []).map((group) => {
            const currentPage = pageByClass[group.name] || 1
            const totalPages = Math.ceil(group.students.length / itemsPerPage)

            const paginated = group.students.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )

            const allSelected = group.students.every(
              (s: Student) => s.id && selectedStudents.includes(s.id)
            )

            return (
              <div key={group.name} className="space-y-4">
                {/* Class Title */}
                <div className="flex flex-row items-center sm:justify-between gap-3">
                  <button
                    onClick={() => router.push(`/admin/classes/${group.classId}`)}
                    className="
                      group w-full
                      flex items-center justify-between
                      rounded-xl px-4 py-3
                      transition-all duration-200
                      hover:bg-slate-50
                      active:scale-[0.99]
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
                    "
                  >
                    {/* LEFT */}
                    <div className="flex items-center gap-3 min-w-0">
                      
                      {/* Subtle icon badge */}
                      {/* <div className="
                        h-9 w-9 flex items-center justify-center
                        rounded-lg bg-primary/10
                        text-primary
                        text-xs font-semibold
                      ">
                        // {group.name.slice(0, 2)}
                      </div> */}

                      {/* Text */}
                      <div className="flex gap-3 leading-tight min-w-0">
                        <h3 className="flex-row
                          text-sm sm:text-base font-semibold text-slate-900
                          truncate
                          transition-colors
                          group-hover:text-primary
                        ">
                          {group.name}
                        </h3>

                        <p className="flex-row self-center text-xs text-slate-500">
                          {group.students.length}{" "}
                          {group.students.length === 1 ? "student" : "students"}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <ChevronRight
                      size={18}
                      className="
                        text-slate-400
                        transition-all duration-200
                        group-hover:text-primary
                        group-hover:translate-x-1
                      "
                    />
                  </button>
                  {/* Action */}
                  <div
                    onClick={() => toggleGroup(group.students)}
                    className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-muted rounded-lg transition"
                  >
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => {
                        e.stopPropagation()
                        toggleGroup(group.students)
                      }}
                      className="h-4 w-4 cursor-pointer"
                    />

                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                      {allSelected ? "Unselect all" : "Select all"}
                    </span>
                  </div>
                </div>

                {/* Students Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {paginated.length === 0 && (
                    <div className="col-span-full text-center py-8 text-sm text-muted-foreground">
                      No students found
                    </div>
                  )}

                  {paginated.map((student: Student) => (
                    <Card
                      key={student.id}
                      onClick={(e) => {
                        const target = e.target as HTMLElement
                        if (target.closest("input")) return

                        setSelectedStudent(student)
                        setIsModalOpen(true)
                      }}
                      className="
                        group relative overflow-hidden
                        rounded-xl border border-slate-200/70
                        bg-white shadow-sm
                        transition-all duration-300 ease-out
                        hover:-translate-y-1
                        hover:shadow-xl
                        cursor-pointer
                      "
                    >
                      {/* top glow */}
                      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

                      <CardContent className="p-4">

                        <div className="flex items-start justify-between gap-3">

                          {/* LEFT */}
                          <div className="flex items-center gap-3 min-w-0 flex-1">

                            {/* checkbox */}
                            <input
                              type="checkbox"
                              checked={
                                student.id
                                  ? selectedStudents.includes(student.id)
                                  : false
                              }
                              onChange={() => {
                                if (!student.id) return
                                toggleStudent(student.id)
                              }}
                              className="h-4 w-4 cursor-pointer accent-primary"
                            />

                            {/* avatar */}
                            <Avatar className="h-11 w-11 border border-slate-200 flex-shrink-0">
                              <AvatarFallback
                                className="
                                  text-xs font-semibold
                                  bg-primary text-white
                                "
                              >
                                {getInitials(
                                  `${student.first_name} ${student.last_name}`
                                )}
                              </AvatarFallback>
                            </Avatar>

                            {/* details */}
                            <div className="min-w-0 space-y-1">

                              <p
                                className="
                                  truncate text-sm font-semibold text-slate-900
                                  transition-colors duration-300
                                  group-hover:text-primary
                                "
                              >
                                {student.first_name} {student.last_name}
                              </p>

                              <p className="truncate text-xs text-slate-400">
                                {getClassName(student.classes)}
                              </p>

                              {/* optional extra info */}
                              {student.gender && (
                                <div className="pt-1">
                                  <span
                                    className="
                                      inline-flex items-center rounded-full
                                      bg-slate-100 px-2 py-0.5
                                      text-[10px] font-medium text-slate-600
                                    "
                                  >
                                    {student.gender}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* ACTION */}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="
                              h-8 w-8 flex-shrink-0
                              text-slate-400
                              transition-all duration-200
                              hover:bg-slate-100
                              hover:text-primary
                              group-hover:opacity-100
                              opacity-70
                              self-center
                            "
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedStudent(student)
                              setIsModalOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>

                      {/* hover layer */}
                      <div
                        className="
                          pointer-events-none
                          absolute inset-0 rounded-xl
                          opacity-0 transition duration-300
                          group-hover:opacity-100
                          bg-gradient-to-br
                          from-primary/5
                          via-transparent
                          to-transparent
                        "
                      />
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-row sm:flex-row justify-center items-center gap-3 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() =>
                        handlePageChange(group.name, Math.max(1, currentPage - 1))
                      }
                      // className="w-full sm:w-auto"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>

                    <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                      Page {currentPage} of {totalPages}
                    </span>

                    <Button
                      size="sm"
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() =>
                        handlePageChange(group.name, Math.min(totalPages, currentPage + 1))
                      }
                      // className="w-full sm:w-auto"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Delete confirmation modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md rounded-lg">
          <DialogHeader>
            <DialogTitle>Delete Students</DialogTitle>
          </DialogHeader>

          <div className="text-sm text-muted-foreground">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {selectedStudents.length}
            </span>{" "}
            student{selectedStudents.length > 1 ? "s" : ""}?
            <br />
            <span className="text-xs text-destructive">This action cannot be undone.</span>
          </div>

          <DialogFooter className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={selectedStudents.length === 0 || isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              onClick={() => handleDelete([...selectedStudents])}
              disabled={isDeleting}
              className="flex-1"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onStudentAdded={(s) => setStudents((prev) => [...prev, s])}
      />

      <StudentDetailsModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
