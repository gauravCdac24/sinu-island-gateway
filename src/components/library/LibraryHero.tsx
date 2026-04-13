import React from "react";
import { StudentStudyHero } from "@/components/student-ui";

const LibraryHero = () => {
  return (
    <StudentStudyHero
      eyebrow="Library & learning"
      title="Read, research, and succeed at SINU"
      description="Access print and digital collections, quiet study zones, group rooms, and librarian support aligned with your assignments—from first year through honours."
      imageSrc="https://images.unsplash.com/photo-1521587760476-6c12a4b04042?w=1920&q=80&auto=format&fit=crop"
      imageAlt="Students studying in a bright university library"
      titleId="library-hero-title"
      actions={[
        { label: "Course finder", to: "/course-finder", variant: "primary" },
        { label: "Academic support", to: "/student-academic-support", variant: "outline" },
        { label: "Apply to SINU", to: "/apply", variant: "ghost" },
      ]}
    />
  );
};

export default LibraryHero;
