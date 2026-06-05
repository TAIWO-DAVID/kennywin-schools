/**
 * Assignments Modal Component
 * 
 * Separated concerns:
 * - UI only displays data
 * - Calls hook methods: removeAssignment, removeClassAssignments
 * - No grouping logic (uses hook selector instead)
 * - Loading states from hook
 */

'use client'

import { Teacher } from '@/types/teacher'
import { Assignment } from '@/types/teacherAssignment'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { X, Loader2 } from 'lucide-react'
import { getClassName } from '@/utils/school/classes/classes'

interface AssignmentsModalProps {
  teacher: Teacher | null
  isOpen: boolean
  onClose: () => void
  assignments: Assignment[]
  onRemoveAssignment: (assignmentId: string) => Promise<boolean>
  onRemoveClassAssignments: (teacherId: string, classId: number) => Promise<boolean>
  isRemovingAssignment: (id: string) => boolean
  isRemovingClassAssignments: (teacherId: string, classId: number) => boolean
  loadingStates: {
    removingAssignmentId: string | null
    removingClassId: string | null
  }
}

/**
 * Helper: Group assignments by class
 * This is moved here from page component - single responsibility
 */
function groupAssignmentsByClass(
  teacherId: string,
  allAssignments: Assignment[]
): Map<
  number,
  {
    classInfo: any
    assignments: Assignment[]
  }
> {
  const grouped = new Map()

  const teacherAssignments = allAssignments.filter(
    (a) => a.teacher_id === teacherId
  )

  teacherAssignments.forEach((assignment) => {
    if (!assignment.class) return

    const classId = assignment.class.id

    if (!grouped.has(classId)) {
      grouped.set(classId, {
        classInfo: assignment.class,
        assignments: [],
      })
    }

    const group = grouped.get(classId)!
    group.assignments.push(assignment)
  })

  return grouped
}

export function AssignmentsModal({
  teacher,
  isOpen,
  onClose,
  assignments,
  onRemoveAssignment,
  onRemoveClassAssignments,
  isRemovingAssignment,
  isRemovingClassAssignments,
  loadingStates,
}: AssignmentsModalProps) {
  if (!teacher) return null

  const grouped = groupAssignmentsByClass(teacher.teacher_id, assignments)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Assignments - {teacher.first_name} {teacher.last_name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {grouped.size === 0 ? (
            <p className="text-muted-foreground">No assignments yet</p>
          ) : (
            <div className="space-y-4">
              {Array.from(grouped.entries()).map(([classId, group]) => (
                <div key={classId} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {getClassName(group.classInfo)}
                    </h3>
                  </div>

                  {/* Subject badges with remove buttons */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.assignments.map((assignment: Assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-sm"
                      >
                        <span>{assignment.subject?.name}</span>

                        <button
                          onClick={() => onRemoveAssignment(assignment.id)}
                          disabled={isRemovingAssignment(assignment.id)}
                          className="text-muted-foreground hover:text-destructive disabled:opacity-50"
                          title="Remove this subject"
                        >
                          {isRemovingAssignment(assignment.id) ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <X size={14} />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Remove all button */}
                  <div className="mt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        onRemoveClassAssignments(teacher.teacher_id, classId)
                      }
                      disabled={isRemovingClassAssignments(
                        teacher.teacher_id,
                        classId
                      )}
                    >
                      {isRemovingClassAssignments(teacher.teacher_id, classId) ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Removing...
                        </>
                      ) : (
                        'Remove All Subjects'
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
