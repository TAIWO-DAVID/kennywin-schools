import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Search } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import supabase from "@/lib/supabase/supabaseClient"

interface TeacherHeaderProps {
  teacher: {
    first_name?: string;
    last_name?: string;
    email?: string;
    subject?: string;
    profile_img?: string;
  } | null;
}

export function TeacherHeader({ teacher }: TeacherHeaderProps) {
  
  const [showSearch, setShowSearch] = useState(false)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const getInitials = () => {
    const first = teacher?.first_name?.[0] || ""
    const last = teacher?.last_name?.[0] || ""
    return (first + last).toUpperCase() || "T"
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">

      <div className="px-4 py-3 sm:px-6 sm:py-4 space-y-3 sm:space-y-0">

        {/* Top Row */}
        <div className="flex items-center justify-between">

          {/* Greeting */}
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-medium truncate">
              {teacher?.first_name
                ? `${getGreeting()}, ${teacher.first_name}`
                : getGreeting()}
            </p>

            <p className="text-xs text-muted-foreground truncate">
              {teacher?.subject || "Teacher"}
            </p>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Notification */}
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-muted transition"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
            </Button>

            {/* Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-8 h-8 sm:w-9 sm:h-9 ring-1 ring-border cursor-pointer">
                  <AvatarImage
                    src={teacher?.profile_img || ""}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                  <AvatarFallback className="text-xs">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>
                  {teacher?.first_name || "Teacher"}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    window.location.href = "/login"
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search Row */}
        {/* Mobile Search Toggle */}
        <div className="sm:hidden">
          {showSearch ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                autoFocus
                placeholder="Search..."
                className="pl-10"
                onBlur={() => setShowSearch(false)}
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(true)}
            >
              <Search className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Desktop Search */}
        <div className="hidden sm:block flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search students, classes..."
              className="pl-10"
            />
          </div>
        </div>

      </div>
    </header>
  )
}