import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { getApiBaseUrl } from "@/lib/apiBase";
import { toast } from "sonner";

const StudentForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const API = getApiBaseUrl();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/student/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };
      if (res.status === 503) {
        toast.error(data.error || "Could not send email. Try again later.");
        return;
      }
      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }
      setSent(true);
      toast.success(data.message || "Check your email for the reset link.");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8ecae6] to-[#219ebc] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <img
            src="/lovable-uploads/23ead6eb-64a7-49ff-b85e-923f1ded7e0e.png"
            alt="SINU Logo"
            className="h-16 w-16 mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-[#082952] mb-2">Reset password</h1>
          <p className="text-[#219ebc]">Student portal — Solomon Islands National University</p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center text-[#082952]">
            <p className="text-sm">
              If that email is registered for the student portal, we sent a link. It expires in 15
              minutes.
            </p>
            <Link
              to="/student-login"
              className="inline-block text-[#219ebc] hover:text-[#082952] text-sm font-medium"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#082952] font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="The email on your application"
                className="border-[#8ecae6] focus:border-[#219ebc]"
                required
              />
              <p className="text-xs text-[#219ebc]">
                We only send a reset link if this matches an approved student portal account.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#219ebc] hover:bg-[#082952] text-white py-2 px-4 rounded-md transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
            </Button>
          </form>
        )}

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

export default StudentForgotPassword;
