import supabase from "@/lib/supabase/supabaseClient";
import { generateUniqueStudentId } from "@/utils/school/student";
import { getOrCreateParent } from "../parents/parents.services";
// import { generateUniqueStudentId } from "@/utils/school/students";
// import { getOrCreateParent } from "../parents/parents.service";



export async function createStudent(formData: any) {
  const studentId = await generateUniqueStudentId();

  const studentPayload = {
    first_name: formData.first_name,
    last_name: formData.last_name,
    middle_name: formData.middle_name,
    dob: formData.dateOfBirth,
    class_id: formData.class_id ? Number(formData.class_id) : null,
    educational_level: formData.educational_level,
    status: formData.status,
    grade: Number(formData.grade),
    address: formData.address,
    gender: formData.gender,
    student_id: studentId,
  };

  // ----------------------------
  // duplicate check (student domain responsibility)
  // ----------------------------
  const { data: existingStudent, error: checkError } = await supabase
    .from("students")
    .select(`
      id,
      first_name,
      last_name,
      middle_name,
      student_parents (
        parent:parents (email)
      )
    `)
    .eq("first_name", formData.first_name)
    .eq("last_name", formData.last_name)
    .eq("middle_name", formData.middle_name ?? "");

  if (checkError) throw checkError;

  const isDuplicate = existingStudent?.some((s: any) =>
    Array.isArray(s.student_parents) &&
    s.student_parents.some(
      (sp: any) => sp.parent?.email === formData.parentEmail
    )
  );

  if (isDuplicate) {
    throw new Error("Student already exists");
  }

  // ----------------------------
  // parent handled by parent domain
  // ----------------------------
  const parentId = await getOrCreateParent({
    name: formData.parentName,
    phone: formData.parentPhone,
    email: formData.parentEmail,
    address: formData.parentAddress,
  });

  // ----------------------------
  // insert student
  // ----------------------------
  const { data: newStudent, error: insertError } = await supabase
    .from("students")
    .insert([studentPayload])
    .select(`
      *,
      classes:class_id (id, level, grade, stream)
    `)
    .single();

  if (insertError) throw insertError;

  // link parent
  const { error: linkError } = await supabase
    .from("student_parents")
    .insert([
      {
        student_id: newStudent.id,
        parent_id: parentId,
      },
    ]);

  if (linkError) throw linkError;

  // return hydrated student
  const { data: fullStudent, error: fetchError } = await supabase
    .from("students")
    .select(`
      *,
      classes:class_id (id, level, grade, stream)
    `)
    .eq("id", newStudent.id)
    .single();

  if (fetchError) throw fetchError;

  return fullStudent;
}