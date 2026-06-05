// lib/students.ts
import { getClassName } from "@/utils/school/classes/classes";
import { supabase } from "./supabase/supabaseClient"
import {Student} from "@/types/student"
import { toCamelCase } from "@/utils/case";

export const addStudent = async (
  studentData: Omit<Student, "id" | "enrollmentDate">
): Promise<Student> => {
  // 1️⃣ Insert into students table
  const { data: studentInserted, error: studentError } = await supabase
    .from("students")
    .insert([
      {
        first_name: studentData.first_name,
        last_name: studentData.last_name,
        middle_name: studentData.middle_name,
        dob: studentData.dob,
        gender: studentData.gender.toLowerCase(),
        // email: studentData.email,
        address: studentData.address,
        class_id: studentData.class_id,
        educational_level: studentData.educational_level,
      },
    ])
    .select("*")
    .single();

  if (studentError || !studentInserted) {
    console.error("Error inserting student:", studentError);
    throw new Error(studentError?.message || "Failed to add student");
  }

  const studentId = studentInserted.id;

  // 2️⃣ Check/Insert into parents table (if parent data provided)
  let parentId: string | null = null;

  if (studentData.parent_contact) {
    // Try to find parent by unique email (or phone if that’s your identifier)
    let { data: parentFound, error: parentFetchError } = await supabase
      .from("parents")
      .select("id")
      .eq("email", studentData.parent_contact.email)
      .maybeSingle();

    if (parentFetchError) {
      console.error("Parent fetch error:", parentFetchError);
      throw parentFetchError;
    }

    if (parentFound) {
      parentId = parentFound.id;
    } else {
      // Insert new parent if not found
      const { data: parentInserted, error: parentError } = await supabase
        .from("parents")
        .insert([
          {
            name: studentData.parent_contact.name,
            phone_number: studentData.parent_contact.phone,
            email: studentData.parent_contact.email,
            parent_address: studentData.parent_contact.parent_address,
          },
        ])
        .select("id")
        .single();

      if (parentError || !parentInserted) {
        console.error("Parent insert error:", parentError);
        throw parentError;
      }

      parentId = parentInserted.id;
    }
  }

  // 3️⃣ Link student ↔ parent (only if both exist)
  if (parentId) {
    const { error: linkError } = await supabase
      .from("student_parents")
      .insert([
        {
          student_id: studentId,
          parent_id: parentId,
        },
      ]);

    if (linkError) console.error("Student-Parent link error:", linkError);
  }

  // 4️⃣ Insert subjects (if provided)
  // if (studentData.subjects?.length) {
  //   const subjectsToInsert = studentData.subjects.map((subject) => ({
  //     student_id: studentId,
  //     subject,
  //   }));

  //   const { error: subjectsError } = await supabase
  //     .from("student_subjects")
  //     .insert(subjectsToInsert);

  //   if (subjectsError) console.error("Subjects insert error:", subjectsError);
  // }

  // 5️⃣ Fees logic (optional, same idea as before)

  return studentInserted;
};

export const updateStudent = async (
  studentId: string,
  updates: Partial<Student>
): Promise<Student | null> => {
  // Convert to snake_case
  const updatesPayload = toSnakeCase(updates)

  // 1️⃣ Update the students table
  const { error: studentError } = await supabase
    .from("students")
    .update(updatesPayload)
    .eq("id", studentId)

  if (studentError) {
    console.error("Supabase student update error:", studentError.message)
    throw new Error(studentError.message)
  }

  // 2️⃣ Update fees if provided
  // if (updates.fees) {
  //   const { error: feesError } = await supabase
  //     .from("fees")
  //     .update({
  //       tuition: updates.fees.tuition,
  //       paid: updates.fees.paid,
  //       balance: updates.fees.tuition - updates.fees.paid,
  //       due_date: updates.fees.dueDate,
  //     })
  //     .eq("student_id", studentId)

  //   if (feesError) {
  //     console.error("Supabase fees update error:", feesError.message)
  //     throw new Error(feesError.message)
  //   }
  // }
  // 3️⃣ Fetch student with fees
  const { data, error: fetchError } = await supabase
    .from("students")
    .select(
      `
      *,
      fees(*)
    `
    )
    .eq("id", studentId)
    .single()

  if (fetchError) {
    console.error("Supabase fetch error:", fetchError.message)
    throw new Error(fetchError.message)
  }

  return data ? (toCamelCase(data) as Student) : null
}

export const deleteStudent = async (studentId: string): Promise<boolean> => {
  const { error } = await supabase.from("students").delete().eq("id", studentId)

  if (error) {
    console.error("Supabase delete error:", error.message)
    throw new Error(error.message)
  }

  return true
}


export const findStudentsByName = async (
  first_name: string,
  last_name: string,
  middle_name?: string
) => {
  let query = supabase
    .from("students")
    .select("id, student_id, first_name, last_name, middle_name")
    .eq("first_name", first_name)
    .eq("last_name", last_name);

  if (middle_name) {
    query = query.eq("middle_name", middle_name);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data; // array of matching students
};

export const getStudents = async (): Promise<Student[]> => {
  const { data, error } = await supabase
    .from("students")
    .select(`
      *,
      classes:class_id (id, level, grade, stream)
    `)

  if (error) {
    console.error("Error fetching students:", error.message)
    throw new Error(error.message)
  }

  console.log("Fetched students with classes:", data)

  return data as Student[]
}

export const searchStudents = (students: Student[], query: string): Student[] => {
  if (!query.trim()) return students

  const lowercaseQuery = query.toLowerCase()

  return students.filter((student) => {
    const fullName = `${student.first_name} ${student.last_name}`.toLowerCase()
    const className = getClassName(student.classes).toLowerCase()

    return (
      fullName.includes(lowercaseQuery) ||
      className.includes(lowercaseQuery)
    )
  })
}

export const getUniqueClasses = (students: Student[]): string[] => {
  return Array.from(
    new Set(
      students
        .map((student) => getClassName(student.classes)) // might be string | undefined
        .filter((name): name is string => Boolean(name)) // keep only real strings
    )
  ).sort((a, b) => {
    const classOrder = [
      "Creche",
      "KG1",
      "KG2",
      "Nursery 1",
      "Nursery 2",
      "Primary 1",
      "Primary 2",
      "Primary 3",
      "Primary 4",
      "Primary 5",
      "Primary 6",
      "JS1",
      "JS2",
      "JS3",
      "SS1",
      "SS2",
      "SS3",
    ]
    return classOrder.indexOf(a) - classOrder.indexOf(b)
  })
}

export const getUniqueEducationalLevels = (students: Student[]): string[] => {
  return Array.from(new Set(students.map((student) => student.educational_level))).sort()
}

export const getUniqueStreams = (students: Student[]): string[] => {
  return Array.from(new Set(students.filter((s) => s.stream).map((student) => student.stream!))).sort()
}

export const groupStudentsByEducationalLevel = (students: Student[]) => {
  return students.reduce(
    (groups, student) => {
      const level = student.educational_level
      if (!groups[level]) {
        groups[level] = []
      }
      groups[level].push(student)
      return groups
    },
    {} as Record<string, Student[]>,
  )
}

export const getEducationalLevelDisplayName = (level: string): string => {
  const displayNames: Record<string, string> = {
    "early-years": "Early Years (Creche - Nursery 2)",
    primary: "Primary School (Primary 1-6)",
    "junior-secondary": "Junior Secondary (JS1-3)",
    "senior-secondary": "Senior Secondary (SS1-3)",
  }
  return displayNames[level] || level
}

export const getStreamDisplayName = (stream: string): string => {
  const displayNames: Record<string, string> = {
    science: "Science",
    arts: "Arts",
    commercial: "Commercial",
  }
  return displayNames[stream] || stream
}

// Function to auto-assign subjects
const getSubjectsForLevel = (
  level: Student["educational_level"],
  stream?: Student["stream"],
  className?: string
) => {
  switch (level) {
    case "early-years":
      if (className === "Creche") return ["Play Activities", "Basic Recognition", "Motor Skills"]
      if (className?.startsWith("KG")) return ["Phonics", "Numbers", "Drawing", "Rhymes"]
      return ["Reading Readiness", "Number Concepts", "Creative Expression", "Social Skills"]

    case "primary":
      const baseSubjects = ["English", "Mathematics", "Basic Science", "Social Studies"]
      if (className === "Primary 1" || className === "Primary 2") {
        return [...baseSubjects, "CRK"]
      }
      return [...baseSubjects, "Computer Studies", "CRK"]

    case "junior-secondary":
      return [
        "English",
        "Mathematics",
        "Basic Science",
        "Social Studies",
        "Computer Studies",
        "CRK",
        "Physical Education",
        "French",
      ]

    case "senior-secondary":
      const coreSubjects = ["English", "Mathematics"]
      switch (stream) {
        case "science":
          return [...coreSubjects, "Physics", "Chemistry", "Biology", "Further Mathematics", "Computer Science"]
        case "arts":
          return [...coreSubjects, "Literature", "Government", "History", "CRK", "Fine Arts"]
        case "commercial":
          return [...coreSubjects, "Economics", "Accounting", "Commerce", "Business Studies", "Computer Studies"]
        default:
          return coreSubjects
      }

    default:
      return []
  }
}

// Utility to convert camelCase → snake_case
function toSnakeCase(obj: Record<string, any>) {
  const newObj: Record<string, any> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const snakeKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      newObj[snakeKey] = obj[key];
    }
  }
  return newObj;
}

export  type { Student }
