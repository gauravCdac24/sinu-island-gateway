import React from "react";
import { StudentPageShell } from "@/components/student-ui";
import StudyLevelQuickActions from "@/components/study-levels/StudyLevelQuickActions";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { CampusEventsHero } from "@/components/campus-events/CampusEventsHero";
import { EventsOverview } from "@/components/campus-events/EventsOverview";
import { UpcomingEvents } from "@/components/campus-events/UpcomingEvents";
import { EventCategories } from "@/components/campus-events/EventCategories";
import { FeaturedEvents } from "@/components/campus-events/FeaturedEvents";
import { EventCalendar } from "@/components/campus-events/EventCalendar";
import { StudentOrganizations } from "@/components/campus-events/StudentOrganizations";
import { EventSubmission } from "@/components/campus-events/EventSubmission";
import { ContactEvents } from "@/components/campus-events/ContactEvents";

const CampusEvents = () => {
  return (
    <StudentPageShell>
      <ErrorBoundary>
        <CampusEventsHero />
      </ErrorBoundary>
      <StudyLevelQuickActions />
      <ErrorBoundary>
        <EventsOverview />
      </ErrorBoundary>
      <ErrorBoundary>
        <UpcomingEvents />
      </ErrorBoundary>
      <ErrorBoundary>
        <EventCategories />
      </ErrorBoundary>
      <ErrorBoundary>
        <FeaturedEvents />
      </ErrorBoundary>
      <ErrorBoundary>
        <EventCalendar />
      </ErrorBoundary>
      <ErrorBoundary>
        <StudentOrganizations />
      </ErrorBoundary>
      <ErrorBoundary>
        <EventSubmission />
      </ErrorBoundary>
      <ErrorBoundary>
        <ContactEvents />
      </ErrorBoundary>
    </StudentPageShell>
  );
};

export default CampusEvents;
