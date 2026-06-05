import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabaseClient";
import { registerStudent } from "@/services/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { student_id, first_name, last_name, middle_name, class_id } = body;

    // 1️⃣ Insert into students table
    const { data, error } = await supabase
      .from("students")
      .insert([
        {
          student_id,
          first_name,
          last_name,
          middle_name,
          class_id,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 2️⃣ Create Supabase Auth account
    const user = await registerStudent(student_id, last_name); // surname = last_name

    return NextResponse.json({ student: data, authUser: user }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
