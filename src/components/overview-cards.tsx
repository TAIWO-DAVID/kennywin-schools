import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, BookOpen, Calendar } from "lucide-react"

const stats = [
  {
    title: "Total Students",
    value: "1,247",
    change: "+12 this month",
    icon: GraduationCap,
  },
  {
    title: "Total Teachers",
    value: "89",
    change: "+3 this month",
    icon: Users,
  },
  {
    title: "Active Classes",
    value: "42",
    change: "2 new this semester",
    icon: BookOpen,
  },
  {
    title: "Events This Week",
    value: "8",
    change: "3 upcoming",
    icon: Calendar,
  },
]

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}