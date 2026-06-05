"use client";

import { useState } from "react";
import { OverviewCards } from "@/components/overview-cards";
import { RecentActivities } from "@/components/recent-activities";
import { EnrollmentChart } from "@/components/enrollment-charts";
import { QuickActions } from "@/components/quick-actions";
import { AddStudentModal } from "@/components/add-student-modal";
import { AddTeacherModal } from "@/components/add-teacher-modal";

export default function Page() {
  const [activeModal, setActiveModal] = useState<"student" | "teacher" | null>(null)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="md:col-span-3">
          <OverviewCards />
        </div>

        <div className="md:col-span-1">
          <QuickActions
            onQuickActionClick={(type) => setActiveModal(type)}
          />

          <AddStudentModal
            isOpen={activeModal === "student"}
            onClose={() => setActiveModal(null)}
            onStudentAdded={() => {
              console.log("Student added successfully!")
              setActiveModal(null)
            }}
          />

          {/* Later you can add AddTeacherModal here */}
          
          <AddTeacherModal
            isOpen={activeModal === "teacher"}
            onClose={() => setActiveModal(null)}
          /> 
         
        </div>
      </div>
    </div>
  )
}
