// /src/lib/subjects/subjectRules.ts

import { Subject } from "@/types/subject"

export const isDuplicateSubject = (
  subjects: Subject[],
  name: string,
  excludeId?: string
) => {
  return subjects.some((subject) => {
    if (excludeId && subject.id === excludeId) return false

    return subject.name.toLowerCase() === name.toLowerCase()
  })
}