import { NextResponse } from "next/server";
import supabase from "@/lib/supabase/supabaseClient"; // adjust path to where you initialize Supabase

export async function GET() {
  const { data, error } = await supabase.from("students").select("*").limit(1);

  if (error) {
    return NextResponse.json({ connected: false, error: error.message });
  }

  return NextResponse.json({ connected: true, data });
}
