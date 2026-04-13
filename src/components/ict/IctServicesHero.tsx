import React from "react";
import { StudentStudyHero } from "@/components/student-ui";

const IctServicesHero = () => {
  return (
    <StudentStudyHero
      eyebrow="Digital campus"
      title="ICT services built for study and teaching"
      description="Campus Wi‑Fi, computer labs, printing, and secure access to learning systems—plus help when something breaks. Use strong passwords and keep devices updated to protect your work."
      imageSrc="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&q=80&auto=format&fit=crop"
      imageAlt="Student working on laptop"
      titleId="ict-hero-title"
      actions={[
        { label: "Student portal", to: "/student-login", variant: "primary" },
        { label: "Library & online resources", to: "/library-services", variant: "outline" },
        { label: "Academic support", to: "/student-academic-support", variant: "ghost" },
      ]}
    />
  );
};

export default IctServicesHero;
