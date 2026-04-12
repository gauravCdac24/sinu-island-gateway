import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export type StudyLevelNavItem =
  | { label: string; path: string }
  | { label: string; sectionId: string };

type StudyLevelSecondaryNavProps = {
  tabs: StudyLevelNavItem[];
  ariaLabel: string;
  className?: string;
};

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Horizontal “tab” navigation: in-page anchors and internal routes with shared styling.
 */
const StudyLevelSecondaryNav: React.FC<StudyLevelSecondaryNavProps> = ({ tabs, ariaLabel, className }) => {
  const baseClass =
    "inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#219ebc] sm:text-base";

  return (
    <nav aria-label={ariaLabel} className={cn("w-full border-b border-slate-200 bg-white", className)}>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <ul
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin [scrollbar-width:thin] sm:flex-wrap sm:justify-center sm:gap-3 sm:overflow-visible sm:pb-0"
          role="list"
        >
          {tabs.map((tab) => (
            <li key={tab.label} className="shrink-0" role="none">
              {"path" in tab ? (
                <Link
                  to={tab.path}
                  className={cn(
                    baseClass,
                    "bg-slate-100 text-[#082952] hover:bg-[#e8f4f8] hover:text-[#082952]"
                  )}
                >
                  {tab.label}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => scrollToSection(tab.sectionId)}
                  className={cn(
                    baseClass,
                    "border border-transparent bg-slate-100 text-[#082952] hover:bg-[#e8f4f8]"
                  )}
                >
                  {tab.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default StudyLevelSecondaryNav;
