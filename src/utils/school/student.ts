import supabase from "@/lib/supabase/supabaseClient";

export async function generateUniqueStudentId() {
    let unique = false;
    let studentId = "";

    while (!unique) {
      // Format: STU2025S4HH  (no dash, random alphanumeric suffix)
      const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
      studentId = `STU${new Date().getFullYear()}${randomPart}`;

      const { data, error } = await supabase
        .from("students")
        .select("student_id")
        .eq("student_id", studentId)
        .maybeSingle();

      if (error) throw error;
      if (!data) unique = true;
    }

    console.log("Generated student ID:", studentId);

    return studentId;
  }