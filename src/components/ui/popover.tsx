"use client"

import * as PopoverPrimitive from "@radix-ui/react-popover"
import { FC, ReactNode } from "react"

export const Popover: FC<{ children: ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }> = ({ children, ...props }) => (
  <PopoverPrimitive.Root {...props}>{children}</PopoverPrimitive.Root>
)
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverContent = PopoverPrimitive.Content
