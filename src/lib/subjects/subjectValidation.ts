// /src/lib/subjects/subjectValidation.ts

import { Subject } from "@/types/subject"

export const normalizeSubjectName = (name: string) => {
  return name.trim()
}

export const isEmptySubjectName = (name?: string) => {
  return !name || name.trim().length === 0
}