import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: "Emma Wilson",
    action: "enrolled in Advanced Mathematics",
    time: "2 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "EW",
  },
  {
    id: 2,
    user: "Mr. David Chen",
    action: "submitted grades for Chemistry 101",
    time: "4 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "DC",
  },
  {
    id: 3,
    user: "Lisa Rodriguez",
    action: "requested schedule change",
    time: "6 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "LR",
  },
  {
    id: 4,
    user: "Ms. Jennifer Park",
    action: "created new assignment for English Literature",
    time: "8 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "JP",
  },
  {
    id: 5,
    user: "Alex Thompson",
    action: "completed registration process",
    time: "1 day ago",
    avatar: "/placeholder.svg?height=32&width=32",
    initials: "AT",
  },
]

export function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest updates from your school</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
              <AvatarFallback>{activity.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{activity.user}</p>
              <p className="text-sm text-muted-foreground">{activity.action}</p>
            </div>
            <div className="text-xs text-muted-foreground">{activity.time}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
