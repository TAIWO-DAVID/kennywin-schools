import { Student } from "@/types"

type Props = {
  students: Student[]
  renderItem: (student: Student) => React.ReactNode
}

export function StudentGrid({ students, renderItem }: Props) {
  if (!students.length) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        No students found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {students.map(renderItem)}
    </div>
  )
}