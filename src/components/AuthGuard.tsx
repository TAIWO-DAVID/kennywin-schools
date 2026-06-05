'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/supabaseClient'
import { Loading } from './loading'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, role, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkAccess = async () => {
      if (loading) return

      const publicPages = [
        '/login',
        '/forgot-password',
        '/recovery-handler',
        '/teacher/reset-password',
        '/teacher/set-password',
        '/teacher/form',
        '/about',
        '/contact',
      ]

      // ✅ Allow public pages
      if (publicPages.some(route => pathname.startsWith(route))) {
        setChecking(false)
        return
      }

      // ❌ Not logged in
      if (!session) {
        router.replace('/login')
        return
      }

      // ⏳ Wait for role
      if (!role) {
        console.log("AuthGuard:", { session, role, pathname })
        return
      }

      // =====================
      // ADMIN
      // =====================
      if (role === 'admin') {
        if (!pathname.startsWith('/admin')) {
          router.replace('/admin')
          return
        }

        setChecking(false)
        return
      }

      // =====================
      // STAFF
      // =====================
      if (role === 'staff') {
        const { data } = await supabase
          .from('teachers')
          .select('profile_completed')
          .eq('teacher_id', session.user.id)
          .maybeSingle()

        const needsProfile = !data || !data.profile_completed

        if (needsProfile) {
          if (!pathname.startsWith('/teacher/form')) {
            router.replace('/teacher/form')
            return
          }

          setChecking(false)
          return
        }

        if (!pathname.startsWith('/teacher')) {
          router.replace('/teacher/dashboard')
          return
        }

        setChecking(false)
        return
      }

      // =====================
      // STUDENT
      // =====================
      if (role === 'student') {
        if (!pathname.startsWith('/student')) {
          router.replace('/student')
          return
        }

        setChecking(false)
        return
      }

      router.replace('/login')
    }

    checkAccess()
  }, [session, role, loading, pathname, router])

  if (loading || checking) {
    return (
      <div className="h-screen flex flex-col gap-4 items-center justify-center">
        <Loading type="large" />
        <p>Loading...</p>
      </div>
    )
  }

  return <>{children}</>
}