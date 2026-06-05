import { Class } from "./class";

export interface ParentContact {
  name: string;
  parent_address?: string;
  phone: string;
  email: string;
}

export interface Student {
  // students?: any;
  id: string
  student_id?: string

  first_name: string
  last_name: string
  middle_name?: string
  email?: string
  grade: number

  gender: string
  dob: string
  age?: number
  address: string
  status: string

  educational_level: "early-years" | "primary" | "junior-secondary" | "senior-secondary"

  class_id: number | null
  stream?: "science" | "arts" | "commercial"

  parent_contact?: ParentContact

  // subjects: string[]
  // results: Result[]
  // class?: number

  // add relation for Supabase join
  classes?: Class | null

   // fees: {
  //   tuition: number
  //   paid: number
  //   balance: number
  //   dueDate: string
  // }
  // name: string
}

export interface FeeInfo {
  tuition: number
  amount_paid: number
  balance: number
  due_date: string
}

export type CreateStudentPayload = Omit<
  Student,
  "id" | "age" | "classes"
>


