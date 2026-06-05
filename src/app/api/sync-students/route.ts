import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ⚡ Use service role key (NOT anon key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // 1️⃣ Fetch students from your table
    const { data: students, error } = await supabaseAdmin
      .from("students")
      .select("id, student_id, last_name");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: existingUsers } =
      await supabaseAdmin.auth.admin.listUsers();

    let created = [];
    let skipped = [];

    for (const student of students || []) {
      const email = `${student.student_id}@school.local`;
      const password = student.last_name;

      // 2️⃣ Skip if already exists
      if (existingUsers?.users.find((u) => u.email === email)) {
        skipped.push(student.student_id);
        continue;
      }

      // 3️⃣ Create user in Supabase Auth
      const { error: createError } =
        await supabaseAdmin.auth.admin.createUser({
          email : "STU2025SUAB@school.local",
          password : "Loko",
          email_confirm: true,
          user_metadata: {
            last_name: "Loko",
            role: "student",
            student_id: student.student_id,
          },
        });

      if (createError) {
        console.error(`❌ Error for ${email}:`, createError.message);
      } else {
        created.push(student.student_id);
      }
    }

    return NextResponse.json({
      message: "Sync complete",
      created,
      skipped,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
