import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { getApiBaseUrl } from "@/lib/apiBase";
import { toast } from "sonner";
import NotFound from "./NotFound";

const StudentResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const API = getApiBaseUrl();

  const [checking, setChecking] = useState(true);
  const [invalid, setInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setInvalid(true);
      setChecking(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `${API}/student/reset-password/status?token=${encodeURIComponent(token)}`
        );
        if (cancelled) return;
        if (res.status === 404) {
          setInvalid(true);
        }
      } catch {
        if (!cancelled) setInvalid(true);
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, API]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/student/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };
      if (res.status === 404) {
        setInvalid(true);
        return;
      }
      if (!res.ok) {
        toast.error(data.error || "Could not reset password");
        return;
      }
      toast.success(data.message || "Password updated");
      window.location.href = "/student-login";
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#8ecae6] to-[#219ebc] flex items-center justify-center p-4">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>
    );
  }

  if (invalid) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8ecae6] to-[#219ebc] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <img
            src="/lovable-uploads/23ead6eb-64a7-49ff-b85e-923f1ded7e0e.png"
            alt="SINU Logo"
            className="h-16 w-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-[#082952] mb-2">Choose a new password</h1>
          <p className="text-[#219ebc] text-sm">This link is valid for 15 minutes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#082952] font-medium">
              New password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="border-[#8ecae6] focus:border-[#219ebc] pr-10"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#219ebc] hover:text-[#082952]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-[#082952] font-medium">
              Confirm password
            </Label>
            <Input
              id="confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="border-[#8ecae6] focus:border-[#219ebc]"
              required
              minLength={8}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#219ebc] hover:bg-[#082952] text-white py-2 px-4 rounded-md transition-colors"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/student-login"
            className="text-[#219ebc] hover:text-[#082952] text-sm font-medium"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentResetPassword;
