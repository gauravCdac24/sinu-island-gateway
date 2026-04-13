import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import ResearchOverview from "@/components/research-centers/ResearchOverview";

const ResearchImpact = () => {
  return (
    <StudentPageShell className="flex min-h-screen flex-col bg-university-light-gray">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-university-blue">
            Research at SINU
          </p>
          <h1 className="mt-2 text-3xl font-bold text-university-dark-gray sm:text-4xl">
            Research impact
          </h1>
          <p className="mt-3 max-w-3xl text-base text-gray-600">
            Explore projects by impact area and faculty—covering policy, community engagement, and
            discovery across Solomon Islands and the Pacific.
          </p>
        </div>
      </header>
      <StudyLevelQuickActions />
      <ResearchOverview />
    </StudentPageShell>
  );
};

export default ResearchImpact;
