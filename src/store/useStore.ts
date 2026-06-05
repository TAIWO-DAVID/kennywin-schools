import { create } from "zustand"
import { supabase } from "@/lib/supabase/supabaseClient" // make sure you have this

type User = {
  name: string
  email: string
  role: string
} | null

type AuthState = {
  user: User
  setUser: (user: User) => void
  signOut: () => Promise<void>   // async now
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  signOut: async () => {
    // Call Supabase signOut
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error("Supabase logout failed:", error.message)
    }
    set({ user: null }) // clear local user
  },
}))
