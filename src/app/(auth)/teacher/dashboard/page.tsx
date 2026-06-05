"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase/supabaseClient";

import { TeacherSidebar } from "@/components/teacher-sidebar";
import { TeacherHeader } from "@/components/teacher-header";
import { WelcomeBanner } from "@/components/welcome-banner";
import { ClassStatistics } from "@/components/class-statistics";
import { UpcomingSchedule } from "@/components/upcoming-schedule";
import { RecentSubmissions } from "@/components/recent-submissions";
import { DailyNotices } from "@/components/daily-notices";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function TeacherDashboard() {
  const { session } = useAuth();

  const [teacher, setTeacher] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!session) return; // AuthGuard already protects this page

    const fetchData = async () => {
      setLoadingData(true);

      try {
        const userId = session.user.id;

        const { data: teacherData, error: teacherError } = await supabase
          .from("teachers")
          .select("*")
          .eq("teacher_id", userId)
          .maybeSingle();

        if (teacherError) throw teacherError;

        // const { data: classData, error: classError } = await supabase
        //   .from("classes")
        //   .select("*")
        //   .eq("teacher_id", userId);

        const { data: classData, error: classError } = await supabase
          .from("classes")
          .select("*")
          .order("order_number", { ascending: true });

        if (classError) throw classError;

        setTeacher(teacherData);
        setClasses(classData || []);
      } catch (err: any) {
        console.error("Dashboard fetch error:");
        console.error("Message:", err?.message);
        console.error("Details:", err?.details);
        console.error("Hint:", err?.hint);
        console.error("Code:", err?.code);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [session]);

  // if (loadingData) {
  //   return (
  //     <div className=" bg-cover h-max">
  //       <LoadingSpinner/>
  //     </div>
  //   )
  // }

  if (!teacher) {
    return <div className="p-6 text-center">Teacher profile not found.</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <TeacherSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TeacherHeader teacher={teacher} />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <WelcomeBanner teacher={teacher} />

          <ClassStatistics
            totalStudents={classes.reduce((acc, c) => acc + (c.student_count || 0), 0)}
            totalClasses={classes.length}
            pendingGrading={classes.reduce((acc, c) => acc + (c.pending_grading || 0), 0)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* <UpcomingSchedule classes={classes} />
            <RecentSubmissions teacherId={teacher.teacher_id} /> */}
          </div>

          <DailyNotices />
        </main>
      </div>
    </div>
  );
}