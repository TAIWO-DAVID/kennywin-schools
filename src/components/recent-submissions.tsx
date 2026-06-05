import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText } from "lucide-react"

const submissions = [
  {
    student: "Alice Johnson",
    assignment: "Quadratic Equations",
    subject: "Mathematics",
    time: "2 hours ago",
    avatar: "AJ",
  },
  {
    student: "Bob Wilson",
    assignment: "Probability Theory",
    subject: "Statistics",
    time: "4 hours ago",
    avatar: "BW",
  },
  {
    student: "Carol Davis",
    assignment: "Calculus Problems",
    subject: "Advanced Math",
    time: "6 hours ago",
    avatar: "CD",
  },
]

export function RecentSubmissions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Submissions</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          See all
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {submissions.map((submission, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 border border-border">
            <Avatar className="w-10 h-10">
              <AvatarImage src={`/diverse-students-studying.png?height=40&width=40&query=student ${submission.student}`} />
              <AvatarFallback>{submission.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-medium">{submission.assignment}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {submission.student} • {submission.subject}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">{submission.time}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
