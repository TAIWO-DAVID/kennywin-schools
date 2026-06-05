"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/cn"
import supabase from "@/lib/supabase/supabaseClient"
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  GraduationCap,
  BarChart3,
  MessageSquare,
  Calendar,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/teacher/dashboard" },
  { icon: Users, label: "Class Management", path: "/class" },
  { icon: UserCheck, label: "Attendance", path: "/attendance" },
  { icon: FileText, label: "Assignments", path: "/assignments" },
  { icon: GraduationCap, label: "Exams", path: "/exams" },
  { icon: BarChart3, label: "Results", path: "/results" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: Calendar, label: "Schedule", path: "/schedule" },
]

export function TeacherSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  // collapsed by default
  const [collapsed, setCollapsed] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [manuallyToggled, setManuallyToggled] = useState(false)

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setCollapsed(false)
    }
  }, [])

  // Hover expand for mini sidebar
  const effectiveCollapsed = manuallyToggled
  ? collapsed
  : collapsed && !hovered

  // Collapse on outside click for small screens
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        window.innerWidth < 1024 && 
        !collapsed && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setCollapsed(true)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [collapsed])

  const signOutUser = async () => {
    await supabase.auth.signOut()
    router.replace("/login")
  }

  return (
    <TooltipProvider>
      <div
        ref={sidebarRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
          "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
          effectiveCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {!effectiveCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sidebar-foreground">Teacher</span>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCollapsed(!collapsed) 
              setManuallyToggled(true)
            }}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {effectiveCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.path
            const btn = (
              <Button
                key={index}
                variant={isActive ? "default" : "ghost"}
                onClick={() => router.push(item.path)}
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                  effectiveCollapsed && "justify-center px-2"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!effectiveCollapsed && <span>{item.label}</span>}
              </Button>
            )

            return effectiveCollapsed ? (
              <Tooltip key={index}>
                <TooltipTrigger asChild>{btn}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              btn
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <Button
            onClick={signOutUser}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent",
              effectiveCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!effectiveCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}