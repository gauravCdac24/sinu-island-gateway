import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import ScholarshipsHero from "@/components/scholarships/ScholarshipsHero";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import ScholarshipTypesSection from "@/components/scholarships/ScholarshipTypesSection";
import ApplicationProcessSection from "@/components/scholarships/ApplicationProcessSection";
import FeaturedScholarshipsSection from "@/components/scholarships/FeaturedScholarshipsSection";
import EligibilitySection from "@/components/scholarships/EligibilitySection";
import ScholarshipSearchSection from "@/components/scholarships/ScholarshipSearchSection";

const Scholarships = () => {
  return (
    <StudentPageShell>
      <ScholarshipsHero />
      <StudyLevelQuickActions />
      <ScholarshipSearchSection />
      <ScholarshipTypesSection />
      <FeaturedScholarshipsSection />
      <EligibilitySection />
      <ApplicationProcessSection />
    </StudentPageShell>
  );
};

export default Scholarships;
