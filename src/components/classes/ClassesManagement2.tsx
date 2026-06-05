// 'use client'

// import { useState, useMemo, useCallback } from 'react'
// import { Edit, Users, X } from 'lucide-react'
// import {Class} from "@/types"
// import { useTeachersData} from '@/hooks/useTeachersData'
// import { Button } from '@/components/ui/button'
// import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import supabase from '@/lib/supabase/supabaseClient'
// import toast from "react-hot-toast";
// import { MoreVertical } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { CreateClassModal } from './CreateClassModal'
// import { EditClassModal } from './EditClassModal'
// import { ClassCard } from './ClassCard'
// import AssignTeacherModal from './AssignTeacherModal'

// export function ClassesManagement() {
//   const { classes, teachers, removeClassTeacher, fetchClasses } =
//     useTeachersData()

//   const getClassName = (cls: Class): string => {
//     return [cls.level, cls.grade, cls.stream]
//       .filter(Boolean)
//       .join(' ')
//   }

//   const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null)
//   const [selectedClass, setSelectedClass] = useState<Class | null>(null)
//   const [isAssignOpen, setIsAssignOpen] = useState(false)

//   const [isCreateOpen, setIsCreateOpen] = useState(false)
//   const [newClass, setNewClass] = useState({
//     // name: '',
//     level: '',
//     grade: '',
//     stream: "",
//   })

//   const [isEditOpen, setIsEditOpen] = useState(false)
//   const [editingClass, setEditingClass] = useState<Class | null>(null)

//   const [editForm, setEditForm] = useState({
//     level: '',
//     grade: '',
//     stream: '',
//   })

//   const openEditModal = (cls: Class) => {
//     setEditingClass(cls)
//     setEditForm({
//       level: cls.level,
//       grade: cls.grade?.toString() || '',
//       stream: cls.stream || '',
//     })
//     setIsEditOpen(true)
//   }

//   const levelOrder: Record<string, number> = {
//     Creche: 1,
//     KG: 2,
//     Nursery: 3,
//     Primary: 4,
//     JSS: 5,
//     SSS: 6,
//   }

//   const sortedClasses = useMemo(() => {
//     return [...classes].sort((a, b) => {
//       return (
//         (levelOrder[a.level ?? ""] || 99) - (levelOrder[b.level ?? ""] || 99) ||
//         (a.grade || 0) - (b.grade || 0) ||
//         (a.stream || '').localeCompare(b.stream || '')
//       )
//     })
//   }, [classes])

//   // Group classes
//   const groupedClasses = useMemo(() => {
//     return sortedClasses.reduce((acc, cls) => {
//       const level = cls.level || 'Other'
//       if (!acc[level]) acc[level] = []
//       acc[level].push(cls)
//       return acc
//     }, {} as Record<string, Class[]>)
//   }, [sortedClasses])

//   const openAssignModal = (cls: Class) => {
//     setSelectedClass(cls)
//     setSelectedTeacherId(null)
//     setIsAssignOpen(true)
//   }

//   const handleAssign = async () => {
//     if (!selectedClass || !selectedTeacherId) return

//     const teacher = teachers.find(
//       (t) => t.teacher_id === selectedTeacherId
//     )

//     if (!teacher) {
//       toast.error("Teacher not found")
//       return
//     }

//     const isAlreadyAssigned = classes.some(
//       (c) => c.class_teacher_id === selectedTeacherId
//     )

//     if (isAlreadyAssigned) {
//       toast.error("Teacher is already assigned to another class")
//       return
//     }

//     try {
//       await assignClassTeacher(selectedClass.id, selectedTeacherId)

//       toast.success(
//         `${teacher.first_name} ${teacher.last_name} assigned to ${getClassName(selectedClass)}`,
//       )

//       setIsAssignOpen(false)
//       setSelectedClass(null)
//       setSelectedTeacherId(null)
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   const handleRemove = (cls: Class) => {
//     removeClassTeacher(cls.id)

//     toast.success(
//       `Class teacher removed from ${getClassName(cls)}`,
//     )
//   }

//   const getInitials = (first?: string, last?: string) => {
//     return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase()
//   }

//   const assignedTeacherIds = useMemo(() => {
//     return classes
//       .map((c) => c.class_teacher_id)
//       .filter((id): id is string => Boolean(id))
//   }, [classes])

//   const assignClassTeacher = useCallback(
//     async (classId: number, teacherId: string) => {
//       try {
//         const { error } = await supabase
//           .from('classes')
//           .update({
//             class_teacher_id: teacherId,
//           })
//           .eq('id', classId)

//         if (error) throw error
//       } catch (err) {
//         console.error('Assign class teacher error:', err)
//       }
//     },
//     []
//   )

//   const handleCreateClass = async () => {
//     try {
//       // Normalize inputs first
//       const gradeNumber =
//         newClass.level === 'Creche'
//           ? null
//           : parseInt(newClass.grade, 10)

//       const stream =
//         newClass.stream?.trim() === ''
//           ? null
//           : newClass.stream?.trim().toUpperCase()

//       // Validation
//       if (!newClass.level) {
//         toast.error('Level is required')
//         return
//       }

//       if (newClass.level !== 'Creche' && (gradeNumber === null || isNaN(gradeNumber))) {
//         toast.error('Valid grade is required')
//         return
//       }

//       // 🚀 DUPLICATE CHECK (THIS IS THE REAL ONE)
//       const exists = classes.some(
//         (c) =>
//           c.level === newClass.level &&
//           c.grade === gradeNumber &&
//           (c.stream || null) === stream
//       )

//       if (exists) {
//         toast.error('Class already exists')
//         return
//       }

//       // Order
//       const maxOrder = Math.max(...classes.map((c) => c.order_number || 0), 0)

//       const payload = {
//         level: newClass.level,
//         grade: gradeNumber,
//         stream,
//         order_number: maxOrder + 1,
//         status: "active",
//       }

//       console.log('🚀 Creating class:', payload)

//       const { data, error } = await supabase
//         .from('classes')
//         .insert([payload])
//         .select()

//       console.log('DATA:', data)
//       console.log('ERROR:', error)

//       if (error) {
//         toast.error(error.message)
//         return
//       }

//       toast('Class created successfully')

//       await fetchClasses()

//       setIsCreateOpen(false)
//       setNewClass({
//         level: '',
//         grade: '',
//         stream: '',
//       })
//     } catch (err) {
//       console.error('❌ FULL ERROR:', err)
//       toast('Something went wrong')
//     }
//   }

//   const handleUpdateClass = async () => {
//     if (!editingClass) return

//     if (!editForm.level || !editForm.grade) {
//       toast.error(
//         'Level and grade are required',
//       )
//       return
//     }

//     const gradeNumber = parseInt(editForm.grade, 10)
//     const stream = editForm.stream?.trim().toUpperCase() || null

//     if (isNaN(gradeNumber)) {
//       toast('Grade must be a valid number')
//     }

//     // 🚫 Prevent duplicate class (excluding current one)
//     const exists = classes.some(
//       (c) =>
//         c.id !== editingClass.id &&
//         c.level === editForm.level &&
//         c.grade === gradeNumber &&
//         (c.stream || null) === stream
//     )

//     if (exists) {
//       toast(
//         'Another class already has this structure',
//       )
//       return
//     }

//     try {
//       const { error } = await supabase
//         .from('classes')
//         .update({
//           level: editForm.level,
//           grade: gradeNumber,
//           stream,
//         })
//         .eq('id', editingClass.id)

//       if (error) throw error

//       toast(
//         'Class updated successfully',
//       )

//       await fetchClasses()

//       setIsEditOpen(false)
//       setEditingClass(null)
//     } catch (err) {
//       console.error(err)
//       toast(
//         'Failed to update class',
//       )
//     }
//   }

//   const handleArchiveClass = async (cls: Class) => {
//     const confirmAction = confirm(
//       `Archive ${getClassName(cls)}?`
//     )
//     if (!confirmAction) return

//     try {
//       // 🔍 Check if students exist in this class
//       const { count, error: countError } = await supabase
//         .from("students")
//         .select("*", { count: "exact", head: true })
//         .eq("class_id", cls.id)

//       if (countError) throw countError

//       if ((count ?? 0) > 0) {
//         toast.error(
//           "Cannot archive class with students. Move or remove students first."
//         )
//         return
//       }

//       // ✅ Archive
//       const { error } = await supabase
//         .from("classes")
//         .update({ status: "archived" })
//         .eq("id", cls.id)

//       if (error) throw error

//       await fetchClasses()

//       toast.success("Class archived successfully")
//     } catch (err: any) {
//       console.error(err)
//       toast.error(err.message || "Failed to archive class")
//     }
//   }

//   return (
//     <div className="space-y-8 p-6">
//       <div className='flex flex-col gap-4 md:items-center md:justify-between md:flex-row'>
//         <div className=''>
//           <h1 className="text-3xl font-bold">Classes</h1>
//           <p className="text-muted-foreground">
//             Assign and manage class teachers
//           </p>
//         </div>
//         <Button className='w-full md:w-[150px]' onClick={() => setIsCreateOpen(true)}>
//           + Add Class
//         </Button>
//       </div>

//       {/* Add class modal */}
//       <CreateClassModal
//         open={isCreateOpen}
//         onClose={() => setIsCreateOpen(false)}
//         onCreate={handleCreateClass}
//       />

//       {/* Edit Class modal */}
//       <EditClassModal
//         open={isEditOpen}
//         onClose={() => setIsEditOpen(false)}
//         cls={editingClass}
//         onUpdate={handleUpdateClass}
//       />

//       {/* CLASS CARDS */}
//       {Object.entries(groupedClasses).map(([level, clsList]) => (
//         <div key={level} className="space-y-4">
//           <h2 className="text-xl font-semibold">{level}</h2>

//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {clsList.map((cls) => (
//               <ClassCard
//                 key={cls.id}
//                 cls={cls}
//                 onEdit={openEditModal}
//                 onAssign={openAssignModal}
//                 onRemoveTeacher={handleRemove}
//                 onArchive={handleArchiveClass}
//               />
//             ))}
//           </div>
//         </div>
//       ))}

//       {/* ASSIGN TEACHER MODAL */}
//       <AssignTeacherModal
//         open={isAssignOpen}
//         classItem={selectedClass}
//         teachers={teachers}
//         onClose={() => setIsAssignOpen(false)}
//         onAssign={handleAssign}
//       />
//     </div>
//   )
// }