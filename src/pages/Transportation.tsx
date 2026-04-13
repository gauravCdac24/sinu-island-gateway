import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import TransportationHero from "@/components/transportation/TransportationHero";
import TransportOverview from "@/components/transportation/TransportOverview";
import TransportServices from "@/components/transportation/TransportServices";
import StudentTicketInfo from "@/components/transportation/StudentTicketInfo";
import CampusTransport from "@/components/transportation/CampusTransport";
import TransportTips from "@/components/transportation/TransportTips";
import ContactTransport from "@/components/transportation/ContactTransport";

const Transportation = () => {
  return (
    <StudentPageShell className="flex min-h-screen flex-col bg-background">
      <TransportationHero />
      <StudyLevelQuickActions />
      <TransportOverview />
      <TransportServices />
      <StudentTicketInfo />
      <CampusTransport />
      <TransportTips />
      <ContactTransport />
    </StudentPageShell>
  );
};

export default Transportation;
