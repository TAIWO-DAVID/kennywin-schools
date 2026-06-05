"use client"

import { useMemo, useState } from "react"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BookOpen,
} from "lucide-react"

import toast from "react-hot-toast"

import { useSubjects } from "@/hooks/useSubjects"

import { Subject } from "@/types/subject"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label"

export default function SubjectsManagement() {
  const {
    subjects,
    loadingSubjects,

    createSubject,
    updateSubject,
    archiveSubject,
  } = useSubjects()

  // STATES
  const [searchTerm, setSearchTerm] =
    useState("")

  const [isCreateOpen, setIsCreateOpen] =
    useState(false)

  const [editSubject, setEditSubject] =
    useState<Subject | null>(null)

  const [newSubject, setNewSubject] =
    useState({
      name: "",
      code: "",
      category: "",
      description: "",
    })

  // FILTERED SUBJECTS
  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      const search =
        searchTerm.toLowerCase()

      return (
        subject.name
          .toLowerCase()
          .includes(search) ||
        subject.code
          ?.toLowerCase()
          .includes(search) ||
        subject.category
          ?.toLowerCase()
          .includes(search)
      )
    })
  }, [subjects, searchTerm])

  // CREATE SUBJECT
  const handleCreateSubject =
    async () => {
      const normalizedName =
        newSubject.name.trim()

      if (!normalizedName) {
        toast.error(
          "Subject name is required"
        )

        return
      }

      const success =
        await createSubject({
          name: normalizedName,
          code: newSubject.code.trim(),
          category: newSubject.category.trim(),
          description:
            newSubject.description.trim(),
          is_active: true,
        })

      if (!success) return

      setNewSubject({
        name: "",
        code: "",
        category: "",
        description: "",
      })

      setIsCreateOpen(false)
    }

  // UPDATE SUBJECT
  const handleUpdateSubject =
    async () => {
      if (!editSubject) return

      const success =
        await updateSubject(
          editSubject.id,
          {
            name: editSubject.name,
            code: editSubject.code,
            category:
              editSubject.category,
            description:
              editSubject.description,
          }
        )

      if (!success) return

      setEditSubject(null)
    }

  // ARCHIVE SUBJECT
  const handleArchiveSubject =
    async (
      subjectId: string,
      subjectName: string
    ) => {
      const confirmed = window.confirm(
        `Archive ${subjectName}?`
      )

      if (!confirmed) return

      await archiveSubject(subjectId)
    }

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Subjects
          </h1>

          <p className="text-muted-foreground">
            Manage school subjects
          </p>
        </div>

        <Button
          onClick={() =>
            setIsCreateOpen(true)
          }
        >
          <Plus
            size={18}
            className="mr-2"
          />

          Add Subject
        </Button>
      </div>

      {/* SEARCH */}
      <div className="group relative max-w-md">

        <div
          className="
            pointer-events-none absolute inset-0
            rounded-lg
            opacity-0
            transition duration-300
            group-hover:opacity-100
            bg-gradient-to-r
            from-primary/5
            via-primary/10
            to-primary/5
            blur-xl
          "
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search subjects..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          className="
            pl-9
            border border-slate-200
            rounded-lg
            bg-white
            text-sm
            transition-all duration-300

            focus:border-secondary
            focus-visible:ring-1
            focus-visible:ring-secondary/20
            focus-visible:outline-none

            group-hover:border-secondary/40
            group-hover:shadow-lg  
          "
        />
      </div>

      {/* SUBJECTS */}
      {loadingSubjects ? (
        <div className="text-muted-foreground">
          Loading subjects...
        </div>
      ) : filteredSubjects.length ===
        0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center">

          <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />

          <h3 className="font-semibold">
            No subjects found
          </h3>

          <p className="text-sm text-muted-foreground">
            Start by creating a
            subject
          </p>
        </div>
      ) : (
       <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filteredSubjects.map((subject) => (
          <div
            key={subject.id}
            className="
              group relative overflow-hidden rounded-2xl border 
              bg-background p-5 shadow-sm transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl
            "
          >
            {/* Top glow effect */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-base font-semibold tracking-tight">
                  {subject.name}
                </h3>

                {subject.code && (
                  <p className="text-sm text-muted-foreground">
                    Code: {subject.code}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div
                className="
                  flex items-center gap-1 opacity-100 md:opacity-0
                  transition-opacity duration-300
                  group-hover:opacity-100
                "
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setEditSubject(subject)}
                >
                  <Edit size={15} />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full hover:bg-destructive/10"
                  onClick={() =>
                    handleArchiveSubject(
                      subject.id,
                      subject.name
                    )
                  }
                >
                  <Trash2
                    size={15}
                    className="text-destructive"
                  />
                </Button>
              </div>
            </div>

            {/* Category + Status */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {subject.category && (
                <div
                  className="
                    inline-flex items-center rounded-full
                    bg-primary/10 px-3 py-1
                    text-xs font-medium text-primary
                  "
                >
                  {subject.category}
                </div>
              )}

              <div
                className="
                  inline-flex items-center rounded-full
                  bg-green-100 px-3 py-1
                  text-xs font-medium text-green-700
                "
              >
                Active
              </div>
            </div>

            {/* Description */}
            {subject.description && (
              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {subject.description}
              </p>
            )}

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between border-t pt-4">
              <span className="text-xs text-muted-foreground">
                Subject Record
              </span>

              <div
                className="
                  text-xs font-medium text-primary
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
              >
                Manage →
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* CREATE MODAL */}

      <Dialog
        open={isCreateOpen}
        onOpenChange={
          setIsCreateOpen
        }
      >
        <DialogContent>

          <DialogHeader>
            <DialogTitle>
              Add Subject
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">

            <div>
              <Label className="mb-1">
                Subject Name *
              </Label>

              <Input
                value={newSubject.name}
                onChange={(e) =>
                  setNewSubject({
                    ...newSubject,
                    name:
                      e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label className="mb-1">
                Subject Code
              </Label>

              <Input
                value={newSubject.code}
                onChange={(e) =>
                  setNewSubject({
                    ...newSubject,
                    code:
                      e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label className="mb-1">
                Category
              </Label>

              <Input
                value={
                  newSubject.category
                }
                onChange={(e) =>
                  setNewSubject({
                    ...newSubject,
                    category:
                      e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label className="mb-1">
                Description
              </Label>

              <Input
                value={
                  newSubject.description
                }
                onChange={(e) =>
                  setNewSubject({
                    ...newSubject,
                    description:
                      e.target.value,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() =>
                setIsCreateOpen(
                  false
                )
              }
            >
              Cancel
            </Button>

            <Button
              onClick={
                handleCreateSubject
              }
            >
              Create Subject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}

      {editSubject && (
        <Dialog
          open={!!editSubject}
          onOpenChange={() =>
            setEditSubject(null)
          }
        >
          <DialogContent>

            <DialogHeader>
              <DialogTitle>
                Edit Subject
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">

              <div>
                <Label className="pb-1">
                  Subject Name *
                </Label>

                <Input
                  value={
                    editSubject.name
                  }
                  onChange={(e) =>
                    setEditSubject({
                      ...editSubject,
                      name:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label className="pb-1">
                  Subject Code
                </Label>

                <Input
                  value={
                    editSubject.code ||
                    ""
                  }
                  onChange={(e) =>
                    setEditSubject({
                      ...editSubject,
                      code:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label className="pb-1">
                  Category
                </Label>

                <Input
                  value={
                    editSubject.category ||
                    ""
                  }
                  onChange={(e) =>
                    setEditSubject({
                      ...editSubject,
                      category:
                        e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label className="pb-1">
                  Description
                </Label>

                <Input
                  value={
                    editSubject.description ||
                    ""
                  }
                  onChange={(e) =>
                    setEditSubject({
                      ...editSubject,
                      description:
                        e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <DialogFooter>

              <Button
                variant="outline"
                onClick={() =>
                  setEditSubject(null)
                }
              >
                Cancel
              </Button>

              <Button
                onClick={
                  handleUpdateSubject
                }
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}