import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import StudentSupportHero from "@/components/student-support/StudentSupportHero";
import SupportServicesSection from "@/components/student-support/SupportServicesSection";
import AcademicResourcesSection from "@/components/student-support/AcademicResourcesSection";
import StudentLifeSection from "@/components/student-support/StudentLifeSection";
import ContactSupportSection from "@/components/student-support/ContactSupportSection";

const StudentAcademicSupport = () => {
  return (
    <StudentPageShell>
      <StudentSupportHero />
      <StudyLevelQuickActions />
      <SupportServicesSection />
      <AcademicResourcesSection />
      <StudentLifeSection />
      <ContactSupportSection />
    </StudentPageShell>
  );
};

export default StudentAcademicSupport;
