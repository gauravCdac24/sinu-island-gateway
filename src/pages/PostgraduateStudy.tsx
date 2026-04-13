import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import PostgraduateHero from "@/components/postgraduate/PostgraduateHero";
import StudyOptionsSection from "@/components/postgraduate/StudyOptionsSection";
import RequirementsSection from "@/components/postgraduate/RequirementsSection";
import NextStepsSection from "@/components/postgraduate/NextStepsSection";
import PostgraduateTab from "@/components/postgraduate/PostgaduateTab";
import PostgraduateStudyOptions from "@/components/postgraduate/PostgraduateStudyOptions";
import PostgraduateKeyDates from "@/components/postgraduate/PostgraduateKeyDates";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";

const PostgraduateStudy = () => {
  return (
    <StudentPageShell>
      <PostgraduateHero />
      <StudyLevelQuickActions />
      <PostgraduateTab />
      <NextStepsSection />
      <PostgraduateStudyOptions />
      <StudyOptionsSection />
      <RequirementsSection />
      <PostgraduateKeyDates />
    </StudentPageShell>
  );
};

export default PostgraduateStudy;
