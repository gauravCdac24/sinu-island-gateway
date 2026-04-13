import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import AccommodationHero from "@/components/accommodation/AccommodationHero";
import AccommodationOverviewSection from "@/components/accommodation/AccommodationOverviewSection";
import AccommodationTypesSection from "@/components/accommodation/AccommodationTypesSection";
import OnCampusSection from "@/components/accommodation/OnCampusSection";
import OffCampusSection from "@/components/accommodation/OffCampusSection";
import ApplicationProcessSection from "@/components/accommodation/ApplicationProcessSection";
import CostsFeesSection from "@/components/accommodation/CostsFeesSection";
import SupportServicesSection from "@/components/accommodation/SupportServicesSection";
import FacilitiesSection from "@/components/accommodation/FacilitiesSection";

const StudentAccommodation = () => {
  return (
    <StudentPageShell>
      <AccommodationHero />
      <StudyLevelQuickActions />
      <AccommodationOverviewSection />
      <AccommodationTypesSection />
      <OnCampusSection />
      <OffCampusSection />
      <ApplicationProcessSection />
      <CostsFeesSection />
      <FacilitiesSection />
      <SupportServicesSection />
    </StudentPageShell>
  );
};

export default StudentAccommodation;
