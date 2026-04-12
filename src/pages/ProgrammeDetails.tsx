import { useLocation } from "react-router-dom";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ScrolledDesktopHeader from "@/components/layout/ScrolledDesktopHeader";
import React, { useEffect, useState, type ReactNode } from "react";
import Footer from "@/components/layout/Footer";
import ProgrammeHero from "@/components/programmes/ProgrammeHero";
import ProgrammeOverview from "@/components/programmes/ProgrammeOverview";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import ProgrammeStructure from "@/components/programmes/ProgrammeStructure";
import {
  BookOpen,
  ClipboardList,
  Languages,
  ListChecks,
  CalendarDays,
  Award,
  Send,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV_LINKS: { id: string; label: string }[] = [
  { id: "description", label: "Description" },
  { id: "admission_requirement", label: "Admission" },
  { id: "english_requirement", label: "English" },
  { id: "program_requirement", label: "Programme info" },
  { id: "program_structure", label: "Structure" },
  { id: "availability", label: "Availability" },
  { id: "siqf_level", label: "SIQF" },
  { id: "apply_now", label: "How to apply" },
  { id: "contacts", label: "Contacts" },
];

function ProgrammeScrollSection({
  id,
  title,
  eyebrow,
  icon: Icon,
  children,
}: {
  id: string;
  title: string;
  eyebrow: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 md:scroll-mt-32",
        "scroll-smooth"
      )}
    >
      <Card className="mb-8 overflow-hidden border border-gray-200/90 shadow-md transition-shadow duration-300 hover:shadow-lg">
        <CardHeader className="space-y-0 border-b border-university-light-blue/25 bg-gradient-to-r from-university-light-gray/90 to-white pb-4 pt-5">
          <div className="flex items-start gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-university-blue/15 text-university-blue"
              aria-hidden
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-university-blue">
                {eyebrow}
              </p>
              <h2 className="text-xl font-bold text-university-dark-gray sm:text-2xl">{title}</h2>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 text-university-dark-gray">{children}</CardContent>
      </Card>
    </section>
  );
}

const ProgrammeDetails = () => {
  const { state } = useLocation();
  const [activeNav, setActiveNav] = useState<string>("description");

  const {
    programme_entry_requirement,
    programme_english_requirement,
    programme_year,
    programme_department,
    programme_faculty,
    programme_code,
    programme_credits,
    programme_location,
    programme_study_type,
    SIQF_level,
  } = state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const parseLines = (text?: string): string[] => {
    return text
      ? text
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
      : [];
  };

  const admissionRequirements = parseLines(programme_entry_requirement);
  const englishRequirements = parseLines(programme_english_requirement);

  const studyTypeLabel = Array.isArray(programme_study_type)
    ? programme_study_type.join(", ")
    : programme_study_type;

  const navButtonClass = (id: string) =>
    cn(
      "w-full text-left rounded-xl px-3 py-3 text-sm font-medium transition-colors border border-transparent",
      activeNav === id
        ? "bg-university-blue text-white shadow-sm"
        : "text-university-dark-gray hover:bg-university-light-blue/30 hover:border-university-blue/20"
    );

  return (
    <div className="min-h-screen flex flex-col bg-university-light-gray/40">
      <ErrorBoundary>
        <ScrolledDesktopHeader />
      </ErrorBoundary>

      <ProgrammeHero />

      {/* Quick facts — student-oriented at-a-glance */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex lg:flex-wrap lg:gap-4">
              {[
                { label: "Code", value: programme_code || "—" },
                { label: "Credits", value: programme_credits != null ? String(programme_credits) : "—" },
                { label: "Duration (yrs)", value: programme_year != null ? String(programme_year) : "—" },
                { label: "Study mode", value: studyTypeLabel || "—" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-gray-100 bg-university-light-gray/60 px-3 py-2 text-center sm:text-left"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-university-blue">
                    {item.label}
                  </p>
                  <p className="truncate text-sm font-semibold text-university-dark-gray" title={item.value}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                asChild
                className="bg-university-gold text-university-dark-gray hover:bg-university-gold/90 font-semibold"
              >
                <a
                  href="#apply_now"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("apply_now");
                  }}
                >
                  Ready to apply?
                </a>
              </Button>
              <Button asChild variant="outline" className="border-university-blue text-university-dark-gray">
                <Link to="/course-finder">Browse programmes</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 sm:px-6 lg:px-8">
        {/* Desktop: in-page nav */}
        <aside
          className="hidden w-60 shrink-0 md:block lg:w-64"
          aria-label="On this page"
        >
          <nav className="sticky top-28 space-y-1 border-r border-gray-200/80 py-8 pr-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
              On this page
            </p>
            {NAV_LINKS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={navButtonClass(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 py-8">
          {/* Mobile: horizontal jump links */}
          <div className="mb-8 md:hidden">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              Jump to
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {NAV_LINKS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    activeNav === item.id
                      ? "border-university-blue bg-university-blue text-white"
                      : "border-gray-200 bg-white text-university-dark-gray"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <ProgrammeScrollSection
            id="description"
            eyebrow="Start here"
            title="Programme description"
            icon={BookOpen}
          >
            <ProgrammeOverview />
          </ProgrammeScrollSection>

          <ProgrammeScrollSection
            id="admission_requirement"
            eyebrow="Before you apply"
            title="Admission requirements"
            icon={ClipboardList}
          >
            {admissionRequirements.length > 0 ? (
              <ul className="list-disc space-y-2 pl-5 marker:text-university-blue">
                {admissionRequirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">
                Admission requirements will be confirmed when you apply. Contact the faculty office
                if you need advice for your background.
              </p>
            )}
          </ProgrammeScrollSection>

          <ProgrammeScrollSection
            id="english_requirement"
            eyebrow="Language"
            title="English language requirement"
            icon={Languages}
          >
            {englishRequirements.length > 0 ? (
              <ul className="list-disc space-y-2 pl-5 marker:text-university-blue">
                {englishRequirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">
                English requirements will be advised on application. Ask us if you studied in a
                language other than English.
              </p>
            )}
          </ProgrammeScrollSection>

          <ProgrammeScrollSection
            id="program_requirement"
            eyebrow="Key details"
            title="Programme information"
            icon={ListChecks}
          >
            <ul className="space-y-3 text-gray-700">
              <li>
                <span className="font-semibold text-university-dark-gray">Programme code: </span>
                {programme_code || "—"}
              </li>
              <li>
                <span className="font-semibold text-university-dark-gray">Nominal duration: </span>
                {programme_year != null ? `${programme_year} year(s)` : "—"}
              </li>
              {programme_location && (
                <li>
                  <span className="font-semibold text-university-dark-gray">Campus / location: </span>
                  {programme_location}
                </li>
              )}
            </ul>
          </ProgrammeScrollSection>

          <section
            id="program_structure"
            className="scroll-mt-28 md:scroll-mt-32 mb-8"
          >
            <ProgrammeStructure />
          </section>

          <ProgrammeScrollSection
            id="availability"
            eyebrow="Planning"
            title="Availability & intake"
            icon={CalendarDays}
          >
            <p className="text-gray-700">
              Intake and availability can change each year. Use the official application periods
              published by SINU and check with your faculty for the latest cohort dates.
            </p>
            {programme_year != null && (
              <p className="mt-3 text-sm text-gray-600">
                <span className="font-semibold text-university-dark-gray">Indicative length: </span>
                {programme_year} year(s) full-time (part-time may differ).
              </p>
            )}
          </ProgrammeScrollSection>

          <ProgrammeScrollSection
            id="siqf_level"
            eyebrow="Qualifications framework"
            title="SIQF level"
            icon={Award}
          >
            <div className="flex gap-3 rounded-xl border border-amber-200/80 bg-amber-50/80 p-4 text-amber-950">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden />
              <div className="text-sm leading-relaxed">
                <p className="font-semibold text-university-dark-gray mb-1">Heads-up for students</p>
                <p>
                  SINU is aligning programmes with the Solomon Islands Qualifications Framework
                  (SIQF). Published SIQF levels may be updated; always confirm your award level on your
                  offer and transcript.
                </p>
                {SIQF_level != null && SIQF_level !== "" && (
                  <p className="mt-2 font-medium text-university-dark-gray">
                    Listed SIQF level: {String(SIQF_level)}
                  </p>
                )}
              </div>
            </div>
          </ProgrammeScrollSection>

          <ProgrammeScrollSection
            id="apply_now"
            eyebrow="Next steps"
            title="How to apply"
            icon={Send}
          >
            <ol className="list-decimal space-y-3 pl-5 marker:font-semibold text-gray-700">
              <li>Choose your programme and check you meet admission and English requirements.</li>
              <li>Gather certified documents (ID, transcripts, English test if required).</li>
              <li>Submit your application in the official SINU admissions round for your level.</li>
              <li>Watch your email for an offer — then follow instructions to accept and enrol.</li>
            </ol>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                type="button"
                className="bg-university-blue hover:bg-university-dark-gray"
                onClick={() => scrollToSection("admission_requirement")}
              >
                Admission requirements hub
              </Button>
              <Button asChild variant="outline" className="border-university-blue text-university-dark-gray">
                <Link to="/applicant-login">Apply Now</Link>
              </Button>
            </div>
          </ProgrammeScrollSection>

          <ProgrammeScrollSection
            id="contacts"
            eyebrow="Support"
            title="Who to contact"
            icon={Phone}
          >
            <p className="text-gray-700 mb-4">
              Your faculty or school office can help with programme content, prerequisites, and
              timetabling.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>
                <span className="font-semibold text-university-dark-gray">Faculty: </span>
                {programme_faculty || "—"}
              </li>
              <li>
                <span className="font-semibold text-university-dark-gray">Department / school: </span>
                {programme_department || "—"}
              </li>
            </ul>
          </ProgrammeScrollSection>
        </main>
      </div>

      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </div>
  );
};

export default ProgrammeDetails;
