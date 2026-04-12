import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PostgraduateHero from "@/components/postgraduate/PostgraduateHero";
import StudyOptionsSection from "@/components/postgraduate/StudyOptionsSection";
import RequirementsSection from "@/components/postgraduate/RequirementsSection";
import NextStepsSection from "@/components/postgraduate/NextStepsSection";
import BackToTop from "@/components/common/BackToTop";
import PostgraduateTab from "@/components/postgraduate/PostgaduateTab";
import PostgraduateStudyOptions from "@/components/postgraduate/PostgraduateStudyOptions";
import PostgraduateKeyDates from "@/components/postgraduate/PostgraduateKeyDates";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import SkipToMainLink from "@/components/study-levels/SkipToMainLink";

const PostgraduateStudy = () => {
  return (
    <div className="min-h-screen bg-white">
      <SkipToMainLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <PostgraduateHero />
        <StudyLevelQuickActions />
        <PostgraduateTab />
        <NextStepsSection />
        <PostgraduateStudyOptions />
        <StudyOptionsSection />
        <RequirementsSection />
        <PostgraduateKeyDates />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default PostgraduateStudy;
