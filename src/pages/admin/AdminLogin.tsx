import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, User, Lock } from "lucide-react";
import { getApiBaseUrl } from "@/lib/apiBase";
import { setAdminToken } from "@/lib/authStorage";
import { toast } from "sonner";

const AdminLogin = () => {
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
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password,
        }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }
      if (data.token) {
        setAdminToken(data.token);
        toast.success("Signed in successfully");
        navigate("/admin/dashboard", { replace: true });
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
          {/* Header */}
          <div className="bg-gradient-to-r from-[#082952] to-[#0d4080] px-8 py-6 text-center">
            <img
              src="/lovable-uploads/23ead6eb-64a7-49ff-b85e-923f1ded7e0e.png"
              alt="SINU Logo"
              className="mx-auto mb-3 h-16 w-16 rounded-full bg-white/10 p-1"
            />
            <h1 className="text-xl font-bold text-white tracking-tight">Admin Portal</h1>
            <p className="text-[#8ecae6] text-sm mt-1">Solomon Islands National University</p>
            <p className="mt-1 text-xs text-white/60">Authorised admissions staff only</p>
          </div>

          <div className="px-8 py-7">
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Username or Email */}
              <div className="space-y-1.5">
                <Label htmlFor="admin-identifier" className="font-semibold text-[#082952] text-sm flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Username or Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="admin-identifier"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your username or email"
                  className="border-gray-200 focus:border-[#219ebc] focus:ring-[#219ebc]/20 h-11 rounded-lg"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="admin-pass" className="font-semibold text-[#082952] text-sm flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="admin-pass"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="border-gray-200 focus:border-[#219ebc] focus:ring-[#219ebc]/20 h-11 rounded-lg pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#219ebc] transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#082952] hover:bg-[#0d4080] text-white font-semibold rounded-lg transition-colors text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </div>

          <div className="border-t border-gray-100 px-8 py-4 bg-gray-50 text-center">
            <Link to="/" className="text-sm text-gray-500 hover:text-[#082952] transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
