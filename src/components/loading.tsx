import { cn } from "@/utils/cn"

interface LoadingProps {
  type?: "small" | "medium" | "large"
  className?: string
}

export function Loading({ type = "medium", className }: LoadingProps) {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        {/* Outer ring */}
        <div className={cn("rounded-full border-2 border-muted animate-spin", sizeClasses[type])} />
        {/* Inner dot */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary animate-pulse",
            type === "small" ? "w-1.5 h-1.5" : type === "medium" ? "w-2 h-2" : "w-3 h-3",
          )}
        />
        {/* Moving dot */}
        <div
          className={cn(
            "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary animate-spin",
            type === "small" ? "w-1 h-1" : type === "medium" ? "w-1.5 h-1.5" : "w-2 h-2",
          )}
          style={{
            animationDuration: "1s",
            transformOrigin: `50% ${type === "small" ? "12px" : type === "medium" ? "16px" : "24px"}`,
          }}
        />
      </div>
    </div>
  )
}