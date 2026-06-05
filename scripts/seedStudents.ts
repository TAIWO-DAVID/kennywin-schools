// scripts/seedStudents.ts
// import * as dotenv from "dotenv";
// dotenv.config({ path: ".env.local" });

import "dotenv/config";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" }); // force load .env.local


import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_BASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role for seeding
);

async function seed() {
  const { error } = await supabase.from("students").insert([
    {
      admission_date: "2023-09-10",
      first_name: "John",
      last_name: "Doe",
      middle_name: "Michael",
      gender: "Male",
      dob: "2010-05-14",
      class_id: 1,
      parent_id: 1,
      address: "123 Main St, Abeokuta",
      phone_number: "09055901391",
      email: "john.doe@example.com",
      blood_group: "O+",
      medical_conditions: "None",
    },
    {
      admission_date: "2023-09-12",
      first_name: "Sarah",
      last_name: "Olawale",
      middle_name: "Grace",
      gender: "Female",
      dob: "2011-08-21",
      class_id: 1,
      parent_id: 2,
      address: "45 Unity Rd, Abeokuta",
      phone_number: "08160043890",
      email: "sarah.olawale@example.com",
      blood_group: "A+",
      medical_conditions: "Asthma",
    },
    // ...add the other 3 here
  ]);

  if (error) {
    console.error("Error seeding students:", error);
  } else {
    console.log("✅ Students seeded successfully!");
  }
}

seed();
