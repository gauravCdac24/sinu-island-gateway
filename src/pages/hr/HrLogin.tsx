import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, User, Lock } from "lucide-react";
import { getApiBaseUrl } from "@/lib/apiBase";
import { setHrToken } from "@/lib/authStorage";
import { toast } from "sonner";

const HrLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API = getApiBaseUrl();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast.error("Username (or email) and password are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/hr/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }
      if (data.token) {
        setHrToken(data.token);
        toast.success("Signed in to HR portal");
        navigate("/hr/dashboard", { replace: true });
      }
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#082952] via-[#0b3d6e] to-[#219ebc] p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#082952] to-[#0d4080] px-8 py-6 text-center">
            <img
              src="/lovable-uploads/23ead6eb-64a7-49ff-b85e-923f1ded7e0e.png"
              alt="SINU Logo"
              className="mx-auto mb-3 h-16 w-16 rounded-full bg-white/10 p-1"
            />
            <h1 className="text-xl font-bold text-white tracking-tight">HR Admin Portal</h1>
            <p className="text-[#8ecae6] text-sm mt-1">Solomon Islands National University</p>
            <p className="mt-1 text-xs text-white/60">Recruitment & job postings</p>
          </div>
          <div className="px-8 py-7">
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="hr-id" className="font-semibold text-[#082952] text-sm flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Username or Email *
                </Label>
                <Input
                  id="hr-id"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="sinu_hr_admin"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hr-pass" className="font-semibold text-[#082952] text-sm flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="hr-pass"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" disabled={loading} className="w-full h-11 bg-[#082952] hover:bg-[#0d4080]">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <p className="mt-4 text-xs text-center text-muted-foreground">
              Demo: <code className="bg-gray-100 px-1 rounded">sinu_hr_admin</code> /{" "}
              <code className="bg-gray-100 px-1 rounded">SINU_HR_Admin2026!</code>
            </p>
          </div>
          <div className="border-t px-8 py-4 bg-gray-50 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-[#082952]">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HrLogin;
