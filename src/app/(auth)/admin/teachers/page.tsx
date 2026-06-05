'use client'

import { supabase } from '@/lib/supabase/supabaseClient'
import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  Search,
  Plus,
  Trash2,
  Edit,
  BookOpen,
  ArrowUpDown,
  GripVertical,
  LayoutGrid,
  LayoutList,
  Mail,
  Users,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { AvatarUpload } from '@/components/AvatarUpload'
import { TeacherCardView } from '@/components/TeacherCardView'
import toast from 'react-hot-toast'
import { AddTeacherModal } from '@/components/add-teacher-modal'
import { getClassName } from '@/utils/school/classes/classes'
import { Teacher } from '@/types/teacher'
import { useClasses } from '@/hooks/useClasses'
import { useTeachersData } from '@/hooks/useTeachersData'
import { useTeacherAssignmentSystem } from '@/hooks/useTeacherAssignmentSystem'
import { useClassTeacherSync } from '@/hooks/useClassTeacherSync'
import { AssignmentsModal } from '@/components/AssignmentsModal'
import { AssignClassesModal } from '@/components/AssignClassesModal'
import { ClassTeacherModal } from '@/components/ClassTeacherModal'

const ITEMS_PER_PAGE = 6

/**
 * Refactored Teachers Management Page
 * 
 * Responsibilities:
 * - State management for UI (search, sort, view mode, modals)
 * - Fetch and organize data
 * - Delegate operations to hooks and modals
 * 
 * Does NOT:
 * - Handle grouping logic (moved to AssignmentsModal)
 * - Mix concerns between operations and UI
 * - Call Supabase directly (everything goes through hooks)
 */

export default function TeachersComponent() {
  // ===========================
  // HOOKS
  // ===========================
  const { classes, fetchClasses } = useClasses()

  const {
    assignments,
    loading: assignmentsLoading,
    loadingStates,
    fetchAssignments,
    assignSubjectsToClass,
    removeAssignment,
    removeClassAssignments,
    getTeacherAssignments,
    isLoadingForClass,
    isRemovingAssignment,
    isRemovingClassAssignments,
  } = useTeacherAssignmentSystem()

  const {
    teachers,
    subjects,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    deleteMultipleTeachers,
  } = useTeachersData()

  const {
    classes: classesWithTeachers,
    assignClassTeacher: syncAssignClassTeacher,
  } = useClasses()

  // ===========================
  // UI STATE
  // ===========================
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [sortAsc, setSortAsc] = useState(true)
  const [draggedTeacherId, setDraggedTeacherId] = useState<number | null>(null)
  const [reorderedTeachers, setReorderedTeachers] = useState<Teacher[]>(teachers)
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')
  const [currentPage, setCurrentPage] = useState(1)

  // ===========================
  // MODAL STATE
  // ===========================
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null)
  const [assignTeacher, setAssignTeacher] = useState<Teacher | null>(null)
  const [viewAssignments, setViewAssignments] = useState<Teacher | null>(null)
  const [classTeacherTeacher, setClassTeacherTeacher] = useState<Teacher | null>(
    null
  )
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean
    teacherId: string | null
    isMultiple: boolean
  }>({
    open: false,
    teacherId: null,
    isMultiple: false,
  })

  const [newTeacher, setNewTeacher] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    profile_img: null as string | null,
  })

  // Update reorderedTeachers when teachers change
  useEffect(() => {
    setReorderedTeachers(teachers)
  }, [teachers])

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // ===========================
  // FILTERS & PAGINATION
  // ===========================
  const filteredTeachers = useMemo(() => {
    return reorderedTeachers
      .filter(
        (t) =>
          t.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const nameA = `${a.first_name} ${a.last_name}`
        const nameB = `${b.first_name} ${b.last_name}`
        return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
      })
  }, [reorderedTeachers, searchTerm, sortAsc])

  const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE)
  const paginatedTeachers = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredTeachers.slice(startIdx, startIdx + ITEMS_PER_PAGE)
  }, [filteredTeachers, currentPage])

  // ===========================
  // HANDLERS - TEACHER OPERATIONS
  // ===========================
  const handleUpdateTeacher = () => {
    if (!editTeacher) return
    updateTeacher(editTeacher.id, editTeacher)
    setEditTeacher(null)
    toast.success('Teacher updated successfully')
  }

  const handleDeleteTeacher = (id: string) => {
    setDeleteConfirmation({ open: true, teacherId: id, isMultiple: false })
  }

  const handleDeleteMultiple = () => {
    setDeleteConfirmation({ open: true, teacherId: null, isMultiple: true })
  }

  const confirmDelete = () => {
    const { teacherId, isMultiple } = deleteConfirmation

    if (isMultiple) {
      deleteMultipleTeachers(selectedIds)
      const count = selectedIds.length
      setSelectedIds([])
      toast.success(`${count} teachers deleted successfully`)
    } else if (teacherId) {
      const teacher = teachers.find((t) => t.teacher_id === teacherId)
      if (!teacher) return
      deleteTeacher(teacher.teacher_id)
      setSelectedIds(selectedIds.filter((sid) => sid !== teacherId))
      toast.success(
        `${teacher?.first_name} ${teacher?.last_name} deleted successfully`
      )
    }

    setDeleteConfirmation({ open: false, teacherId: null, isMultiple: false })
  }

  // ===========================
  // HANDLERS - SELECTION
  // ===========================
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedTeachers.map((t) => t.teacher_id))
    } else {
      setSelectedIds([])
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  const getClassTeacherClass = (teacherId: string) => {
    return classes.find(
      (cls) => cls.class_teacher_id === teacherId
    )
  }

  // ===========================
  // HANDLERS - DRAG & DROP
  // ===========================
  const handleDragStart = (teacherId: number) => {
    setDraggedTeacherId(teacherId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetTeacherId: number) => {
    if (!draggedTeacherId || draggedTeacherId === targetTeacherId) return

    const draggedIdx = reorderedTeachers.findIndex(
      (t) => t.id === draggedTeacherId
    )
    const targetIdx = reorderedTeachers.findIndex(
      (t) => t.id === targetTeacherId
    )

    const newTeachers = [...reorderedTeachers]
    const [draggedTeacher] = newTeachers.splice(draggedIdx, 1)
    newTeachers.splice(targetIdx, 0, draggedTeacher)

    setReorderedTeachers(newTeachers)
    setDraggedTeacherId(null)
  }

  // ===========================
  // MODAL HANDLERS
  // ===========================

  /**
   * Open class teacher modal with direct teacher reference
   * Fixes problem #7: Pass teacher explicitly, not via selectedIds
   */
  const openClassTeacherModal = () => {
    if (selectedIds.length !== 1) {
      toast.error('Please select exactly one teacher')
      return
    }
    const teacher = teachers.find((t) => selectedIds.includes(t.teacher_id))
    if (teacher) {
      setClassTeacherTeacher(teacher)
    }
  }

  const handleAssignClassTeacher = async (classId: number, teacherId: string) => {
    return await syncAssignClassTeacher(classId, teacherId)
  }

  return (
    <div className="w-full space-y-6 p-4 sm:p-6">
      {/* ===========================
          HEADER
          =========================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Teachers Management
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage teachers, assignments, and class teachers
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-between">
          <Button
            onClick={() =>
              setViewMode(viewMode === 'card' ? 'list' : 'card')
            }
            variant="outline"
          >
            {viewMode === 'card' ? (
              <>
                <LayoutGrid size={18} className="mr-2" /> Card View
              </>
            ) : (
              <>
                <LayoutList size={18} className="mr-2" /> List View
              </>
            )}
          </Button>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus size={18} className="mr-2" /> Add Teacher
          </Button>
        </div>
      </div>

      {/* ===========================
          TOOLBAR
          =========================== */}
      <div className="pt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="group relative flex flex-1 items-center gap-2 w-full md:w-auto">
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
          <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='
              pl-9 flex-1 min-w-0 w-full
              border border-slate-200
              rounded-lg
              bg-white
              text-sm
              transition-all duration-300

              focus:border-primary
              focus-visible:ring-2
              focus-visible:ring-primary/20
              focus-visible:outline-none

              group-hover:border-primary/40
              group-hover:shadow-lg
            '
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortAsc(!sortAsc)}
          >
            <ArrowUpDown size={16} className="mr-2" />
            {sortAsc ? 'A → Z' : 'Z → A'}
          </Button>
          {selectedIds.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={openClassTeacherModal}
                disabled={selectedIds.length !== 1}
              >
                <Users size={16} className="mr-2" /> Class Teacher
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteMultiple}
              >
                <Trash2 size={16} className="mr-2" />({selectedIds.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* CARD VIEW */}
      {viewMode === 'list' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedTeachers.map((teacher) => (
              <TeacherCardView
                key={teacher.id}
                teacher={teacher}
                isSelected={selectedIds.includes(teacher.teacher_id)}
                onSelect={(checked) => {
                  if (checked) setSelectedIds([...selectedIds, teacher.teacher_id])
                  else
                    setSelectedIds(
                      selectedIds.filter((id) => id !== teacher.teacher_id)
                    )
                }}
                assignmentCount={getTeacherAssignments(teacher.teacher_id).length}
                classTeacherClass={getClassTeacherClass(
                  teacher.teacher_id
                )}
                onEdit={() => setEditTeacher(teacher)}
                onAssign={() => setAssignTeacher(teacher)}
                onViewAssignments={() => setViewAssignments(teacher)}
                onDelete={() => handleDeleteTeacher(teacher.teacher_id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center overflow-auto">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      isActive={currentPage > 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      isActive={currentPage < totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <>
          {/* ===========================
              LIST VIEW
              =========================== */}
          <div className="rounded-lg border overflow-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedIds.length === 0
                          ? false
                          : selectedIds.length === paginatedTeachers.length
                            ? true
                            : 'indeterminate'
                      }
                      onCheckedChange={(value) =>
                        toggleSelectAll(value === true)
                      }
                    />
                  </TableHead>
                  <TableHead></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assignments</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTeachers.map((teacher) => {
                  const teacherAssignments = getTeacherAssignments(
                    teacher.teacher_id
                  )
                  return (
                    <TableRow
                      key={teacher.id}
                      draggable
                      onDragStart={() => handleDragStart(teacher.id)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(teacher.id)}
                      className="cursor-grab active:cursor-grabbing"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(teacher.teacher_id)}
                          onCheckedChange={(checked) => {
                            if (checked)
                              setSelectedIds([...selectedIds, teacher.teacher_id])
                            else
                              setSelectedIds(
                                selectedIds.filter(
                                  (id) => id !== teacher.teacher_id
                                )
                              )
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={teacher.profile_img}
                            alt={`${teacher.first_name} ${teacher.last_name}`}
                          />
                          <AvatarFallback>
                            {getInitials(teacher.first_name, teacher.last_name)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <GripVertical
                            size={16}
                            className="text-muted-foreground"
                          />
                          {teacher.first_name} {teacher.last_name}
                        </div>
                      </TableCell>
                      <TableCell>{teacher.email}</TableCell>
                      <TableCell>{teacher.phone_number}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            teacher.status === 'active'
                              ? 'default'
                              : teacher.status === 'pending'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {teacher.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {teacherAssignments.length}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewAssignments(teacher)}
                          >
                            <BookOpen size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAssignTeacher(teacher)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteTeacher(teacher.teacher_id)
                            }
                          >
                            <Trash2 size={16} className="text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center overflow-auto">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      isActive={currentPage > 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      isActive={currentPage < totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* ===========================
          ADD TEACHER MODAL
          =========================== */}
      <AddTeacherModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onTeacherAdded={() => {
          setIsAddOpen(false)
        }}
      />

      {/* ===========================
          EDIT TEACHER MODAL
          =========================== */}
      {editTeacher && (
        <Dialog open={!!editTeacher} onOpenChange={() => setEditTeacher(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Teacher</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="mx-auto">
                <AvatarUpload
                  teacherName={`${editTeacher.first_name} ${editTeacher.last_name}`}
                  currentAvatarUrl={editTeacher.profile_img || ''}
                  onAvatarChange={(url) =>
                    setEditTeacher({ ...editTeacher, profile_img: url })
                  }
                />
              </div>
              <div>
                <Label>First Name</Label>
                <Input
                  value={editTeacher.first_name}
                  onChange={(e) =>
                    setEditTeacher({
                      ...editTeacher,
                      first_name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={editTeacher.last_name}
                  onChange={(e) =>
                    setEditTeacher({
                      ...editTeacher,
                      last_name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={editTeacher.email}
                  onChange={(e) =>
                    setEditTeacher({
                      ...editTeacher,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={editTeacher.phone_number}
                  onChange={(e) =>
                    setEditTeacher({
                      ...editTeacher,
                      phone_number: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={editTeacher.status}
                  onValueChange={(value: any) =>
                    setEditTeacher({
                      ...editTeacher,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditTeacher(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTeacher}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ===========================
          MODALS (Refactored Components)
          =========================== */}
      <AssignClassesModal
        teacher={assignTeacher}
        isOpen={!!assignTeacher}
        onClose={() => setAssignTeacher(null)}
        classes={classes}
        subjects={subjects}
        onAssign={assignSubjectsToClass}
        isLoading={assignmentsLoading}
        loadingClass={loadingStates.assigningClassId}
      />

      <AssignmentsModal
        teacher={viewAssignments}
        isOpen={!!viewAssignments}
        onClose={() => setViewAssignments(null)}
        assignments={assignments}
        onRemoveAssignment={removeAssignment}
        onRemoveClassAssignments={removeClassAssignments}
        isRemovingAssignment={isRemovingAssignment}
        isRemovingClassAssignments={isRemovingClassAssignments}
        loadingStates={loadingStates}
      />

      <ClassTeacherModal
        teacher={classTeacherTeacher}
        isOpen={!!classTeacherTeacher}
        onClose={() => setClassTeacherTeacher(null)}
        classes={classes}
        onAssign={handleAssignClassTeacher}
        isLoading={false}
        loadingClass={null}
      />

      {/* ===========================
          DELETE CONFIRMATION DIALOG
          =========================== */}
      <Dialog
        open={deleteConfirmation.open}
        onOpenChange={(open) =>
          setDeleteConfirmation({
            ...deleteConfirmation,
            open,
          })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {deleteConfirmation.isMultiple ? (
              <>
                <p className="text-muted-foreground">
                  Are you sure you want to delete {selectedIds.length} teacher
                  {selectedIds.length !== 1 ? 's' : ''}? This action cannot be
                  undone.
                </p>
                <div className="rounded-md bg-destructive/10 p-3">
                  <p className="text-sm font-medium text-destructive">
                    Warning: This will permanently remove the selected teachers
                    from the database.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-muted-foreground">
                  Are you sure you want to delete{' '}
                  <span className="font-semibold">
                    {
                      teachers.find(
                        (t) => t.teacher_id === deleteConfirmation.teacherId
                      )?.first_name
                    }{' '}
                    {
                      teachers.find(
                        (t) => t.teacher_id === deleteConfirmation.teacherId
                      )?.last_name
                    }
                  </span>
                  ? This action cannot be undone.
                </p>
                <div className="rounded-md bg-destructive/10 p-3">
                  <p className="text-sm font-medium text-destructive">
                    Warning: This will permanently remove the teacher from the
                    database.
                  </p>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteConfirmation({
                  open: false,
                  teacherId: null,
                  isMultiple: false,
                })
              }
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete {deleteConfirmation.isMultiple ? 'All' : ''}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
