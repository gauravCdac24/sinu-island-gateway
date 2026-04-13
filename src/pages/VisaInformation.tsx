import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import VisaHero from "@/components/visa/VisaHero";
import VisaOverviewSection from "@/components/visa/VisaOverviewSection";
import VisaTypesSection from "@/components/visa/VisaTypesSection";
import ApplicationProcessSection from "@/components/visa/ApplicationProcessSection";
import RequirementsSection from "@/components/visa/RequirementsSection";
import FinancialRequirementsSection from "@/components/visa/FinancialRequirementsSection";
import HealthInsuranceSection from "@/components/visa/HealthInsuranceSection";
import WorkRightsSection from "@/components/visa/WorkRightsSection";
import RenewalExtensionSection from "@/components/visa/RenewalExtensionSection";
import SupportResourcesSection from "@/components/visa/SupportResourcesSection";

const VisaInformation = () => {
  return (
    <StudentPageShell>
      <VisaHero />
      <StudyLevelQuickActions />
      <VisaOverviewSection />
      <VisaTypesSection />
      <ApplicationProcessSection />
      <RequirementsSection />
      <FinancialRequirementsSection />
      <HealthInsuranceSection />
      <WorkRightsSection />
      <RenewalExtensionSection />
      <SupportResourcesSection />
    </StudentPageShell>
  );
};

export default VisaInformation;
