"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  fetchArchivedSubjectsService,
  restoreSubjectService,
} from "@/services/subjects/subjectArchiveService"

type Subject = {
  id: string
  name: string
  code?: string
  category?: string
  is_active: boolean
}

export default function ArchivedSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const loadSubjects = async () => {
    setLoading(true)
    const data = await fetchArchivedSubjectsService()
    setSubjects(data)
    setLoading(false)
  }

  useEffect(() => {
    loadSubjects()
  }, [])

  const handleRestore = async (id: string) => {
    const success = await restoreSubjectService(id)

    if (success) {
      setSubjects((prev) =>
        prev.filter((s) => s.id !== id)
      )
    }
  }

  const filtered = subjects.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.code || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="w-full space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">
          Archived Subjects
        </h1>
        <p className="text-muted-foreground">
          Restore previously archived subjects
        </p>
      </div>

      <Input
        placeholder="Search archived subjects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((subject) => (
              <TableRow key={subject.id}>
                <TableCell>{subject.name}</TableCell>
                <TableCell>{subject.code || "—"}</TableCell>
                <TableCell>{subject.category || "—"}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    Archived
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    onClick={() => handleRestore(subject.id)}
                  >
                    Restore
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}