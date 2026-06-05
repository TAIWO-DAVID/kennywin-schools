/**
 * Assign Classes Modal Component
 * 
 * Separated concerns:
 * - UI only displays form
 * - Calls hook method: assignSubjectsToClass
 * - Loading state from hook
 * - No form logic, just display and callback
 */

'use client'

import { useEffect, useState } from 'react'
import { Teacher } from '@/types/teacher'
import { Subject } from '@/types'
import { Class } from '@/types'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { getClassName, sortClasses } from '@/utils/school/classes/classes'
import toast from 'react-hot-toast'
import supabase from '@/lib/supabase/supabaseClient'

interface AssignClassesModalProps {
  teacher: Teacher | null
  isOpen: boolean
  onClose: () => void
  classes: Class[]
  subjects: Subject[]
  onAssign: (teacherId: string, classId: number, subjectIds: string[]) => Promise<boolean>
  isLoading: boolean
  loadingClass: number | null
}

export function AssignClassesModal({
  teacher,
  isOpen,
  onClose,
  classes,
  subjects,
  onAssign,
  isLoading,
  loadingClass,
}: AssignClassesModalProps) {
  const [selectedClass, setSelectedClass] = useState<number | null>(null)
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  useEffect(() => {
      const fetchClasses = async () => {
        const { data, error } = await supabase
          .from("classes")
          .select("id, level, grade, stream");
  
        if (error) {
          console.error(error);
          return;
        }
  
        setClassList(data || []);
      };
  
      fetchClasses();
    }, []);

  const [classList, setClassList] = useState<
      { id: number; level: string; grade: number; stream: string }[]
    >([]);

  const handleSubmit = async () => {
    if (!teacher || !selectedClass || selectedSubjects.length === 0) {
      toast.error('Please select a class and at least one subject')
      return
    }

    const success = await onAssign(teacher.teacher_id, selectedClass, selectedSubjects)

    if (success) {
      // Reset form
      setSelectedClass(null)
      setSelectedSubjects([])
      onClose()
    }
  }

  const handleClose = () => {
    // Reset state when closing
    setSelectedClass(null)
    setSelectedSubjects([])
    onClose()
  }

  if (!teacher) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Assign Classes & Subjects - {teacher.first_name}{' '}
            {teacher.last_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Class Selection */}
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
                {sortClasses(classList).map((cls) => (
                  <SelectItem key={cls.id} value={String(cls.id)}>
                    {getClassName(cls)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject Selection */}
          <div>
            <Label className="mb-1 block">Select Subjects *</Label>
            <div className="space-y-2 rounded-lg border p-3">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`subject-${subject.id}`}
                    checked={selectedSubjects.includes(subject.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSubjects([...selectedSubjects, subject.id])
                      } else {
                        setSelectedSubjects(
                          selectedSubjects.filter((id) => id !== subject.id)
                        )
                      }
                    }}
                  />
                  <Label
                    htmlFor={`subject-${subject.id}`}
                    className="cursor-pointer"
                  >
                    {subject.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !selectedClass || selectedSubjects.length === 0}
          >
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
