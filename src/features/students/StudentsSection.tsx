import { BulkActionBar } from "@/components/students/BulkActionBar"
import { StudentCard } from "@/components/students/StudentCard"
import { StudentGrid } from "@/components/students/StudentGrid"

import { Student } from "@/types"

type StudentsSectionProps = {
  students: Student[]
  selectedStudents?: string[]
  onToggleStudent?: (id: string) => void
  onDelete?: () => void
  onClear?: () => void
  onStudentClick?: (student: Student) => void
}

export function StudentsSection({
  students,
  selectedStudents = [],
  onToggleStudent,
  onDelete,
  onClear,
  onStudentClick,
}: StudentsSectionProps) {
  const isSelected = (id: string) => selectedStudents.includes(id)

  return (
    <div className="space-y-4">

      <BulkActionBar
        count={selectedStudents.length}
        onClear={onClear || (() => {})}
        onDelete={onDelete || (() => {})}
      />

      <StudentGrid
        students={students}
        renderItem={(student) => (
          <StudentCard
            key={student.id}
            student={student}
            selected={isSelected(student.id)}
            onSelect={
              onToggleStudent
                ? () => onToggleStudent(student.id)
                : undefined
            }
            onClick={() => onStudentClick?.(student)}
          />
        )}
      />
    </div>
  )
}