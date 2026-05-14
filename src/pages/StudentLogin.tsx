import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, ShieldCheck, AtSign, Lock, ArrowLeft, RefreshCw } from "lucide-react";
import { getApiBaseUrl } from "@/lib/apiBase";
import { setStudentToken } from "@/lib/authStorage";
import { toast } from "sonner";

type Step = "credentials" | "otp";

const REFRESH_KEY = "sinu_student_refresh_token";

function setRefreshToken(token: string) {
  localStorage.setItem(REFRESH_KEY, token);
}

const StudentLogin = () => {
  const [step, setStep] = useState<Step>("credentials");
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [maskedDestination, setMaskedDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const API = getApiBaseUrl();

  // ── Step 1: verify credentials ──────────────────────────────────────────
  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim().toLowerCase(), password }),
      });
      const data = (await res.json()) as {
        otpRequired?: boolean;
        maskedDestination?: string;
        message?: string;
        error?: string;
      };
      if (!res.ok) {
        toast.error(data.error || "Sign in failed. Check your credentials.");
        return;
      }
      setMaskedDestination(data.maskedDestination || identifier);
      toast.success(data.message || "OTP sent. Check your email.");
      setStep("otp");
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP input helpers ────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  // ── Step 2: verify OTP ───────────────────────────────────────────────────
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/student/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim().toLowerCase(), otp: code }),
      });
      const data = (await res.json()) as {
        accessToken?: string;
        refreshToken?: string;
        mustResetPassword?: boolean;
        error?: string;
      };
      if (!res.ok) {
        toast.error(data.error || "OTP verification failed.");
        if (res.status === 400 && data.error?.includes("sign in again")) {
          setStep("credentials");
          setOtp(["", "", "", "", "", ""]);
        }
        return;
      }
      if (data.accessToken) {
        setStudentToken(data.accessToken);
        if (data.refreshToken) setRefreshToken(data.refreshToken);
        if (data.mustResetPassword) {
          toast.info("Please change your password after signing in.");
        }
        toast.success("Welcome to the Student Portal!");
        navigate("/student-portal", { replace: true });
      }
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ───────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim().toLowerCase(), password }),
      });
      const data = (await res.json()) as { maskedDestination?: string; message?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error || "Could not resend OTP.");
        return;
      }
      setOtp(["", "", "", "", "", ""]);
      toast.success("A new OTP has been sent.");
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((c) => {
          if (c <= 1) { clearInterval(interval); return 0; }
          return c - 1;
        });
      }, 1000);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#082952] via-[#0b3d6e] to-[#219ebc] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header band */}
          <div className="bg-gradient-to-r from-[#082952] to-[#0d4080] px-8 py-6 text-center">
            <img
              src="/lovable-uploads/23ead6eb-64a7-49ff-b85e-923f1ded7e0e.png"
              alt="SINU Logo"
              className="h-16 w-16 mx-auto mb-3 rounded-full bg-white/10 p-1"
            />
            <h1 className="text-xl font-bold text-white tracking-tight">Student Portal</h1>
            <p className="text-[#8ecae6] text-sm mt-1">Solomon Islands National University</p>
          </div>

          <div className="px-8 py-7">
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${step === "credentials" ? "text-[#082952]" : "text-[#219ebc]"}`}>
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${step === "credentials" ? "bg-[#082952] text-white" : "bg-[#219ebc] text-white"}`}>
                  {step === "otp" ? "✓" : "1"}
                </div>
                <span className="hidden sm:inline">Credentials</span>
              </div>
              <div className="h-px w-8 bg-gray-200" />
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${step === "otp" ? "text-[#082952]" : "text-gray-400"}`}>
                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${step === "otp" ? "bg-[#082952] text-white" : "bg-gray-200 text-gray-400"}`}>
                  2
                </div>
                <span className="hidden sm:inline">Verify OTP</span>
              </div>
            </div>

            {/* ── Step 1: Credentials ── */}
            {step === "credentials" && (
              <form onSubmit={handleCredentials} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="identifier" className="text-[#082952] font-semibold text-sm flex items-center gap-1.5">
                    <AtSign className="h-3.5 w-3.5" />
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="identifier"
                    type="text"
                    autoComplete="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your registered email"
                    className="border-gray-200 focus:border-[#219ebc] focus:ring-[#219ebc]/20 h-11 rounded-lg"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-[#082952] font-semibold text-sm flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" />
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
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

                <div className="flex items-center justify-end">
                  <Link
                    to="/student-forgot-password"
                    className="text-sm text-[#219ebc] hover:text-[#082952] font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-[#082952] hover:bg-[#0d4080] text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying…
                    </span>
                  ) : (
                    "Continue"
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center pt-1">
                  Your login credentials were emailed to you when you submitted your application.
                </p>
              </form>
            )}

            {/* ── Step 2: OTP ── */}
            {step === "otp" && (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#e8f4fd] mb-3">
                    <ShieldCheck className="h-6 w-6 text-[#219ebc]" />
                  </div>
                  <h2 className="font-bold text-[#082952] text-base">Verify your identity</h2>
                  <p className="text-gray-500 text-sm mt-1">
                    We sent a 6-digit code to{" "}
                    <span className="font-semibold text-[#082952]">{maskedDestination}</span>
                  </p>
                </div>

                {/* OTP boxes */}
                <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="h-12 w-10 text-center text-xl font-bold border-2 rounded-lg border-gray-200 focus:border-[#219ebc] focus:outline-none transition-colors text-[#082952] bg-gray-50"
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={loading || otp.join("").length < 6}
                  className="w-full h-11 bg-[#219ebc] hover:bg-[#1a7d96] text-white font-semibold rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying…
                    </span>
                  ) : (
                    "Verify & Sign In"
                  )}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => { setStep("credentials"); setOtp(["", "", "", "", "", ""]); }}
                    className="flex items-center gap-1 text-gray-500 hover:text-[#082952] transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || loading}
                    className="flex items-center gap-1 text-[#219ebc] hover:text-[#082952] disabled:text-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-8 py-4 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
            <p className="text-gray-600">
              New student?{" "}
              <Link to="/apply" className="text-[#219ebc] hover:text-[#082952] font-semibold transition-colors">
                Apply now
              </Link>
            </p>
            <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-[#082952] transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-white/60 mt-4">
          Need help?{" "}
          <a href="mailto:admissions@sinu.edu.sb" className="text-white/80 hover:text-white underline transition-colors">
            Contact Student Services
          </a>
        </p>
      </div>
    </div>
  );
};

export default StudentLogin;
