import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { HealthWellnessHero } from "@/components/health-wellness/HealthWellnessHero";
import { HealthOverview } from "@/components/health-wellness/HealthOverview";
import { MedicalServices } from "@/components/health-wellness/MedicalServices";
import { WellnessPrograms } from "@/components/health-wellness/WellnessPrograms";
import { CounselingSupport } from "@/components/health-wellness/CounselingSupport";
import { AccessibilitySupport } from "@/components/health-wellness/AccessibilitySupport";
import { FitnessRecreation } from "@/components/health-wellness/FitnessRecreation";
import { EmergencyServices } from "@/components/health-wellness/EmergencyServices";
import { ContactHealth } from "@/components/health-wellness/ContactHealth";

const HealthWellness = () => {
  return (
    <StudentPageShell>
      <ErrorBoundary>
        <HealthWellnessHero />
      </ErrorBoundary>
      <StudyLevelQuickActions />
      <ErrorBoundary>
        <HealthOverview />
      </ErrorBoundary>
      <ErrorBoundary>
        <MedicalServices />
      </ErrorBoundary>
      <ErrorBoundary>
        <WellnessPrograms />
      </ErrorBoundary>
      <ErrorBoundary>
        <CounselingSupport />
      </ErrorBoundary>
      <ErrorBoundary>
        <AccessibilitySupport />
      </ErrorBoundary>
      <ErrorBoundary>
        <FitnessRecreation />
      </ErrorBoundary>
      <ErrorBoundary>
        <EmergencyServices />
      </ErrorBoundary>
      <ErrorBoundary>
        <ContactHealth />
      </ErrorBoundary>
    </StudentPageShell>
  );
};

export default HealthWellness;
