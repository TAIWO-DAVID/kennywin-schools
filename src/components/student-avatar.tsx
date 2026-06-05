import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface StudentAvatarProps {
  firstName: string
  lastName: string
  size?: "sm" | "md" | "lg"
}

export function StudentAvatar({ firstName, lastName, size = "md" }: StudentAvatarProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`

  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-12 w-12 text-base",
    lg: "h-20 w-20 text-xl",
  }

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage
        src={`/diverse-student-avatars.png?height=80&width=80&query=student+avatar+${firstName}+${lastName}`}
      />
      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">{initials}</AvatarFallback>
    </Avatar>
  )
}
