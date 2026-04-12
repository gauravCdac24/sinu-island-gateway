import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { getApiBaseUrl } from "@/lib/apiBase";
import { setAdminToken } from "@/lib/authStorage";
import { toast } from "sonner";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API = getApiBaseUrl();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }
      if (data.token) {
        setAdminToken(data.token);
        toast.success("Signed in");
        navigate("/admin/dashboard", { replace: true });
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#8ecae6] to-[#219ebc] p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <img
            src="/lovable-uploads/23ead6eb-64a7-49ff-b85e-923f1ded7e0e.png"
            alt="SINU Logo"
            className="mx-auto mb-4 h-16 w-16"
          />
          <h1 className="mb-2 text-2xl font-bold text-[#082952]">Admin portal</h1>
          <p className="text-[#219ebc]">Solomon Islands National University</p>
          <p className="mt-1 text-sm text-[#082952]/80">Admissions — staff sign in</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="admin-user" className="font-medium text-[#082952]">
              Username
            </Label>
            <Input
              id="admin-user"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="border-[#8ecae6] focus:border-[#219ebc]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-pass" className="font-medium text-[#082952]">
              Password
            </Label>
            <div className="relative">
              <Input
                id="admin-pass"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="border-[#8ecae6] pr-10 focus:border-[#219ebc]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transform text-[#219ebc] hover:text-[#082952]"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="admin-remember"
              type="checkbox"
              className="h-4 w-4 rounded border-[#8ecae6] text-[#219ebc] focus:ring-[#219ebc]"
            />
            <Label htmlFor="admin-remember" className="ml-2 text-sm text-[#082952]">
              Remember me
            </Label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#219ebc] py-2 px-4 text-white transition-colors hover:bg-[#082952]"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#082952]">Authorized admissions staff only.</p>
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-sm font-medium text-[#219ebc] hover:text-[#082952]">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
