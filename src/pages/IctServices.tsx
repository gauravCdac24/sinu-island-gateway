import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import IctServicesHero from "@/components/ict/IctServicesHero";
import ServicesOverviewSection from "@/components/ict/ServicesOverviewSection";
import StudentServicesSection from "@/components/ict/StudentServicesSection";
import StaffServicesSection from "@/components/ict/StaffServicesSection";
import SupportSection from "@/components/ict/SupportSection";
import ResourcesSection from "@/components/ict/ResourcesSection";

const IctServices = () => {
  return (
    <StudentPageShell>
      <IctServicesHero />
      <StudyLevelQuickActions />
      <ServicesOverviewSection />
      <StudentServicesSection />
      <StaffServicesSection />
      <SupportSection />
      <ResourcesSection />
    </StudentPageShell>
  );
};

export default IctServices;
