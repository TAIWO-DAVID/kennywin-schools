"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, ChevronDown, ChevronLeft, GraduationCap, Menu, SchoolIcon, SettingsIcon, User, UserCog, UserCog2Icon } from "lucide-react"
import { useAuthStore } from "@/store/useStore"
import { AddTeacherModal } from "@/components/add-teacher-modal"
import { AddStudentModal } from "@/components/add-student-modal"
import CreateClassModal from "./classes/CreateClassModal"
import { StudentAvatar } from "./student-avatar"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

type SubItem = {
  title: string
  url?: string
  modal?: string
  action?: () => void
}

type MenuItem = {
  title: string
  icon: React.ReactNode
  url?: string
  submenu?: SubItem[]
}

type Props = {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
}

export function AppSidebar({ collapsed, setCollapsed }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)

  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  // const [openMenus, setOpenMenus] = useState<string[]>([]) //for menus not to auto-close when another menu is clicked
  const [mobileOpen, setMobileOpen] = useState(false)

  // Auto close on route change (mobile)
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const activeParent = menuItems.find(item =>
      item.submenu?.some(sub => sub.url === pathname)
    )

    if (activeParent) {
      setOpenMenu(activeParent.title)
    }
  }, [pathname])

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: <Menu size={18} />,
      url: "/admin",
    },
    {
      title: "Teachers",
      icon: <UserCog size={18} />,
      submenu: [
        { title: "All Teachers", url: "/admin/teachers" },
        { title: "Add Teacher", modal:"addTeacher" },
      ],
    },
    {
      title: "Students",
      icon: <GraduationCap size={18} />,
      submenu: [
        { title: "All Students", url: "/admin/students" },
        { title: "Add Student", modal: "addStudent" },
      ],
    },
    {
      title: "Classes",
      icon: <SchoolIcon size={18} />,
      submenu: [
        { title: "All Classes", url: "/admin/classes" },
        { title: "Add a Class",   action: () => router.push("/admin/classes?create=true")},
        { title: "Archived Classes", url: "/admin/classes/archived" },
      ],
    },
    {
      title: "Subjects",
      icon: <BookOpen size={18} />,
      submenu: [
        { title: "All Subjects", url: "/admin/subjects" },
        // { title: "Add a Class",   action: () => router.push("/admin/classes?create=true")},
        { title: "Archived Subjects", url: "/admin/subjects/archived" },
      ],
    },
    {
      title: "Settings",
      icon: <SettingsIcon size={18} />,
      submenu: [
        { title: "Academic Sessions", url: "/admin/settings/sessions" }
      ]
    },
  ]

  const toggleMenu = (title: string) => {
    setOpenMenu((prev) => (prev === title ? null : title))
  }

  //for menus not to auto-close when another menu is clicked
  // const toggleMenu = (title: string) => {
  //   setOpenMenus((prev) =>
  //     prev.includes(title)
  //       ? prev.filter((m) => m !== title)
  //       : [...prev, title]
  //   )
  // }

  const handleSignOut = () => {
    signOut()
    router.replace("/login")
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-900 text-white p-2 rounded-md shadow"
      >
        <Menu size={18} />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 80 : 256,
          x: mobileOpen ? 0 : undefined,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 25,
        }}
        className={`
          fixed lg:relative z-50 h-full
          bg-slate-950 text-slate-200
          border-r border-slate-800
          flex flex-col
          ${mobileOpen ? "left-0" : "-left-full lg:left-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <Image
                src="/images/school_logo_enhanced_brightness-no-bg-Photoroom.png"
                width={28}
                height={28}
                alt="logo"
              />
              <span className="font-semibold">Standard School</span>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-1 hover:bg-slate-800 rounded"
          >
            <ChevronLeft
              className={`transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
              size={18}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-2 sidebar-scroll scroll-smooth pr-2 bg-slate-950 text-slate-200 antialiased">
          {menuItems.map((item) => {
            const isActive = item.url && pathname === item.url
            const isOpen = openMenu === item.title

            return (
              <div key={item.title} className="relative">
                {/* Sliding Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                    }}
                  />
                )}

                {item.url ? (
                  <Link
                    href={item.url}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg
                      transition
                      ${isActive
                        ? "bg-slate-800 text-white"
                        : "hover:bg-slate-800"}
                    `}
                  >
                    {item.icon}
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800 transition"
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        {!collapsed && <span>{item.title}</span>}
                      </div>
                      {!collapsed && (
                        <ChevronDown
                          className={`transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                          size={16}
                        />
                      )}
                    </button>

                    {/* Animated Submenu */}
                    <AnimatePresence>
                      {isOpen && !collapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          {item.submenu?.map((sub) => {
                            // ✅ MODAL
                            if (sub.modal) {
                              return (
                                <button
                                  key={sub.title}
                                  onClick={() => setActiveModal(sub.modal!)}
                                  className="block w-full text-left pl-10 pr-3 py-2 text-sm rounded-md text-slate-400 hover:text-white"
                                >
                                  {sub.title}
                                </button>
                              )
                            }

                            // ✅ ACTION (THIS IS WHAT YOU WERE MISSING)
                            if (sub.action) {
                              return (
                                <button
                                  key={sub.title}
                                  onClick={sub.action}
                                  className="block w-full text-left pl-10 pr-3 py-2 text-sm rounded-md text-slate-400 hover:text-white"
                                >
                                  {sub.title}
                                </button>
                              )
                            }

                            // ✅ URL (default)
                            return (
                              <Link
                                key={sub.url}
                                href={sub.url!}
                                className={`block pl-10 pr-3 py-2 text-sm rounded-md ${
                                  pathname === sub.url
                                    ? "text-blue-400"
                                    : "text-slate-400 hover:text-white"
                                }`}
                              >
                                {sub.title}
                              </Link>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800 p-4">
          <div className="group relative flex items-center gap-3 p-3 rounded-2xl 
                          bg-slate-900/40 backdrop-blur-md
                          transition-all duration-300
                          hover:bg-slate-800/60
                          hover:shadow-xl hover:shadow-blue-500/10
                          hover:-translate-y-1">

            {/* Subtle glow layer */}
            <div className="absolute inset-0 rounded-2xl opacity-0 
                            bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 
                            transition-opacity duration-300 group-hover:opacity-100" />

            {/* Avatar */}
            <div className="relative bg-slate-800 p-2 rounded-xl 
                            transition-all duration-300 
                            group-hover:bg-gradient-to-br 
                            group-hover:from-blue-500 
                            group-hover:to-indigo-600 
                            group-hover:scale-105">

              <User size={18} className="transition-colors duration-300 group-hover:text-white" />

              {/* Online status dot */}
              <span className="absolute -bottom-1 -right-1 w-3 h-3 
                              bg-emerald-500 rounded-full border-2 border-slate-900 
                              animate-pulse" />
            </div>

            {!collapsed && user?.email && (
              <div className="relative flex-1">
                <div className="text-xs font-semibold truncate 
                                text-slate-300 
                                transition-colors duration-300 
                                group-hover:text-white">
                  {user?.email}
                </div>

                <button
                  onClick={handleSignOut}
                  className="text-xs text-slate-400 
                            transition-all duration-300 
                            group-hover:text-white
                            group-hover:tracking-wide"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
      
      
      {/* Student Modal */}
      <AddStudentModal
        isOpen={activeModal === "addStudent"}
        onClose={() => setActiveModal(null)}
        onStudentAdded={() => {
          console.log("Student added successfully!")
          setActiveModal(null)
        }}
      />
      
      {/* Teachers Modal */}
      <AddTeacherModal
        isOpen={activeModal === "addTeacher"}
        onClose={() => setActiveModal(null)}
      />

      {/* Create Class Modal */}
      {/* <CreateClassModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        form={newClass}
        setForm={setNewClass}
        onSubmit={handleCreateClass}
      /> */}
</>
  )
}