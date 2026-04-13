import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import LibraryHero from "@/components/library/LibraryHero";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import QuickLinksSection from "@/components/library/QuickLinksSection";
import ServicesSection from "@/components/library/ServicesSection";
import ResourcesSection from "@/components/library/ResourcesSection";
import StudySpacesSection from "@/components/library/StudySpacesSection";
import SupportSection from "@/components/library/SupportSection";

const LibraryServices = () => {
  return (
    <StudentPageShell>
      <LibraryHero />
      <StudyLevelQuickActions />
      <QuickLinksSection />
      <ServicesSection />
      <ResourcesSection />
      <StudySpacesSection />
      <SupportSection />
    </StudentPageShell>
  );
};

export default LibraryServices;
