"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface QuickActionProps {
  onQuickActionClick: (type: "student" | "teacher") => void
}

const actions = [
  {
    title: "Add New Student",
    description: "Register a new student",
    type: "student" as const,
  },
  {
    title: "Add New Teacher",
    description: "Add a new teacher",
    type: "teacher" as const,
  },
]

export function QuickActions({ onQuickActionClick }: QuickActionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common administrative tasks</CardDescription>
      </CardHeader>

      <CardContent className="grid gap-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant="outline"
            className="justify-start h-auto p-4"
            onClick={() => onQuickActionClick(action.type)} // ✅ call parent
          >
            <div className="text-left">
              <div className="font-medium">{action.title}</div>
              <div className="text-xs text-muted-foreground">
                {action.description}
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}