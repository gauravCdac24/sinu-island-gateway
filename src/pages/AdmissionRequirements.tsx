import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import AdmissionHero from "@/components/admission/AdmissionHero";
import RequirementsOverviewSection from "@/components/admission/RequirementsOverviewSection";
import UndergraduateRequirementsSection from "@/components/admission/UndergraduateRequirementsSection";
import PostgraduateRequirementsSection from "@/components/admission/PostgraduateRequirementsSection";
import EnglishRequirementsSection from "@/components/admission/EnglishRequirementsSection";
import DocumentsSection from "@/components/admission/DocumentsSection";
import ApplicationProcessSection from "@/components/admission/ApplicationProcessSection";
import InternationalTab from "@/components/admission/InternationalTabs";
import InternationalStudyOptions from "@/components/study-abroad/InternationalStudyOptions";
import InternationalFeaturedPrograms from "@/components/study-abroad/InternationalFeaturedPrograms";
import InternationalStudyOptionsSection from "@/components/study-abroad/InternationalStudyOptionsSection";
import InternationalKeyDates from "@/components/study-abroad/InternationalKeyDates";
import { StudentExperience } from "@/components/study-abroad/StudentExperience";
import InternationalNewsEvents from "@/components/study-abroad/InternationalNewsEvents";

const AdmissionRequirements = () => {
  return (
    <StudentPageShell>
      <AdmissionHero />
      <StudyLevelQuickActions />
      <InternationalTab />
      <RequirementsOverviewSection />
      <UndergraduateRequirementsSection />
      <PostgraduateRequirementsSection />
      <EnglishRequirementsSection />
      <DocumentsSection />
      <ApplicationProcessSection />
      <InternationalStudyOptions />
      <InternationalFeaturedPrograms />
      <InternationalStudyOptionsSection />
      <StudentExperience />
      <InternationalKeyDates />
      <InternationalNewsEvents />
    </StudentPageShell>
  );
};

export default AdmissionRequirements;
