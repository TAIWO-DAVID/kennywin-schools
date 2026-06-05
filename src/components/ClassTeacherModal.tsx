/**
 * Class Teacher Assignment Modal Component
 * 
 * Separated concerns:
 * - UI only displays selection
 * - Fixes problem #7: Teacher passed directly, not via selectedIds
 * - Calls hook method: assignClassTeacher
 * - Simple and focused responsibility
 */

'use client'

import { useState } from 'react'
import { Class } from '@/types'
import { Teacher } from '@/types/teacher'
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
import { Loader2 } from 'lucide-react'
import { getClassName } from '@/utils/school/classes/classes'
import toast from 'react-hot-toast'

interface ClassTeacherModalProps {
  teacher: Teacher | null
  isOpen: boolean
  onClose: () => void
  classes: Class[]
  onAssign: (classId: number, teacherId: string) => Promise<boolean>
  isLoading: boolean
  loadingClass: number | null
}

/**
 * Modal for assigning a specific teacher as class teacher
 * Fixes problem #7: Pass teacher explicitly, not via global selectedIds
 */
export function ClassTeacherModal({
  teacher,
  isOpen,
  onClose,
  classes,
  onAssign,
  isLoading,
  loadingClass,
}: ClassTeacherModalProps) {
  const [selectedClass, setSelectedClass] = useState<number | null>(null)

  const handleSubmit = async () => {
    if (!teacher || !selectedClass) {
      toast.error('Please select a class')
      return
    }

    const success = await onAssign(selectedClass, teacher.teacher_id)

    if (success) {
      setSelectedClass(null)
      onClose()
    }
  }

  const handleClose = () => {
    setSelectedClass(null)
    onClose()
  }

  if (!teacher) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Assign Class Teacher - {teacher.first_name} {teacher.last_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-1 block">Select Class *</Label>
            <Select
              value={selectedClass?.toString() || ''}
              onValueChange={(value) => setSelectedClass(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {getClassName(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !selectedClass}>
            {isLoading && loadingClass === selectedClass ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Assigning...
              </>
            ) : (
              'Assign'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
