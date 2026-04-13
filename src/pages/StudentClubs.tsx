import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import StudentClubsHero from "@/components/student-clubs/StudentClubsHero";
import ClubsOverview from "@/components/student-clubs/ClubsOverview";
import FindClubsSection from "@/components/student-clubs/FindClubsSection";
import ClubCategoriesSection from "@/components/student-clubs/ClubCategoriesSection";
import ManageClubSection from "@/components/student-clubs/ManageClubSection";
import StartClubSection from "@/components/student-clubs/StartClubSection";
import BenefitsSection from "@/components/student-clubs/BenefitsSection";
import ContactSection from "@/components/student-clubs/ContactSection";

const StudentClubs: React.FC = () => {
  return (
    <StudentPageShell className="flex min-h-screen flex-col bg-[#edf4ff]">
      <StudentClubsHero />
      <StudyLevelQuickActions />
      <ClubsOverview />
      <FindClubsSection />
      <ClubCategoriesSection />
      <BenefitsSection />
      <ManageClubSection />
      <StartClubSection />
      <ContactSection />
    </StudentPageShell>
  );
};

export default StudentClubs;
