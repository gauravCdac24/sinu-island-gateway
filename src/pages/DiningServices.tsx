import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import DiningServicesHero from "@/components/dining/DiningServicesHero";
import DiningOverview from "@/components/dining/DiningOverview";
import MealPlansSection from "@/components/dining/MealPlansSection";
import DiningVenuesSection from "@/components/dining/DiningVenuesSection";
import MenuOfferings from "@/components/dining/MenuOfferings";
import SpecialDietarySection from "@/components/dining/SpecialDietarySection";
import OpeningHoursSection from "@/components/dining/OpeningHoursSection";
import ContactDining from "@/components/dining/ContactDining";

const DiningServices = () => {
  return (
    <StudentPageShell>
      <DiningServicesHero />
      <StudyLevelQuickActions />
      <DiningOverview />
      <MealPlansSection />
      <DiningVenuesSection />
      <MenuOfferings />
      <SpecialDietarySection />
      <OpeningHoursSection />
      <ContactDining />
    </StudentPageShell>
  );
};

export default DiningServices;
