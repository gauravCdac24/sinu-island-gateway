import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { getApiBaseUrl } from "@/lib/apiBase";
import { authHeaders, clearStudentToken, getStudentToken } from "@/lib/authStorage";
import { Loader2, Clock, CheckCircle2, XCircle, BookOpen, LogOut } from "lucide-react";
import StudentsHero from '@/components/students/StudentsHero';
import StudentsTab from '@/components/students/StudentsTabs';
import StudentsQuickLinks from '@/components/students/StudentsQuickLinks';
import StudentsNextSteps from '@/components/students/StudentsNextSteps';
import StudentsNewsEventsSection from '@/components/students/StudentsNewsAndEvents';
import InternationalStudentsTab from '@/components/students/InternationalStudentsTab';
import StudentsStudyWithUs from '@/components/students/StudentsStudyWithUs';
import StudentSupportTab from '@/components/students/StudentsSupportTab';
import StudentsFAQSection from '@/components/students/StudentsFAQSection';
import ContactStudentsLife from '@/components/students/ContactStudentsLife';
import BackToTop from '@/components/common/BackToTop';

type ApplicationStatus = "pending" | "approved" | "rejected";

interface StudentProfile {
  fullName: string;
  email: string;
  status: ApplicationStatus;
  programmes: { priority: number; programme_code: string; programme_name: string }[];
  adminRemarks?: string | null;
}

const REFRESH_KEY = "sinu_student_refresh_token";

const StatusBanner: React.FC<{ profile: StudentProfile; onSignOut: () => void }> = ({
  profile,
  onSignOut,
}) => {
  const isPending = profile.status === "pending";
  const isApproved = profile.status === "approved";
  const isRejected = profile.status === "rejected";

  const acceptedCourses = profile.programmes
    .sort((a, b) => a.priority - b.priority)
    .map((p) => p.programme_name);

  if (isPending) {
    return (
      <div className="border-b border-amber-100 bg-amber-50 px-4 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-900 text-sm">Application Under Review</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Welcome, <span className="font-medium">{profile.fullName}</span>. Your application is
                being reviewed by our admissions team. We'll notify you by email once a decision is
                made.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-amber-300 text-amber-800 hover:bg-amber-100 shrink-0"
            onClick={onSignOut}
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  if (isApproved) {
    return (
      <div className="border-b border-emerald-100 bg-emerald-50 px-4 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-emerald-900 text-sm">
                Welcome to SINU, {profile.fullName}!
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                You have been accepted for:{" "}
                <span className="font-semibold">{acceptedCourses.join(" · ")}</span>
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-emerald-300 text-emerald-800 hover:bg-emerald-100 shrink-0"
            onClick={onSignOut}
          >
            <LogOut className="h-3.5 w-3.5 mr-1.5" />
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="border-b border-red-100 bg-red-50 px-4 py-4">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="font-semibold text-red-900 text-sm">Application Not Successful</p>
              <p className="text-xs text-red-700 mt-0.5">
                Dear {profile.fullName}, unfortunately your application was not successful this time.{" "}
                {profile.adminRemarks ? (
                  <span>Admissions note: {profile.adminRemarks}. </span>
                ) : null}
                Please contact the{" "}
                <a href="mailto:admissions@sinu.edu.sb" className="underline font-medium">
                  Admissions Office
                </a>{" "}
                for guidance.
              </p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button asChild size="sm" className="bg-[#082952] hover:bg-[#0d4080] text-white text-xs">
              <Link to="/apply">
                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                Apply Again
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-red-300 text-red-800 hover:bg-red-100 text-xs"
              onClick={onSignOut}
            >
              <LogOut className="h-3.5 w-3.5 mr-1.5" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const StudentsPortal = () => {
  const navigate = useNavigate();
  const API = getApiBaseUrl();
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    const token = getStudentToken();
    if (!token) {
      navigate("/student-login", { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/student/me`, { headers: authHeaders(token) });
        if (!res.ok) {
          clearStudentToken();
          if (!cancelled) navigate("/student-login", { replace: true });
          return;
        }
        const data = (await res.json()) as {
          application?: {
            fullName?: string;
            email?: string;
            status?: string;
            programmes?: { priority: number; programme_code: string; programme_name: string }[];
            adminRemarks?: string | null;
          };
        };
        if (!cancelled && data.application) {
          setProfile({
            fullName: data.application.fullName || "Student",
            email: data.application.email || "",
            status: (data.application.status || "pending") as ApplicationStatus,
            programmes: data.application.programmes || [],
            adminRemarks: data.application.adminRemarks,
          });
        }
      } catch {
        clearStudentToken();
        if (!cancelled) navigate("/student-login", { replace: true });
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [API, navigate]);

  const signOut = async () => {
    const refreshToken = localStorage.getItem(REFRESH_KEY);
    if (refreshToken) {
      try {
        await fetch(`${API}/student/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
      } catch {
        // silently ignore
      }
      localStorage.removeItem(REFRESH_KEY);
    }
    clearStudentToken();
    navigate("/student-login", { replace: true });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-[#0b2c55]">
        <Loader2 className="h-10 w-10 animate-spin text-[#219ebc]" aria-hidden />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {profile && <StatusBanner profile={profile} onSignOut={signOut} />}
      <main>
        <StudentsHero />
        <StudentsTab />
        <StudentsNextSteps />
        <StudentsQuickLinks />
        <StudentsNewsEventsSection />
        <InternationalStudentsTab />
        <StudentsStudyWithUs />
        <StudentSupportTab />
        <StudentsFAQSection />
        <ContactStudentsLife />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default StudentsPortal;
