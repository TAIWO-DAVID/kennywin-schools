import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Calendar } from "lucide-react"

const notices = [
  {
    title: "Faculty Meeting",
    description: "Monthly faculty meeting scheduled for tomorrow at 3:00 PM in the conference room.",
    type: "meeting",
    time: "Tomorrow",
  },
  {
    title: "Grade Submission Deadline",
    description: "Final grades for mid-term exams must be submitted by Friday, 5:00 PM.",
    type: "deadline",
    time: "3 days left",
  },
]

export function DailyNotices() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Daily Notices</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          See all
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {notices.map((notice, index) => (
          <div key={index} className="p-4 rounded-lg bg-secondary/10 border border-border">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {notice.type === "meeting" ? (
                  <Calendar className="w-4 h-4 text-chart-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-chart-3" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-medium">{notice.title}</h4>
                <p className="text-sm text-muted-foreground text-pretty">{notice.description}</p>
                <Button variant="link" className="p-0 h-auto text-primary text-sm">
                  See more
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">{notice.time}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
