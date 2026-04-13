import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import TafeHero from "@/components/tafe/TafeHero";
import CourseAreasSection from "@/components/tafe/CourseAreasSection";
import PathwaysSection from "@/components/tafe/PathwaysSection";
import EnrollmentSection from "@/components/tafe/EnrollmentSection";
import TafeTab from "@/components/tafe/TafeTab";
import TafeKeyDates from "@/components/tafe/TafeKeyDates";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";

const SinuTafeVvet = () => {
  return (
    <StudentPageShell>
      <TafeHero />
      <StudyLevelQuickActions />
      <TafeTab />
      <EnrollmentSection />
      <CourseAreasSection />
      <PathwaysSection />
      <TafeKeyDates />
    </StudentPageShell>
  );
};

export default SinuTafeVvet;
