import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TafeHero from "@/components/tafe/TafeHero";
import CourseAreasSection from "@/components/tafe/CourseAreasSection";
import PathwaysSection from "@/components/tafe/PathwaysSection";
import EnrollmentSection from "@/components/tafe/EnrollmentSection";
import BackToTop from "@/components/common/BackToTop";
import TafeTab from "@/components/tafe/TafeTab";
import TafeKeyDates from "@/components/tafe/TafeKeyDates";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import SkipToMainLink from "@/components/study-levels/SkipToMainLink";

const SinuTafeVvet = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SkipToMainLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-grow outline-none">
        <TafeHero />
        <StudyLevelQuickActions />
        <TafeTab />
        <EnrollmentSection />
        <CourseAreasSection />
        <PathwaysSection />
        <TafeKeyDates />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default SinuTafeVvet;
