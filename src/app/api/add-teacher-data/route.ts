import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service key (for server-side insert)
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      first_name,
      gender,
      dob,
      nationality,
      marital_status,
      religion,
      profile_photo_url,
      email,
      phone_number,
      alt_phone_number,
      residential_address,
      educational_qualifications,
    } = body;

    const { data, error } = await supabase.from("teachers").insert([
      {
        first_name,
        gender,
        dob,
        nationality,
        marital_status,
        religion,
        profile_photo_url,
        email,
        phone_number,
        alt_phone_number,
        residential_address,
        educational_qualifications, // expects array of objects
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err: any) {
    console.error("API error:", err.message);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}