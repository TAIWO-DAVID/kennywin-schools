import AuthGuard from '@/components/AuthGuard'
import React from 'react'
import { Toaster } from "@/components/ui/toaster"

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  )
}

export default layout