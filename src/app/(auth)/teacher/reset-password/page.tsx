'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/supabaseClient'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [validSession, setValidSession] = useState(false)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      console.log('SESSION:', session)

      if (session) {
        setValidSession(true)
      } else {
        setValidSession(false)
      }

      setLoading(false)
    }

    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setSubmitting(true)

    // 🔥 ensure session exists BEFORE updating
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      toast.error('Session expired. Please request a new reset link.')
      setSubmitting(false)
      return
    }

    const user = session.user
    const role = user?.user_metadata?.role

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      toast.error(error.message)
      setSubmitting(false)
      return
    }

    // 🔥 2. Determine table based on role
    const getTableByRole = (role: string) => {
      if (role === "student") return "students"
      if (role === "admin") return "admins"
      return "teachers"
    }

    const table = getTableByRole(role)

    // 🔥 3. Update password_changed_at
    const {error: updateError} = await supabase
      .from(table)
      .update({
        password_changed_at: new Date().toISOString(),
      })
      .eq("teacher_id", user.id)
    
    if (updateError) console.error('Failed to update password_changed_at', updateError)



    toast.success('Password updated successfully')

    await supabase.auth.signOut()
    router.replace('/login')
  }

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Verifying link...</p>
      </div>
    )
  }

  // Invalid link
  if (!validSession) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Invalid or expired reset link</p>
      </div>
    )
  }

  // Form
  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="w-96 space-y-4">
        <h2 className="text-primary text-xl font-bold text-center">Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          className="w-full border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full border px-3 py-2 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-primary w-full text-white py-2 rounded"
          disabled={submitting}
        >
          {submitting ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}