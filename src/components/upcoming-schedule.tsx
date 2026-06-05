import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin } from "lucide-react"

const scheduleItems = [
  {
    subject: "Advanced Mathematics",
    time: "09:00 AM",
    room: "Room 201",
    class: "Grade 12-A",
  },
  {
    subject: "Calculus Basics",
    time: "11:30 AM",
    room: "Room 203",
    class: "Grade 11-B",
  },
  {
    subject: "Statistics",
    time: "02:00 PM",
    room: "Room 201",
    class: "Grade 12-C",
  },
]

export function UpcomingSchedule() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Schedule</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          See all
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {scheduleItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/10 border border-border"
          >
            <div className="space-y-1">
              <h4 className="font-medium">{item.subject}</h4>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.time}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.room}
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">{item.class}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
