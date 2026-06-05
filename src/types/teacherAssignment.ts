import { Class } from "./class"
import { Subject } from "./subject"

export interface Assignment {
  id: string
  teacher_id: string // UUID
  class_id: number
  subject_id: string
  session_id: string
  created_at: string
  class?: Class
  subject?: Subject
}
