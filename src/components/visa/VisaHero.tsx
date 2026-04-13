import React from "react";
import { StudentStudyHero } from "@/components/student-ui";

const VisaHero = () => {
  return (
    <StudentStudyHero
      eyebrow="Visas & compliance"
      title="Plan your student visa with confidence"
      description="Understand categories, documents, timeframes, and what to do before you travel. Rules change—always confirm with official immigration advice and keep copies of every submission."
      imageSrc="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=1920&q=80&auto=format&fit=crop"
      imageAlt="Passport and travel planning"
      titleId="visa-hero-title"
      actions={[
        { label: "International support", to: "/international-student-support", variant: "primary" },
        { label: "Admission requirements", to: "/admission-requirements", variant: "outline" },
        { label: "Apply to SINU", to: "/apply", variant: "ghost" },
      ]}
    />
  );
};

export default VisaHero;
