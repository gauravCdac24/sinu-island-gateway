import { useLocation } from "react-router-dom";
import React from "react";
import { GraduationCap, School } from "lucide-react";

/**
 * Normal document flow (not sticky) so the global header keeps pointer events and hover.
 * High z-index sticky heroes were stacking above the nav and blocking clicks.
 */
const ProgrammeHero = () => {
  const { state } = useLocation();
  const { programme_name, programme_faculty } = state || {};

  return (
    <div className="relative z-0 w-full overflow-hidden bg-gradient-to-br from-university-dark-gray via-[#074a6b] to-university-blue text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.35'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-university-gold mb-4">
              <GraduationCap className="h-3.5 w-3.5" aria-hidden />
              Your programme
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-balance">
              {programme_name || "Programme"}
            </h1>
            {programme_faculty && (
              <div className="mt-4 flex items-center gap-2 text-white/90 text-base md:text-lg">
                <School className="h-5 w-5 shrink-0 text-university-light-blue" aria-hidden />
                <span>{programme_faculty}</span>
              </div>
            )}
          </div>
          <div className="hidden md:block h-1 w-24 rounded-full bg-university-gold shrink-0" aria-hidden />
        </div>
      </div>
      <div className="h-1 bg-university-gold" aria-hidden />
    </div>
  );
};

export default ProgrammeHero;
