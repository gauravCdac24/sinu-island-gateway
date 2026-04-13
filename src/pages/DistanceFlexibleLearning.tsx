import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import DistanceHero from "@/components/distance/DistanceHero";
import LearningCentersSection from "@/components/distance/LearningCentersSection";
import StudyOptionsSection from "@/components/distance/StudyOptionsSection";
import EnrollmentSection from "@/components/distance/EnrollmentSection";
import DistanceSearch from "@/components/distance/DistanceSearch";
import DistanceTab from "@/components/distance/DistanceTabs";
import DistanceKeyDates from "@/components/distance/DistanceKeyDates";
import DFLProgramStructure from "@/components/distance/DFLProgramStructure";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";

const DistanceFlexibleLearning = () => {
  return (
    <StudentPageShell>
      <DistanceHero />
      <StudyLevelQuickActions variant="dfl" />
      <DistanceTab />
      <DistanceSearch />
      <EnrollmentSection />
      <StudyOptionsSection />
      <DFLProgramStructure />
      <LearningCentersSection />
      <DistanceKeyDates />
    </StudentPageShell>
  );
};

export default DistanceFlexibleLearning;
