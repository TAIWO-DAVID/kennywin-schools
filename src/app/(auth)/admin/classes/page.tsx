"use client"

import { useTeachersData } from "@/hooks/useTeachersData"
import { useState } from "react"
import { ClassesManagement } from "@/components/classes/ClassManagement"
import LoadingSpinner from "@/components/LoadingSpinner"
import { Class } from "@/types"

export default function ClassesPage() {
  return <ClassesManagement/>
}