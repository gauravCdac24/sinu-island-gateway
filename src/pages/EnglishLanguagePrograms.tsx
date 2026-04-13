import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import EnglishHero from "@/components/english/EnglishHero";
import ProgramOverview from "@/components/english/ProgramOverview";
import CourseOfferings from "@/components/english/CourseOfferings";
import EntryRequirements from "@/components/english/EntryRequirements";
import StudyPathways from "@/components/english/StudyPathways";
import ApplicationProcess from "@/components/english/ApplicationProcess";
import SupportServices from "@/components/english/SupportServices";
import CampusLife from "@/components/english/CampusLife";

const EnglishLanguagePrograms = () => {
  return (
    <StudentPageShell>
      <EnglishHero />
      <StudyLevelQuickActions />
      <ProgramOverview />
      <CourseOfferings />
      <EntryRequirements />
      <StudyPathways />
      <ApplicationProcess />
      <SupportServices />
      <CampusLife />
    </StudentPageShell>
  );
};

export default EnglishLanguagePrograms;
