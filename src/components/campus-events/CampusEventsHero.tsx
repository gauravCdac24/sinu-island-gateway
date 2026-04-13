import React from "react";
import heroImage from "@/assets/campus-events-hero.jpg";
import { StudentStudyHero } from "@/components/student-ui";

export const CampusEventsHero = () => {
  return (
    <StudentStudyHero
      eyebrow="Campus life"
      title="Events that connect you to SINU"
      description="Clubs, culture, sport, and academic sessions—there is always something on. Join early in semester to meet people in your cohort and build networks that last."
      imageSrc={heroImage}
      imageAlt="Students at a campus event"
      titleId="campus-events-hero-title"
      actions={[
        { label: "Student clubs", to: "/student-clubs", variant: "primary" },
        { label: "Sports & recreation", to: "/sports-recreation", variant: "outline" },
        { label: "Apply to SINU", to: "/apply", variant: "ghost" },
      ]}
    />
  );
};
