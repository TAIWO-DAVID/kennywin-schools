// src/app/api/admin/teachers/invite/route.ts
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/supabaseAdmin"

export async function POST(req: Request) {
  try {
    const { first_name, last_name, email, phone_number, profile_img} = await req.json()

    if (!email || !first_name || !last_name) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    // Check if teacher already exists
    const { data: existingTeacher } = await supabaseAdmin
      .from("teachers")
      .select("teacher_id")
      .eq("email", email)
      .maybeSingle()

    if (existingTeacher) {
      return NextResponse.json({
        success: false,
        message: "Teacher already exists"
      }, { status: 400 })
    }

    // 1️⃣ Invite user via magic link
    const { data, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/teacher/set-password`, // onboarding page
      data: { role: "staff" },
    })

    if (inviteError) {
      return NextResponse.json({ error: inviteError.message }, { status: 500 })
    }
    console.log("Invite sent:", data)

    // 2️⃣ Insert teacher row in your teachers table
    const { error: teacherError } = await supabaseAdmin
      .from("teachers")
      .insert({
        teacher_id: data.user.id,
        first_name,
        last_name,
        email,
        phone_number,
        profile_img,
        profile_completed: false, // start onboarding as incomplete
      })

    if (teacherError) {
      return NextResponse.json({ error: teacherError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: `Invite sent to ${email}` })
  } catch (err: any) {
    console.error("[InviteTeacherAPI] Error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}