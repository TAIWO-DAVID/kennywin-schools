"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  {
    month: "Jan",
    students: 1180,
  },
  {
    month: "Feb",
    students: 1195,
  },
  {
    month: "Mar",
    students: 1210,
  },
  {
    month: "Apr",
    students: 1225,
  },
  {
    month: "May",
    students: 1235,
  },
  {
    month: "Jun",
    students: 1247,
  },
]

export function EnrollmentChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Enrollment</CardTitle>
        <CardDescription>Monthly enrollment numbers for this academic year</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="students" fill="gray" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}