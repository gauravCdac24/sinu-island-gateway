import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { getApiBaseUrl } from "@/lib/apiBase";
import { authHeaders, clearStudentToken, getStudentToken } from "@/lib/authStorage";
import { Loader2 } from "lucide-react";
import PostgraduateHero from '@/components/postgraduate/PostgraduateHero';
import StudyOptionsSection from '@/components/postgraduate/StudyOptionsSection';
import RequirementsSection from '@/components/postgraduate/RequirementsSection';
import SupportSection from '@/components/postgraduate/SupportSection';
import NextStepsSection from '@/components/postgraduate/NextStepsSection';
import BackToTop from '@/components/common/BackToTop';
import PostgraduateTab from '@/components/postgraduate/PostgaduateTab';
import PostgraduateStudyOptions from '@/components/postgraduate/PostgraduateStudyOptions';
import PostgraduateKeyDates from '@/components/postgraduate/PostgraduateKeyDates';
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

const StudentsPortal = () => {
  const navigate = useNavigate();
  const API = getApiBaseUrl();
  const [authLoading, setAuthLoading] = useState(true);
  const [welcomeName, setWelcomeName] = useState<string | null>(null);

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
        const data = (await res.json()) as { application?: { fullName?: string } };
        if (!cancelled && data.application?.fullName) {
          setWelcomeName(data.application.fullName);
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

  const signOut = () => {
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
      <div className="border-b border-[#e2e8f0] bg-[#f0f7fb] px-4 py-3">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[#0b2c55]">
            <span className="font-semibold">Student portal</span>
            {welcomeName ? (
              <span className="text-muted-foreground"> — Welcome, {welcomeName}</span>
            ) : null}
          </p>
          <Button type="button" variant="outline" size="sm" className="border-[#219ebc] text-[#0b2c55]" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
      <main>
        <StudentsHero />
        <StudentsTab/>
        <StudentsNextSteps />
        <StudentsQuickLinks/>
        <StudentsNewsEventsSection />
        <InternationalStudentsTab />
        <StudentsStudyWithUs/>
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
