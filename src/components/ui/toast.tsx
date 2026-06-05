// src/components/ui/toast.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "fixed bottom-4 right-4 z-50 flex w-full max-w-sm items-center gap-2 rounded-md border bg-white p-4 shadow-lg transition-all dark:bg-gray-900",
  {
    variants: {
      variant: {
        default: "border-gray-200 dark:border-gray-700",
        destructive:
          "border-red-500 text-red-900 dark:border-red-700 dark:text-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// ✅ Fix: Omit the native "title" from HTMLAttributes
export interface ToastProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof toastVariants> {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, title, description, variant, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="flex flex-col gap-1">
          {title && <div className="font-semibold">{title}</div>}
          {description && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </div>
          )}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
    )
  }
)
Toast.displayName = "Toast"
