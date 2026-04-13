import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import InternationalSupportHero from "@/components/international/InternationalSupportHero";
import SupportOverview from "@/components/international/SupportOverview";
import AcademicSupport from "@/components/international/AcademicSupport";
import PersonalSupport from "@/components/international/PersonalSupport";
import LegalImmigration from "@/components/international/LegalImmigration";
import CommunityConnection from "@/components/international/CommunityConnection";
import EmergencySupport from "@/components/international/EmergencySupport";
import ContactInformation from "@/components/international/ContactInformation";

const InternationalStudentSupport = () => {
  return (
    <StudentPageShell>
      <InternationalSupportHero />
      <StudyLevelQuickActions />
      <SupportOverview />
      <AcademicSupport />
      <PersonalSupport />
      <LegalImmigration />
      <CommunityConnection />
      <EmergencySupport />
      <ContactInformation />
    </StudentPageShell>
  );
};

export default InternationalStudentSupport;
