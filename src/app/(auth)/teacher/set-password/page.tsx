'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function SetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [hasSession, setHasSession] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize session from invite link or existing session
  useEffect(() => {
    const init = async () => {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");

        if (access_token && refresh_token) {
          const { error, data } = await supabase.auth.setSession({ access_token, refresh_token });
          if (!error) {
            setUserId(data.user?.id || null);
            setHasSession(true);

            // Force reload so middleware sees the session
            window.location.replace(window.location.pathname);
          } else {
            toast.error("Invalid or expired invite link.");
          }
          setLoading(false);
          return;
        }
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUserId(data.session.user.id);
        setHasSession(true);
      } else {
        toast.error("Invalid or expired invite link.");
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleSetPassword = async () => {
    if (!newPassword) return toast.error("Please enter a new password");

    setSubmitting(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message || "Failed to set password");
      setSubmitting(false);
      return;
    }

    // Ensure teacher row exists
    if (userId) {
      const { data: existing } = await supabase
        .from("teachers")
        .select("teacher_id")
        .eq("teacher_id", userId)
        .maybeSingle();

      if (!existing && userId) {
        await supabase.from("teachers").insert({
          teacher_id: userId,
          profile_completed: false
        });
      }
    }

    toast.success("Password set successfully!");

    setTimeout(() => {
      router.replace("/teacher/form"); // Go to onboarding
    }, 500);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">Loading...</div>
  );

  if (!hasSession) return (
    <div className="h-screen flex items-center justify-center">
      <p>Invite link is invalid or expired.</p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Set Your Password</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label>New Password</Label>
          <Input
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <Button onClick={handleSetPassword} disabled={submitting}>
          {submitting ? "Setting Password..." : "Set Password"}
        </Button>
      </div>
    </div>
  );
}