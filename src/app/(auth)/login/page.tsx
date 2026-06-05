"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, GraduationCap, Info, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { login } from "@/services/auth.service";
import AuthGuard from "@/components/AuthGuard";
import {Loading} from "@/components/loading";
import Image from "next/image";
import { useAuthStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "staff" | "admin">("student");
  const [emailOrId, setEmailOrId] = useState<string>(""); // email for staff, student_id for student
  const [password, setPassword] = useState<string>(""); // password or surname
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          {/* <button
            type="button"
            onClick={() => router.push("/")}
            className="mb-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            ← Back
          </button> */}

          {/* School Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="border-primary border-2 p-3 rounded-full hover:opacity-50">
                <a href="/">
                  <Image
                    src="/images/school_logo_enhanced_brightness-no-bg.png"
                    alt="School Logo"
                    width={40}
                    height={40}
                  />
                </a>
              </div>
            </div>
            {/* <h1 className="text-2xl font-bold text-slate-900"> */}
            <h1 className="text-2xl font-bold text-primary">
              Standard School
            </h1>
            <p className="text-slate-600 mt-1">
              Admin, Staff & Student Portal
            </p>
          </div>

          {/* Role Selector */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`px-4 py-2 rounded ${
                role === "student"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("staff")}
              className={`px-4 py-2 rounded ${
                role === "staff"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Staff
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`px-4 py-2 rounded ${
                role === "admin"
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Admin
            </button>
          </div>

          {/* Login Form */}
          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-primary">Sign In</CardTitle>
              {/* <CardTitle className="text-2xl text-center">Sign In</CardTitle> */}
              <CardDescription className="text-center font-bold">
                {role === "student"
                  ? "Login with your Student ID and Surname"
                  : "Login with your Email and Password"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-7 py-5">
              <form
                // autoComplete="off"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);

                  try {
                    let loginEmail = emailOrId;
                    let loginPassword = password;

                    if (role === "student") {
                      // transform student_id → fake email
                      loginEmail = `${emailOrId}@school.local`;
                      loginPassword = password.toLowerCase(); // surname
                    }

                    const user = await login(emailOrId, password, role);
                    // console.log("User after login:", user);

                    if (user) {
                      useAuthStore.getState().setUser(user);
                      console.log("Logged in:", user);
                      setPassword("");

                      if (role === "student") {
                        router.push("/student/dashboard");
                        console.log(role);
                      } else if (role === "staff") {
                        router.push("/teacher/dashboard");
                        console.log(role);
                        toast.success('Welcome !!!')
                      } else if(role === "admin"){
                        // return;
                        router.push("/admin");
                        toast.success('Welcome !!!')
                      }

                    } else {
                      setError("Invalid login credentials");
                    }
                  } catch (err: any) {
                    setError(err.message);
                  }

                  setLoading(false);
                }}
                >
                {error ? (
                  <div className="mb-5 text-red-500 border-red-500 border rounded p-2 text-sm flex items-center gap-3">
                    <Info className="w-4" />
                    <span >error: {error}</span>
                  </div>
                ) : null}

                <div className="space-y-2">
                  <Label htmlFor="emailOrId">
                    {role === "student" ? "Student ID" : "Email"}
                  </Label>
                  <div className="relative">
                    <Mail className="text-gray-400 w-4 absolute left-2 top-[8px]" />
                    <Input
                      onChange={(e) => {
                        setEmailOrId(e.target.value);
                        setError(null);
                      }}
                      value={emailOrId}
                      id="emailOrId"
                      name="emailOrId"
                      type={role === "staff" ? "email" : "text"}
                      placeholder={
                        role === "student"
                          ? "Enter your Student ID"
                          : "user@gmail.com"
                      }
                      className="py-5 px-8 rounded"
                      required
                    />
                  </div>
                </div>

                {/* Password input */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="pt-5">
                    {role === "student" ? "Surname" : "Password"}
                  </Label>
                  <div className="relative">
                    <Lock className="text-gray-400 w-4 absolute left-2 top-[8px]" />
                    <Input
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError(null);
                      }}
                      value={password}
                      id="password"
                      name="password"
                      autoComplete="new-password"
                      type={showPassword ? "text" : "password"}
                      className="py-5 px-8 rounded"
                      placeholder={
                        role === "student"
                          ? "Enter your Surname"
                          : "Enter your password"
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <Eye className="text-gray-400 w-4 absolute right-2 top-[8px]" />
                      ) : (
                        <EyeOff className="text-gray-400 w-4 absolute right-2 top-[8px]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* submit button */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary rounded"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-4">
                      Loading... <Loading />
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Forgot Password form */}
              {role === "staff" && (
                <div className="text-center space-y-2">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary hover:underline"
                  >
                    Forgot your password?
                  </Link>
                  <div className="text-sm text-slate-600">
                    Need help? Contact{" "}
                    <a
                      href="#"
                      className="text-primary hover:text-primary hover:underline"
                    >
                      IT Support
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-slate-500">
            <p>
              © {new Date().getFullYear()} Standard School. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
