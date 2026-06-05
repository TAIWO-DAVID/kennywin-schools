import { Subject } from "@/types/subject"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

interface SubjectCardProps {
  subject: Subject
  onEdit: () => void
  onArchive: () => void
}

export function SubjectCard({
  subject,
  onEdit,
  onArchive,
}: SubjectCardProps) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">
              {subject.name}
            </h3>

            {subject.code && (
              <p className="text-sm text-muted-foreground">
                {subject.code}
              </p>
            )}
          </div>

          <Badge>
            {subject.is_active
              ? "Active"
              : "Inactive"}
          </Badge>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            <Edit size={16} />
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={onArchive}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}