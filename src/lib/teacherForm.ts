import { supabase } from "./supabase/supabaseClient";

type Teacher = {
  first_name: string;
  last_name: string;
  date_of_birth?: string; // ISO format e.g. "1990-01-01"
  gender: "male" | "female";
  marital_status: "married" | "single" | "in a relationship" | "divorced" | "widowed";
  profile_img?: string;
  phone_number: string;
  email: string;
  alternative_email?: string;
  alternative_phone_number?: string;
  home_address?: string;
  nin: string;
  institutions_attended: any[]; // assuming your `institution_record[]` type is handled
};

export async function createTeacher(teacher: Teacher) {
  // 1. Get logged in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("No authenticated user found");
  }

  // 2. Insert into teachers table
  const { data, error } = await supabase
    .from("teachers")
    .insert([{ ...teacher, user_id: user.id }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}