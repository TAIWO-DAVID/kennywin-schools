// src/middleware.ts

import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value
        },
        set(name, value, options) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          res.cookies.set({ name, value: "", ...options })
        },
      },
    }
  )

  const { pathname } = req.nextUrl

  const publicRoutes = [
    "/login",
    "/forgot-password",
    "/teacher/set-password",
    "/teacher/reset-password",
    "/teacher/form",
    "/about",
    "/contact",
  ]

  const isPublic = publicRoutes.some(route => pathname.startsWith(route))

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // allow public pages without session
  if (!session && isPublic) {
    return res
  }

  // block protected routes without session
  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const user = session.user
  const role = user.user_metadata?.role

  // redirect logged in users away from login
  if (session && pathname.startsWith("/login")) {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    if (role === "student") {
      return NextResponse.redirect(new URL("/student/dashboard", req.url))
    }

    if (role === "staff") {
      return NextResponse.redirect(new URL("/teacher/dashboard", req.url))
    }
  }

  // ADMIN ROUTES
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // STUDENT ROUTES
  if (pathname.startsWith("/student") && role !== "student") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // TEACHER ROUTES
  if (pathname.startsWith("/teacher")) {
    if (role !== "staff") {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    const { data: teacher } = await supabase
      .from("teachers")
      .select("teacher_id, profile_completed")
      .eq("teacher_id", user.id)
      .maybeSingle()

    // teacher record missing → onboarding
    if (!teacher) {
      return NextResponse.redirect(new URL("/teacher/form", req.url))
    }

    // profile incomplete → onboarding
    if (!teacher.profile_completed && !pathname.startsWith("/teacher/form")) {
      return NextResponse.redirect(new URL("/teacher/form", req.url))
    }
  }

  console.log("User metadata role:", role)

  return res
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/teacher',
    '/teacher/set-password',
    '/teacher/:path*',
    '/student',
    '/student/:path*',
    '/login',
    '/forgot-password',
  ],
}