
export interface Subject {
  id: string
  name: string
  code?: string
  category?: string
  description?: string
  is_active: boolean
  // is_core?: boolean
  class_id?: number
  created_at?: string
}