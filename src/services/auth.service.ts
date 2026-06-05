// src/lib/auth.ts (or better: src/lib/students.ts)
import supabase from "@/lib/supabase/supabaseClient"
import  {Student}  from "@/types/student" 
import { getClassName } from "@/utils/school/classes/classes";
import { calculateAge } from "@/utils/date"
import { createClient } from "@supabase/supabase-js"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Student, Staff, Admin login

type UserRole = "student" | "staff" | "admin";

export const login = async (
  identifier: string,
  password: string,
  role: "student" | "staff" | "admin"
) => {
  let email = identifier;
  let pass = password;

  console.log(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )


  if (role === "student") {
    email = `${identifier}@school.local`;
    pass = password; // surname
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) {
    console.error("Login error:", error.message);
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Auth User:", user);


  const userRole =
    (data.user?.user_metadata?.role as "student" | "staff" | "admin") ?? role;

  return {
    id: data.user?.id ?? "",
    email: data.user?.email ?? "",
    name: data.user?.user_metadata?.name ?? "",
    role: userRole,
  };
};

export const signOutUser = async (router: AppRouterInstance) => {
  console.log("logOut Clicked")
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Logout error:", error.message)
    throw error
  }
  router.replace("/login")
}

// Create student account in Supabase Auth
export const registerStudent = async (student_id: string, surname: string) => {
  const email = `${student_id}@school.local`;
  const password = surname; // 👈 surname used as initial password

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: "student",
      student_id,
    },
  });

  if (error) {
    console.error("Register error:", error.message);
    return null;
  }

  return data.user;
}