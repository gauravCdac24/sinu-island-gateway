import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import UndergraduateHero from "@/components/undergraduate/UndergraduateHero";
import StudyOptionsSection from "@/components/undergraduate/StudyOptionsSection";
import RequirementsSection from "@/components/undergraduate/RequirementsSection";
import NextStepsSection from "@/components/undergraduate/NextStepsSection";
import UndergraduateStudyOptions from "@/components/undergraduate/UndergraduateStudyOptions";
import UndergraduateTab from "@/components/undergraduate/UndergaduateTab";
import KeyDatesSection from "@/components/undergraduate/UndergraduateKeyDates";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";

const UndergraduateStudy = () => {
  return (
    <StudentPageShell>
      <UndergraduateHero />
      <StudyLevelQuickActions />
      <UndergraduateTab />
      <NextStepsSection />
      <UndergraduateStudyOptions />
      <StudyOptionsSection />
      <RequirementsSection />
      <KeyDatesSection />
    </StudentPageShell>
  );
};

export default UndergraduateStudy;
