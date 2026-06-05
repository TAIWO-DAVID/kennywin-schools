'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/supabaseClient'

interface AuthContextType {
  user: User | null
  session: Session | null
  role: string | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session fetch error:', error.message);
          if (mounted) setLoading(false);
          return;
        }

        const currentSession = data.session ?? null;
        const currentUser = currentSession?.user ?? null;
        const currentRole = currentUser?.user_metadata?.role ?? null;

        if (mounted) {
          setSession(currentSession);
          setUser(currentUser);
          setRole(currentRole);
          setLoading(false);
        }
      } catch (err) {
        console.error('Unexpected auth error:', err);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        const currentUser = newSession?.user ?? null;
        const currentRole = currentUser?.user_metadata?.role ?? null;

        // Only enforce password_changed_at for teachers
        // if ((currentRole === 'staff' || currentRole === 'student') && currentUser) { ... } //later for student and other users
        if (currentRole === 'staff' && currentUser) {
          const { data, error } = await supabase
            .from('teachers')
            .select('password_changed_at')
            .eq('id', currentUser.id)
            .single();

          if (!error && data?.password_changed_at) {
            const passwordChangedAt = new Date(data.password_changed_at).getTime();
            const sessionCreatedAt = new Date(currentUser.last_sign_in_at || 0).getTime();

            // If session is older than last password change → logout
            if (sessionCreatedAt < passwordChangedAt) {
              await supabase.auth.signOut();
              return;
            }
          }
        }

        if (mounted) {
          setSession(newSession);
          setUser(currentUser);
          setRole(currentRole);
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setRole(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}


const PageReadyContext = createContext<{
  pageReady: boolean
  setPageReady: (v: boolean) => void
} | null>(null)

export function PageReadyProvider({ children }: { children: React.ReactNode }) {
  const [pageReady, setPageReady] = useState(false)

  return (
    <PageReadyContext.Provider value={{ pageReady, setPageReady }}>
      {children}
    </PageReadyContext.Provider>
  )
}

export function usePageReady() {
  const ctx = useContext(PageReadyContext)
  if (!ctx) {
    throw new Error("usePageReady must be used within PageReadyProvider")
  }
  return ctx
}

