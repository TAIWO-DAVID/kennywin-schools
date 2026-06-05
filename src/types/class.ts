
export interface Class {
  id: number
  name?: string // Legacy field - may be inconsistent
  level: string
  grade: number | null // e.g., 1, 2, 3, 4, 5, 6
  stream?: string | null // e.g., 'A', 'B', 'C'
  class_teacher_id?: string | null // UUID reference to teachers.teacher_id
  // class_teacher_name?: string | null // Computed join
  class_teacher?: {
    teacher_id:string,
    first_name:string,
    last_name:string,
  } | null
  order_number?: number // Deprecated - not used in logic
  created_at?: string

  status?: "active" | "archived" 
}
