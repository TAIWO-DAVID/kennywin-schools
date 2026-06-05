import { supabase } from "./supabase/supabaseClient";

export async function getUserRole(email: string) {
  try {
    // query all role tables in parallel
    const [teacherRes, parentRes, adminRes] = await Promise.all([
      supabase.from("teachers").select("id").eq("email", email).maybeSingle(),
      supabase.from("parents").select("id").eq("email", email).maybeSingle(),
      supabase.from("admins").select("id").eq("email", email).maybeSingle(),
    ]);

    const roles: string[] = [];
    if (teacherRes.data) roles.push("staff");
    if (parentRes.data) roles.push("parent");
    if (adminRes.data) roles.push("admin");

    return roles;
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return [];
  }
}