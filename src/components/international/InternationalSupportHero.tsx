import React from "react";
import { StudentStudyHero } from "@/components/student-ui";

const InternationalSupportHero = () => {
  return (
    <StudentStudyHero
      eyebrow="International students"
      title="Support for your journey to SINU"
      description="From pre-arrival questions to settling in Honiara, we connect you with academic advice, wellbeing resources, and practical guidance on visas and compliance—so you can concentrate on learning."
      imageSrc="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1920&q=80&auto=format&fit=crop"
      imageAlt="Diverse students on campus"
      titleId="intl-support-hero-title"
      actions={[
        { label: "Admission & visas", to: "/visa-information", variant: "primary" },
        { label: "Entry requirements", to: "/admission-requirements", variant: "outline" },
        { label: "Visa information", to: "/visa-information", variant: "ghost" },
      ]}
    />
  );
};

export default InternationalSupportHero;
