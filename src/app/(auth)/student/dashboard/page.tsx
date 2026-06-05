"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/supabaseClient"
import { Student } from "@/types/student"
import { StudentProfile } from "@/components/student-profile"
import { StudentResults } from "@/components/student-results"
import { FeePayment } from "@/components/fee-payment"
import { StudentAvatar } from "@/components/student-avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  User,
  CreditCard,
  BookOpen,
  LogOut,
  GraduationCap,
  Home,
  Calendar,
  Bell,
  Menu,
  X,
  Clock,
  MapPin,
  Loader,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { LoaderIcon } from "react-hot-toast"
import LoadingSpinner  from "@/components/LoadingSpinner"

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [student, setStudent] = useState<Student | null>(null)
  const [feeInfo, setFeeInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast, dismiss } = useToast()
  const router = useRouter() 

  const getClassName = (cls?: any) => {
    if (!cls) return "Unassigned"

    return [cls.level, cls.grade, cls.stream]
      .filter(Boolean)
      .join(" ")
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setIsMobileMenuOpen(false)
  }

  const signOutUser = async () => {
      await supabase.auth.signOut()
      router.push("/login")
  }

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)

      // 1. Get logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      console.log("Supabase Auth user:", user)
      if (userError) {
        console.error("Auth error:", userError)
        toast({
          title: "Authentication Error",
          description: "Could not get logged-in user.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }
      if (!user?.email) {
        toast({
          title: "Not logged in",
          description: "No authenticated user was found.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      // 2. Derive student_id from email (e.g. stu2025s4hh@school.local -> stu2025s4hh)
      const studentId = user.user_metadata?.student_id || user.email.split("@")[0]
      console.log("Derived student_id:", studentId)

      if (!studentId) {
        toast({
          title: "Missing Student ID",
          description: "Could not determine student ID from user.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      try {
        // 3. Fetch student record
       const { data: studentData, error: stuErr } = await supabase
        .from("students")
        .select(`
          *,
          classes ( name )
        `)
        .eq("student_id", studentId)
        .maybeSingle();

        if (stuErr) {
          console.error("Error fetching student:", stuErr)
          toast({
            title: "Error",
            description: "Could not fetch student data.",
            variant: "destructive",
          })
        }

        if (!studentData) {
          toast({
            title: "No student record",
            description: `No student found for ID: ${studentId}`,
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        // 4. Fetch results for this student (results table: id, student_id, subject, score, grade)
        const { data: resultsData, error: resultsErr } = await supabase
          .from("student_results")
          .select("id, student_id, subject, score, grade")
          .eq("student_id", studentId)

        if (resultsErr) {
          console.error("Error fetching results:", resultsErr);
          console.dir(resultsErr, { depth: null });
        }

        // 5. Fetch fee info from fees table
        const { data: feeData, error: feeErr } = await supabase
          .from("fees")
          .select("*")
          .eq("student_id", student?.student_id)
          .maybeSingle()

        if (feeErr) {
          console.error("Error fetching fees:", feeErr)
        }

        // 6. Ensure safe defaults (results [] and subjects [])
        const studentWithDefaults: Student = {
          ...studentData,
          id: studentData?.id ?? "",
          student_id: studentData?.student_id ?? studentId, // fallback to derived one
          subjects: Array.isArray(studentData?.subjects) ? studentData.subjects : [],
          results: Array.isArray(resultsData)
            ? resultsData.map((r: any) => ({
                subject: r.subject,
                score: Number(r.score || 0),
                grade: Number(r.grade || 0),
              }))
            : [],
        };

        setStudent(studentWithDefaults)
        setFeeInfo(feeData ?? null)
      } catch (err) {
        console.error("Unexpected error fetching student data:", err)
        toast({
          title: "Error",
          description: "Unexpected error while loading student data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // // Derived stats (safe)
  // const averageScore =
  //   student?.results && student.results.length > 0
  //     ? student.results.reduce((sum, r) => sum + (r.score || 0), 0) / student.results.length
  //     : 0
  // const totalSubjects = student?.subjects?.length || 0
  // const passedSubjects = student?.results?.filter((r) => (r.score || 0) >= 50).length || 0

  // Loading or not found UI
  if (loading) {
    return (
      <div className=" bg-cover h-max">
        <LoadingSpinner/>
      </div>
    )
  }

  if (!student) {
    return <div className="p-10 text-center">No student data found.</div>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-primary text-primary-foreground shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-6 border-b border-primary-foreground/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-accent p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Standard School</h1>
                <p className="text-xs text-primary-foreground/70">Student Portal</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => handleTabChange("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "dashboard"
                ? "bg-primary-foreground/10 text-primary-foreground"
                : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5"
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => handleTabChange("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "profile"
                ? "bg-primary-foreground/10 text-primary-foreground"
                : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5"
            }`}
          >
            <User className="h-5 w-5" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => handleTabChange("results")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "results"
                ? "bg-primary-foreground/10 text-primary-foreground"
                : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5"
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span>My Results</span>
          </button>

          <button
            onClick={() => handleTabChange("#")}
            // onClick={() => handleTabChange("fees")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activeTab === "fees"
                ? "bg-primary-foreground/10 text-primary-foreground"
                : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5"
            }`}
          >
            <CreditCard className="h-5 w-5" />
            <span>School Fees</span>
          </button>
        </nav>

        <div className="p-4 border-t border-primary-foreground/10">
          <div className="text-xs text-primary-foreground/50 mb-2">Academic Year</div>
          <div className="text-sm font-medium">2025/2026 Session</div>
        </div>
      </aside>

      <main className={`
        flex-1 overflow-y-auto h-screen
        transition-all duration-300
        ${isMobileMenuOpen ? "blur-sm lg:blur-0" : ""}
        lg:ml-64
      `}>
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>

              <div>
                <h2 className="font-semibold text-lg">Student Portal</h2>
                <p className="text-sm text-muted-foreground">Standard School</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2 md:gap-3">
                <StudentAvatar firstName={student.first_name} lastName={student.last_name} size="sm" />
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">
                    {student.first_name} {student.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">{student.student_id}</p>
                </div>
              </div>

              <Button variant="outline" size="sm" onClick={signOutUser} className="gap-2 bg-transparent">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 md:p-6 overflow-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-balance mb-2">
                  Welcome back, {student.first_name}!
                </h2>
                <p className="text-muted-foreground text-sm md:text-base">
                  {String(student.educational_level || "").replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Student •
                  Class: {getClassName(student) || "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 md:p-6">
                        <div className="text-center">
                          {/* <div className="text-2xl font-bold text-primary">{averageScore.toFixed(1)}%</div> */}
                          <p className="text-sm text-muted-foreground">Average Score</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 md:p-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent">
                            {/* {passedSubjects}/{totalSubjects} */}
                          </div>
                          <p className="text-sm text-muted-foreground">Subjects Passed</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4 md:p-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            ₦{feeInfo ? (feeInfo.totalAmount - (feeInfo.balance ?? 0)).toLocaleString() : "0"}
                          </div>
                          <p className="text-sm text-muted-foreground">Fees Paid</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <Clock className="h-5 w-5 text-primary" />
                        Today's Schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">Mathematics</p>
                            <p className="text-xs text-muted-foreground">Mr. Johnson • Room 101</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">8:00 - 9:00 AM</p>
                            <p className="text-xs text-green-600">Current</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">English Language</p>
                            <p className="text-xs text-muted-foreground">Mrs. Smith • Room 205</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">9:00 - 10:00 AM</p>
                            <p className="text-xs text-muted-foreground">Next</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">Physics</p>
                            <p className="text-xs text-muted-foreground">Dr. Brown • Lab 1</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">10:30 - 11:30 AM</p>
                            <p className="text-xs text-muted-foreground">Later</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                        <Bell className="h-5 w-5 text-primary" />
                        School Announcements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 border-l-4 border-primary bg-primary/5">
                          <p className="font-medium text-sm">Mid-term Examinations</p>
                          <p className="text-xs text-muted-foreground">
                            Examinations begin February 15th, 2025. Check your exam timetable.
                          </p>
                        </div>
                        <div className="p-3 border-l-4 border-accent bg-accent/5">
                          <p className="font-medium text-sm">Parent-Teacher Meeting</p>
                          <p className="text-xs text-muted-foreground">
                            Scheduled for February 28th, 2025 at 2:00 PM in the school hall.
                          </p>
                        </div>
                        <div className="p-3 border-l-4 border-green-500 bg-green-50">
                          <p className="font-medium text-sm">Sports Day</p>
                          <p className="text-xs text-muted-foreground">
                            Annual sports day on March 10th, 2025. Registration is now open.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Calendar className="h-4 w-4" />
                        January 2025
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-7 gap-1 text-xs">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                        <div
                          key={`${day}-${index}`}
                          className="text-center p-2 font-medium text-muted-foreground"
                        >
                          {day}
                        </div>
                        ))}
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                          <div
                            key={date}
                            className={`text-center p-2 rounded cursor-pointer hover:bg-muted ${
                              date === 15 ? "bg-primary text-primary-foreground" : ""
                            }`}
                          >
                            {date}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 bg-transparent"
                        onClick={() => handleTabChange("results")}
                      >
                        <BookOpen className="h-4 w-4" />
                        View Results
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 bg-transparent"
                        onClick={() => handleTabChange("fees")}
                      >
                        <CreditCard className="h-4 w-4" />
                        Pay School Fees
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start gap-2 bg-transparent"
                        onClick={() => handleTabChange("profile")}
                      >
                        <User className="h-4 w-4" />
                        Update Profile
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">School Contact</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>123 Education Street, Lagos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <span>+234 123 456 7890</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="animate-fade-in">
              <StudentProfile student={student} />
            </div>
          )}

          {activeTab === "fees" && (
            <div className="animate-fade-in">
              <FeePayment
                feeInfo={feeInfo}
                studentEmail={student.email || ""}
                studentName={`${student.first_name} ${student.last_name}`}
              />
            </div>
          )}

          {activeTab === "results" && (
            <div className="animate-fade-in">
              <StudentResults student={student} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
