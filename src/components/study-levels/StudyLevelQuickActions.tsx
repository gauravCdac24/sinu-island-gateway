import React from "react";
import { Link } from "react-router-dom";
import { ClipboardPen, Search, ListChecks, GraduationCap, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "default" | "dfl";

type StudyLevelQuickActionsProps = {
  variant?: Variant;
  className?: string;
};

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * High-visibility student shortcuts: apply, find a course, entry requirements, portal.
 * DFL adds a jump to learning centres.
 */
const StudyLevelQuickActions: React.FC<StudyLevelQuickActionsProps> = ({ variant = "default", className }) => {
  const isDfl = variant === "dfl";

  return (
    <section
      aria-label="Quick links for students"
      className={cn(
        "border-b border-slate-200/80 bg-gradient-to-b from-slate-50 to-white shadow-sm",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-[#082952]/70 sm:mb-4 sm:text-left">
          Get started
        </p>
        <ul
          className={cn(
            "grid grid-cols-1 gap-2 sm:grid-cols-2",
            isDfl ? "lg:grid-cols-5" : "lg:grid-cols-4"
          )}
        >
          <li>
            <Link
              to="/apply"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border-2 border-[#ffb703] bg-[#ffb703] px-4 py-3 text-center text-sm font-semibold text-[#082952] shadow-sm transition hover:bg-[#e5a500] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#082952] sm:justify-start"
            >
              <ClipboardPen className="h-5 w-5 shrink-0" aria-hidden />
              Apply now
            </Link>
          </li>
          <li>
            <Link
              to="/course-finder"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#082952] shadow-sm transition hover:border-[#219ebc] hover:bg-[#f0f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#219ebc] sm:justify-start"
            >
              <Search className="h-5 w-5 shrink-0 text-[#219ebc]" aria-hidden />
              Course finder
            </Link>
          </li>
          <li>
            <Link
              to="/admission-requirements"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#082952] shadow-sm transition hover:border-[#219ebc] hover:bg-[#f0f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#219ebc] sm:justify-start"
            >
              <ListChecks className="h-5 w-5 shrink-0 text-[#219ebc]" aria-hidden />
              Entry requirements
            </Link>
          </li>
          <li>
            <Link
              to="/student-login"
              className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#082952] shadow-sm transition hover:border-[#219ebc] hover:bg-[#f0f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#219ebc] sm:justify-start"
            >
              <GraduationCap className="h-5 w-5 shrink-0 text-[#219ebc]" aria-hidden />
              Student portal
            </Link>
          </li>
          {isDfl ? (
            <li className="sm:col-span-2 lg:col-span-1">
              <button
                type="button"
                onClick={() => scrollToId("find-center")}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-[#082952] shadow-sm transition hover:border-[#219ebc] hover:bg-[#f0f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#219ebc] sm:justify-start"
              >
                <MapPin className="h-5 w-5 shrink-0 text-[#219ebc]" aria-hidden />
                Learning centres
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
};

export default StudyLevelQuickActions;
