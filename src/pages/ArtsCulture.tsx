import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import ArtsCultureHero from "@/components/arts-culture/ArtsCultureHero";
import CultureOverview from "@/components/arts-culture/CultureOverview";
import VenuesGalleries from "@/components/arts-culture/VenuesGalleries";
import PerformingArts from "@/components/arts-culture/PerformingArts";
import VisualArts from "@/components/arts-culture/VisualArts";
import CulturalEvents from "@/components/arts-culture/CulturalEvents";
import StudentOpportunities from "@/components/arts-culture/StudentOpportunities";
import CommunityEngagement from "@/components/arts-culture/CommunityEngagement";
import ContactArts from "@/components/arts-culture/ContactArts";

const ArtsCulture = () => {
  return (
    <StudentPageShell className="flex min-h-screen flex-col bg-background">
      <ArtsCultureHero />
      <StudyLevelQuickActions />
      <div style={{ backgroundColor: "#edf4ff" }}>
        <CultureOverview />
        <VenuesGalleries />
        <PerformingArts />
        <VisualArts />
        <CulturalEvents />
        <StudentOpportunities />
        <CommunityEngagement />
        <ContactArts />
      </div>
    </StudentPageShell>
  );
};

export default ArtsCulture;
