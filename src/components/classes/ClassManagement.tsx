'use client'

import { useState, useMemo, useEffect } from 'react'
import { Users, X, MoreVertical } from 'lucide-react'
import { Class } from "@/types"
import { useTeachersData } from '@/hooks/useTeachersData'
import { useClasses } from '@/hooks/useClasses'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import toast from "react-hot-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSearchParams, useRouter } from 'next/navigation'
import { ClassesSkeleton } from '../skeletons/ClassesSkeleton'
import { EditClassModal } from './EditClassModal'
import CreateClassModal from './CreateClassModal'
import { useTeacherAssignmentSystem } from '@/hooks/useTeacherAssignmentSystem'
import { useClassTeacherSync } from '@/hooks/useClassTeacherSync'

export function ClassesManagement() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { teachers, loading: teachersLoading } = useTeachersData()
  // const { assignClassTeacher, removeClassTeacher } = useClassTeacherSync()
  const { classes, assignClassTeacher, removeClassTeacher, groupedClasses, loading: classesLoading, createClass, handleUpdateClass, handleArchiveClass } = useClasses()

  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [isAssignOpen, setIsAssignOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<Class | null>(null)

  const [newClass, setNewClass] = useState({ level: '', grade: '', stream: '' })
  const [editForm, setEditForm] = useState({ level: '', grade: '', stream: '' })

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setIsCreateOpen(true)
      router.replace("/admin/classes")
    }
  }, [searchParams, router])

  const getClassName = (cls: Class): string =>
    [cls.level, cls.grade, cls.stream].filter(Boolean).join(' ')

  const getInitials = (first?: string, last?: string) =>
    `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase()

  const assignedTeacherIds = useMemo(() => 
    classes
      .map((c) => c.class_teacher_id)
      .filter((id): id is string => Boolean(id))
  , [classes])

  const openEditModal = (cls: Class) => {
    setEditingClass(cls)
    setEditForm({
      level: cls.level,
      grade: cls.grade?.toString() || '',
      stream: cls.stream || '',
    })
    setIsEditOpen(true)
  }

  const openAssignModal = (cls: Class) => {
    setSelectedClass(cls)
    setSelectedTeacherId(null)
    setIsAssignOpen(true)
  }

  const handleAssign = async () => {
    if (!selectedClass || !selectedTeacherId) return

    const teacher = teachers.find((t) => t.teacher_id === selectedTeacherId)
    if (!teacher) {
      toast.error("Teacher not found")
      return
    }

    const isAlreadyAssigned = classes.some((c) => c.class_teacher_id === selectedTeacherId)
    if (isAlreadyAssigned) {
      toast.error("Teacher is already assigned to another class")
      return
    }

    try {
      await assignClassTeacher(selectedClass.id, selectedTeacherId)
      setIsAssignOpen(false)
      setSelectedClass(null)
      setSelectedTeacherId(null)
    } catch (err) {
      console.error('[v0] Assign teacher error:', err)
    }
  }

  const handleRemove = async (cls: Class) => {
    try {
      await removeClassTeacher(cls.id)
      toast.success(`Class teacher removed from ${getClassName(cls)}`)
    } catch (err) {
      console.error('[v0] Remove teacher error:', err)
    }
  }

  const handleCreateClass = async () => {
    const success = await createClass(newClass)
    if (success) {
      setIsCreateOpen(false)
      setNewClass({ level: '', grade: '', stream: '' })
    }
  }

  const loading = classesLoading || teachersLoading

  if (loading) {
    return (
      <div className="p-3 space-y-6">
        <div className='flex flex-col gap-4 md:items-center md:justify-between md:flex-row'>
          <div className=''>
            <h1 className="text-[#020618] text-3xl font-bold">Classes</h1>
            <p className="text-muted-foreground">
              Assign and manage class teachers
            </p>
          </div>
          <Button className='w-full md:w-[150px]' onClick={() => setIsCreateOpen(true)}>
            + Add Class
          </Button>
        </div>
        <ClassesSkeleton/>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      <div className='flex flex-col gap-4 md:items-center md:justify-between md:flex-row'>
        <div className=''>
          <h1 className="text-[#020618] text-3xl font-bold">Classes</h1>
          <p className="text-muted-foreground">
            Assign and manage class teachers
          </p>
        </div>
        <Button className='w-full md:w-[150px]' onClick={() => setIsCreateOpen(true)}>
          + Add Class
        </Button>
      </div>

      {/* Add class modal */}
      <CreateClassModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        form={newClass}
        setForm={setNewClass}
        onSubmit={handleCreateClass}
      />

      {/* Edit Class modal */}
      <EditClassModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        form={editForm}
        setForm={setEditForm}
        onSubmit={async () => {
          if (!editingClass) return

          const success = await handleUpdateClass(editingClass.id, editForm)

          if (success) {
            setIsEditOpen(false)
          }
        }}
      />

      {/* CLASS CARDS */}
      {Object.entries(groupedClasses).map(([level, clsList]) => (
        <section key={level} className="space-y-6">

          {/* LEVEL HEADER */}
          <div className="flex items-center gap-4">
            <h2
              className="
                text-[11px]
                font-bold
                tracking-[0.25em]
                uppercase
                text-slate-400
              "
            >
              {level}
            </h2>

            <div className="h-px flex-1 bg-slate-200" />
          </div>

          {/* GRID */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clsList.map((cls) => (

              <Card
                key={cls.id}
                className="
                  group relative overflow-hidden
                  rounded-xl border border-slate-200/70
                  bg-white shadow-sm
                  transition-all duration-300 ease-out
                  hover:-translate-y-1 hover:shadow-2xl
                "
              >

                {/* Top glow */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

                {/* HEADER */}
                <CardHeader className="flex flex-row items-start justify-between pb-3">

                  <div
                    onClick={() => router.push(`/admin/classes/${cls.id}`)}
                    className="cursor-pointer space-y-1"
                  >
                    <CardTitle
                      className="
                        text-base font-semibold text-slate-900
                        transition-colors duration-300
                        group-hover:text-primary
                      "
                    >
                      {getClassName(cls)}
                    </CardTitle>

                    <p className="text-xs text-slate-400">
                      Open class overview
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="
                          h-8 w-8
                          opacity-50
                          transition-all duration-200
                          group-hover:opacity-100
                          hover:bg-slate-100
                        "
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                      <DropdownMenuItem onClick={() => openEditModal(cls)}>
                        Edit class
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => handleArchiveClass(cls)}
                        className="text-red-600"
                      >
                        Archive class
                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardHeader>

                {/* BODY */}
                <CardContent className="space-y-4">

                  {/* TEACHER */}
                  <div
                    className="
                      rounded-xl border border-slate-100
                      bg-slate-50/70
                      px-4 py-3
                    "
                  >
                    <p className="text-[10px] uppercase tracking-wide text-slate-400">
                      Class Teacher
                    </p>

                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800">
                        {cls.class_teacher
                          ? `${cls.class_teacher.first_name} ${cls.class_teacher.last_name}`
                          : "Not assigned"}
                      </p>

                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          cls.class_teacher_id ? "bg-green-500" : "bg-slate-300"
                        }`}
                      />
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-2">

                    <Button
                      variant="outline"
                      className="
                        flex-1
                        transition-all duration-200
                        hover:bg-slate-100
                        active:scale-95
                      "
                      onClick={() => openAssignModal(cls)}
                    >
                      <Users className="mr-2 h-4 w-4 opacity-70" />

                      {cls.class_teacher_id ? "Change teacher" : "Assign teacher"}
                    </Button>

                    {cls.class_teacher_id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(cls)}
                        className="
                          text-red-500
                          hover:bg-red-50 hover:text-red-600
                          active:scale-95
                        "
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                </CardContent>

                {/* HOVER GLOW */}
                <div
                  className="
                    pointer-events-none absolute inset-0
                    opacity-0 transition duration-300
                    group-hover:opacity-100
                    bg-gradient-to-br from-primary/5 via-transparent to-transparent
                  "
                />
              </Card>
            ))}
          </div>
        </section>
      ))}

      {/* ASSIGN TEACHER MODAL */}
      <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Assign Teacher - {selectedClass ? getClassName(selectedClass) : ""}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className='mb-2'>Select Teacher</Label>

              <Select
                value={selectedTeacherId?.toString() || ''}
                onValueChange={(value) =>
                  setSelectedTeacherId(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose teacher" />
                </SelectTrigger>

                <SelectContent>
                  {teachers
                    .filter((t) => t.status === 'active')
                    .map((teacher) => {
                      const isAssigned = assignedTeacherIds.includes(teacher.teacher_id)

                      return (
                        <SelectItem
                          key={teacher.teacher_id}
                          value={teacher.teacher_id.toString()}
                          disabled={isAssigned}
                        >
                          <div className="flex items-center justify-between w-full gap-1">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                                {getInitials(teacher.first_name, teacher.last_name)}
                              </div>
                              <span>
                                {teacher.first_name} {teacher.last_name}
                              </span>
                            </div>

                            {isAssigned && (
                              <span className="text-xs text-muted-foreground">
                                {" Assigned"}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      )
                    })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={handleAssign}
              disabled={!selectedTeacherId}
            >
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
