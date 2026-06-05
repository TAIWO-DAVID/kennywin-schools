import { Student } from "@/types"
import { Button } from "../ui/button"
import { Eye } from "lucide-react"

type StudentCardProps = {
  student: Student
  selected?: boolean
  onSelect?: () => void
  onClick?: () => void
}

export function StudentCard({
 student,
  selected,
  onSelect,
  onClick,
}: StudentCardProps) {
  const initials = `${student.first_name[0]}${student.last_name[0]}`

  return (
    <div
      onClick={onClick}
      className="border-[ridge] border-2 rounded-md p-3 flex justify-between items-center hover:bg-gray-200 cursor-pointer bg-muted/100"
    >
      <div className="flex items-center gap-3 justify-between">
        {onSelect && (
          <input
            type="checkbox"
            checked={selected}
            onClick={(e) => e.stopPropagation()}   // ONLY responsibility here
            onChange={onSelect}
          />
        )}

        <div className="h-9 w-9 bg-gray-200 rounded-full flex items-center justify-center text-xs">
          {initials}
        </div>

        <div>
          <p className="text-sm font-mono">
            {student.first_name} {student.last_name}
          </p>
        </div>
      </div>
        <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-gray-900"
            // onClick={(e) => {
            //     e.stopPropagation()
            //     setSelectedStudent(student)
            //     setIsModalOpen(true)
            // }}
            >
            <Eye className="h-4 w-4" />
        </Button>
    </div>
  )
}