"use client"

import { useEffect, useState } from "react"
import supabase from "@/lib/supabase/supabaseClient"
import { Class } from "@/types"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { ConfirmDialog } from "../ui/confirm-dialog"
import LoadingSpinner from "../LoadingSpinner"
import { ClassesSkeleton } from "../skeletons/ClassesSkeleton"

export default function ArchivedClassesPage() {
    const [loading, setLoading] = useState(true)
    const [classes, setClasses] = useState<Class[]>([])
    const [selectedClassToDelete, setSelectedClassToDelete] = useState<Class | null>(null)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const fetchArchived = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .eq("status", "archived")

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setClasses(data || [])

    setLoading(false)
  }

  useEffect(() => {
    fetchArchived()
  }, [])

  const handleRestore = async (cls: Class) => {
    await supabase
      .from("classes")
      .update({ status: "active" })
      .eq("id", cls.id)

    toast.success("Class restored")
    fetchArchived()
  }

  const openDeleteModal = (cls: Class) => {
    setSelectedClassToDelete(cls)
    setConfirmOpen(true)
  }

  return (
    <>
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* HEADER */}
            <header className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900">
                Archived Classes
            </h1>
            <p className="text-sm text-slate-500">
                Manage and restore previously archived classes
            </p>
            </header>

            {/* CONTENT */}
            {loading ? (
            <ClassesSkeleton />
            ) : classes.length === 0 ? (
            <div className="py-16 text-center">
                <p className="text-sm text-slate-400">
                No archived classes yet
                </p>
            </div>
            ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                {classes.map((cls) => (
                <div
                    key={cls.id}
                    className="
                    group relative overflow-hidden
                    rounded-xl border border-slate-200/70
                    bg-white shadow-sm
                    transition-all duration-300 ease-out
                    hover:-translate-y-1 hover:shadow-xl
                    "
                >

                    {/* Top subtle archive indicator */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300" />

                    {/* BODY */}
                    <div className="p-5 space-y-4">

                    {/* CLASS NAME */}
                    <div className="space-y-1">
                        <p className="text-base font-semibold text-slate-900">
                        {cls.level} {cls.grade} {cls.stream}
                        </p>

                        <p className="text-xs text-slate-400">
                        Archived class
                        </p>
                    </div>

                    {/* STATUS CHIP */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        In archive
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2 pt-2">

                        <Button
                        variant="outline"
                        className="
                            flex-1
                            transition-all duration-200
                            hover:bg-slate-100
                            active:scale-95
                        "
                        onClick={() => handleRestore(cls)}
                        >
                        Restore
                        </Button>

                        <Button
                        variant="ghost"
                        className="
                            text-red-500
                            transition-all duration-200
                            hover:bg-red-50 hover:text-red-600
                            active:scale-95
                        "
                        onClick={() => openDeleteModal(cls)}
                        >
                        Delete
                        </Button>

                    </div>

                    </div>

                    {/* HOVER GLOW */}
                    <div
                    className="
                        pointer-events-none absolute inset-0
                        opacity-0 transition duration-300
                        group-hover:opacity-100
                        bg-gradient-to-br from-slate-500/5 via-transparent to-transparent
                    "
                    />
                </div>
                ))}

            </div>
            )}
        </div>
        </div>

        {/* DIALOG stays as-is */}
        <ConfirmDialog
            open={confirmOpen}
            title="Delete Class"
            description={selectedClassToDelete
                ? `Delete ${selectedClassToDelete.level} ${selectedClassToDelete.grade} permanently? This cannot be undone.`
                : ""}
            confirmText="Delete"
            onConfirm={async () => {
                if (!selectedClassToDelete) return

                try {
                    const { error } = await supabase
                        .from("classes")
                        .delete()
                        .eq("id", selectedClassToDelete.id)

                    if (error) throw error

                    toast.success("Class deleted permanently")
                    setConfirmOpen(false)
                    setSelectedClassToDelete(null)
                    fetchArchived()
                } catch (err: any) {
                    toast.error(err.message)
                }
            } }
            onClose={() => {
                setConfirmOpen(false)
                setSelectedClassToDelete(null)
            } }
        />
    </>
  )
}