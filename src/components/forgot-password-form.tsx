// src/components/forgot-password-form.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/supabaseClient'
import Image from 'next/image'
import toast from 'react-hot-toast'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/recovery-handler`,
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/teacher/reset-password`,
      // redirectTo: `${window.location.origin}/teacher/reset-password`
    })

    if (error) setError(toast.error(error.message))
    else setMessage(
      toast.success('Reset Password Email Sent, Check Email!')
    )
  
    console.log("Forgot password form here")

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className='text-primary font-bold text-2xl text-center'>Reset Your Password</h2>
        <div className="flex justify-center mb-4">
            <div className="border-primary border-2 p-3 rounded-full hover:opacity-50">
                <a href="/">
                    <Image
                    src="/images/school_logo_enhanced_brightness-no-bg.png"
                    alt="School Logo"
                    width={40}
                    height={40}
                    />
                </a>
            </div>
        </div>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border px-3 py-2 rounded"
      />
      <button
        type="submit"
        className="w-full bg-primary text-white py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>

      {/* {message && <p className="text-green-500 mt-2">{message}</p>} */}
      {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
    </form>
  )
}
