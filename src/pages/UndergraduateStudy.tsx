import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UndergraduateHero from "@/components/undergraduate/UndergraduateHero";
import StudyOptionsSection from "@/components/undergraduate/StudyOptionsSection";
import RequirementsSection from "@/components/undergraduate/RequirementsSection";
import NextStepsSection from "@/components/undergraduate/NextStepsSection";
import BackToTop from "@/components/common/BackToTop";
import UndergraduateStudyOptions from "@/components/undergraduate/UndergraduateStudyOptions";
import UndergraduateTab from "@/components/undergraduate/UndergaduateTab";
import KeyDatesSection from "@/components/undergraduate/UndergraduateKeyDates";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import SkipToMainLink from "@/components/study-levels/SkipToMainLink";

const UndergraduateStudy = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SkipToMainLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-grow outline-none">
        <UndergraduateHero />
        <StudyLevelQuickActions />
        <UndergraduateTab />
        <NextStepsSection />
        <UndergraduateStudyOptions />
        <StudyOptionsSection />
        <RequirementsSection />
        <KeyDatesSection />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default UndergraduateStudy;
