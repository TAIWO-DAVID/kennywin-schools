// hooks/useGroupedStudents.ts

import { useMemo } from "react"
import { Student } from "@/types/student"
import { getClassName } from "@/utils/school/classes/classes"

const LEVEL_ORDER = ["Creche", "KG", "Nursery", "Primary", "JSS", "SSS"]

export function useGroupedStudents(students: Student[], search: string) {
  return useMemo(() => {
    const filtered = students.filter((s) => {
      const name = `${s.first_name} ${s.last_name}`.toLowerCase()
      const cls = getClassName(s.classes).toLowerCase()

      return name.includes(search.toLowerCase()) ||
             cls.includes(search.toLowerCase())
    })

    const grouped = Object.values(
      filtered.reduce((acc, s) => {
        const key = getClassName(s.classes)

        if (!acc[key]) {
          acc[key] = {
            name: key,
            classId: s.class_id,
            students: [],
            sort: {
              level: s.classes?.level,
              grade: s.classes?.grade ?? 0,
              stream: s.classes?.stream ?? "",
            },
          }
        }

        acc[key].students.push(s)
        return acc
      }, {} as Record<string, any>)
    )

    return grouped.sort((a, b) => {
      const lA = LEVEL_ORDER.indexOf(a.sort.level)
      const lB = LEVEL_ORDER.indexOf(b.sort.level)

      if (lA !== lB) return lA - lB
      if (a.sort.grade !== b.sort.grade) return a.sort.grade - b.sort.grade

      return a.sort.stream.localeCompare(b.sort.stream)
    })
  }, [students, search])
}