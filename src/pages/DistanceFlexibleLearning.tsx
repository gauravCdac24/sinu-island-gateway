import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DistanceHero from "@/components/distance/DistanceHero";
import LearningCentersSection from "@/components/distance/LearningCentersSection";
import StudyOptionsSection from "@/components/distance/StudyOptionsSection";
import EnrollmentSection from "@/components/distance/EnrollmentSection";
import BackToTop from "@/components/common/BackToTop";
import DistanceSearch from "@/components/distance/DistanceSearch";
import DistanceTab from "@/components/distance/DistanceTabs";
import DistanceKeyDates from "@/components/distance/DistanceKeyDates";
import DFLProgramStructure from "@/components/distance/DFLProgramStructure";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import SkipToMainLink from "@/components/study-levels/SkipToMainLink";

const DistanceFlexibleLearning = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SkipToMainLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-grow outline-none">
        <DistanceHero />
        <StudyLevelQuickActions variant="dfl" />
        <DistanceTab />
        <DistanceSearch />
        <EnrollmentSection />
        <StudyOptionsSection />
        <DFLProgramStructure />
        <LearningCentersSection />
        <DistanceKeyDates />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default DistanceFlexibleLearning;
