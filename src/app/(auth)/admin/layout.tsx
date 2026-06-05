"use client"

import { useEffect, useState } from "react"
import AuthGuard from "@/components/AuthGuard"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuthStore } from "@/store/useStore"
import supabase from "@/lib/supabase/supabaseClient"
import { useRouter } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const setUser = useAuthStore((s) => s.setUser)

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser()

      if (data.user) {
        setUser({
          name: data.user.user_metadata?.name || "",
          email: data.user.email || "",
          role: data.user.user_metadata?.role || "",
        })
      } else {
        setUser(null)
        router.replace("/login")
      }
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (session?.user) {
          setUser({
            name: session.user.user_metadata?.name || "",
            email: session.user.email || "",
            role: session.user.user_metadata?.role || "",
          })
        } else {
          setUser(null)
          router.replace("/login")
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [setUser, router])


  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-slate-100">
        
        {/* Sidebar */}
        <AppSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top Header */}
          <header className="h-16 pl-15 md:pl-10 bg-white border-b flex items-center px-6 shadow-sm">
            <h1 className="left-9 text-lg font-semibold text-slate-800">
              Admin Dashboard
            </h1>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-3">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}