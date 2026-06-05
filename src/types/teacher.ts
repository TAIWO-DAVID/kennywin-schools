export interface Teacher {
  id: number
  teacher_id: string // UUID - this is what we use for assignments
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  status: 'active' | 'inactive' | 'pending'
  profile_img?: string
  created_at: string
}
