'use client'

import React, { useEffect, useState } from 'react'
import TeacherForm from '@/components/TeachersForm'
// import PasswordSetForm from '@/components/PasswordSetForm'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/supabaseClient'
import LoadingSpinner from '@/components/LoadingSpinner'

const Page = () => {
  const { session } = useAuth()
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   const fetchTeacher = async () => {
  //     if (!session?.user) return
  //     const { data, error } = await supabase
  //       .from('teachers')
  //       .select('*')
  //       .eq('teacher_id', session.user.id)
  //       .single()
  //     if (error) console.error('Error fetching teacher:', error.message)
  //     else setTeacher(data)
  //   }

  //   fetchTeacher()
  // }, [session])

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!session?.user) return

      const { data } = await supabase
        .from("teachers")
        .select("*")
        .eq("teacher_id", session.user.id)
        .maybeSingle()

      if (data) setTeacher(data)

      setLoading(false)
    }

    fetchTeacher()
  }, [session])

  if (loading) {
    return (
      <div className=" bg-cover h-max">
        <LoadingSpinner/>
      </div>
    )
  }

  return (
    <main className="p-4">
      <h1 className="text-center text-2xl font-600">Teacher's Form</h1>
      <p className="text-center text-sm text-gray-400">
        Complete this form to get started
      </p>

      {/* <PasswordSetForm teacher={teacher} /> */}
      <TeacherForm teacher={teacher} />
    </main>
  )
}

export default Page