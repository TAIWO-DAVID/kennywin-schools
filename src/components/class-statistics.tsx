import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Clock } from "lucide-react";

type ClassStatisticsProps = {
  totalStudents: number;
  totalClasses: number;
  pendingGrading: number;
};

export function ClassStatistics({
  totalStudents,
  totalClasses,
  pendingGrading,
}: ClassStatisticsProps) {
  const stats = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "text-chart-1",
    },
    {
      title: "Classes Assigned",
      value: totalClasses,
      icon: BookOpen,
      color: "text-chart-2",
    },
    {
      title: "Pending Grading",
      value: pendingGrading,
      icon: Clock,
      color: "text-chart-3",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}