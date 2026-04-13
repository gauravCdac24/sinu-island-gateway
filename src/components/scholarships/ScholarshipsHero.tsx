import React from "react";
import { StudentStudyHero } from "@/components/student-ui";

const ScholarshipsHero = () => {
  return (
    <StudentStudyHero
      eyebrow="Funding your studies"
      title="Scholarships & financial support"
      description="Merit awards, equity-based assistance, and partner-funded opportunities can reduce cost pressure so you can focus on results. Check eligibility early—many schemes close before semester starts."
      imageSrc="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=80&auto=format&fit=crop"
      imageAlt="Graduation caps and celebration"
      titleId="scholarships-hero-title"
      actions={[
        { label: "Apply to SINU", to: "/apply", variant: "primary" },
        { label: "Entry requirements", to: "/admission-requirements", variant: "outline" },
        { label: "Course finder", to: "/course-finder", variant: "ghost" },
      ]}
    />
  );
};

export default ScholarshipsHero;
