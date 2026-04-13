import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import SportsRecreationHero from "@/components/sports-recreation/SportsRecreationHero";
import SportsOverview from "@/components/sports-recreation/SportsOverview";
import FacilitiesSection from "@/components/sports-recreation/FacilitiesSection";
import ProgramsSection from "@/components/sports-recreation/ProgramsSection";
import SocialSportsSection from "@/components/sports-recreation/SocialSportsSection";
import FitnessWellnessSection from "@/components/sports-recreation/FitnessWellnessSection";
import MembershipSection from "@/components/sports-recreation/MembershipSection";
import ContactSports from "@/components/sports-recreation/ContactSports";

const SportsRecreation = () => {
  return (
    <StudentPageShell className="flex min-h-screen flex-col bg-background">
      <SportsRecreationHero />
      <StudyLevelQuickActions />
      <div style={{ backgroundColor: "#edf4ff" }}>
        <SportsOverview />
        <FacilitiesSection />
        <ProgramsSection />
        <SocialSportsSection />
        <FitnessWellnessSection />
        <MembershipSection />
        <ContactSports />
      </div>
    </StudentPageShell>
  );
};

export default SportsRecreation;
