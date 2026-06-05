"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Student } from "@/types/student"
import { Download, Trophy, TrendingUp, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StudentResultsProps {
  student: Student
}

export function StudentResults({ student }: StudentResultsProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  // ✅ Safe fallback: handle if results is undefined or empty
  // const results = student.results || []

  const getGradeDisplay = (grade: number) => {
    const grades = {
      1: { text: "A", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
      2: { text: "B", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
      3: { text: "C", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
      4: { text: "D", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
      5: { text: "F", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
    }
    return grades[grade as keyof typeof grades] || { text: "N/A", color: "bg-gray-100 text-gray-800" }
  }

  // const calculateAverage = () => {
  //   if (!student.results || student.results.length === 0) return 0
  //   const total = student.results.reduce((sum, result) => sum + result.score, 0)
  //   return Math.round((total / student.results.length) * 10) / 10
  // }


  const getOverallRemark = (average: number) => {
    if (average >= 90) return { text: "Excellent", color: "text-green-600" }
    if (average >= 80) return { text: "Very Good", color: "text-blue-600" }
    if (average >= 70) return { text: "Good", color: "text-yellow-600" }
    if (average >= 60) return { text: "Fair", color: "text-orange-600" }
    return { text: "Needs Improvement", color: "text-red-600" }
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "PDF Downloaded",
        description: "Your results have been downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading your results. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  // const average = calculateAverage()
  // const remark = getOverallRemark(average)
  // const highestScore = student.results?.length ? Math.max(...student.results.map(r => r.score)) : 0
  // const lowestScore = student.results?.length ? Math.min(...student.results.map(r => r.score)) : 0


  return (
    <div className="animate-slide-in space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Average Score</span>
            </div>
            {/* <p className="text-2xl font-bold text-primary">{average}%</p> */}
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-muted-foreground">Highest Score</span>
            </div>
            {/* <p className="text-2xl font-bold text-green-600">{highestScore}%</p> */}
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-muted-foreground">Lowest Score</span>
            </div>
            {/* <p className="text-2xl font-bold text-orange-600">{lowestScore}%</p> */}
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Overall Remark</span>
            </div>
            {/* <p className={`text-lg font-bold ${remark.color}`}>{remark.text}</p> */}
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card className="shadow-lg border-0 bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Academic Results
          </CardTitle>
          <Button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            variant="outline"
            className="gap-2 bg-transparent"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </CardHeader>

        <CardContent>
          {/* {results.length > 0 ? ( */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Subject</TableHead>
                    <TableHead className="font-semibold text-center">Score</TableHead>
                    <TableHead className="font-semibold text-center">Grade</TableHead>
                    <TableHead className="font-semibold text-center">Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {results.map((result, index) => {
                    const gradeInfo = getGradeDisplay(result.grade)
                    return (
                      <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{result.subject}</TableCell>
                        <TableCell className="text-center font-semibold text-lg">{result.score}%</TableCell>
                        <TableCell className="text-center">
                          <Badge className={gradeInfo.color}>{gradeInfo.text}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-20 bg-muted rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${result.score}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })} */}
                </TableBody>
              </Table>
            </div>
          {/* ) : ( */}
            <p className="text-center text-muted-foreground py-4">
              No results available for this student yet.
            </p>
          {/* )} */}

          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-semibold text-lg">Overall Performance</p>
                <p className="text-muted-foreground">
                  Average Score: <span className="font-semibold text-primary">{}%</span>
                </p>
              </div>
              <Badge variant="secondary" className={`text-lg px-4 py-2 ${"Something here"}`}>
                {/* {remark.text} */}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
