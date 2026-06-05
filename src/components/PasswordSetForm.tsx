'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function PasswordSetForm({ teacher }: { teacher: any }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSetPassword = async () => {
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) alert('Error: ' + error.message)
    else alert('Password set successfully!')
  }

  return (
    <div className="my-4 p-4 border rounded">
      <h2 className="font-semibold mb-2">Set Your Password</h2>
      <Input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleSetPassword} disabled={loading} className="mt-2">
        {loading ? 'Setting...' : 'Set Password'}
      </Button>
    </div>
  )
}