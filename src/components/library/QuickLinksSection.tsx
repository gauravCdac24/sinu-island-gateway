import React from "react";
import { StudentImageCardSection } from "@/components/student-ui";

const QuickLinksSection = () => {
  return (
    <StudentImageCardSection
      eyebrow="Popular services"
      title="What you can do at the library"
      subtitle="These services are designed around how students actually study: solo focus time, group projects, and evidence-based research."
      columns={3}
      cards={[
        {
          title: "Search the catalogue",
          description:
            "Find books, e-books, and course readings. Use filters by campus location and availability so you know what you can borrow today.",
          imageSrc:
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80&auto=format&fit=crop",
          imageAlt: "Books on library shelves",
          href: "/course-finder",
          linkLabel: "Explore programmes",
        },
        {
          title: "Databases & e-resources",
          description:
            "Access peer-reviewed journals, subject databases, and citation tools. Ideal for essays, literature reviews, and final-year projects.",
          imageSrc:
            "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80&auto=format&fit=crop",
          imageAlt: "Laptop research",
          href: "/admission-requirements",
          linkLabel: "Entry & English requirements",
        },
        {
          title: "Study spaces & PCs",
          description:
            "Use silent reading areas, shared tables for group work, and computer labs with printing. Arrive early during exam weeks for the best spots.",
          imageSrc:
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80&auto=format&fit=crop",
          imageAlt: "Students collaborating at a table",
          href: "/student-academic-support",
          linkLabel: "Learning support",
        },
        {
          title: "Research skills help",
          description:
            "Librarians can help you refine keywords, evaluate sources, and use referencing styles correctly—skills that improve marks across every faculty.",
          imageSrc:
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80&auto=format&fit=crop",
          imageAlt: "Taking notes during study",
          href: "/policies-procedures",
          linkLabel: "Policies & procedures",
        },
        {
          title: "Interlibrary requests",
          description:
            "If we do not hold an item, we may be able to obtain it from partner libraries. Ask early so material arrives before your deadline.",
          imageSrc:
            "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80&auto=format&fit=crop",
          imageAlt: "Library interior with reading desks",
          href: "/apply",
          linkLabel: "Become a student",
        },
        {
          title: "After-hours online access",
          description:
            "Many resources are available 24/7 with your student login—so you can keep working when the building is closed.",
          imageSrc:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80&auto=format&fit=crop",
          imageAlt: "Student using laptop in evening",
          href: "/student-login",
          linkLabel: "Student portal",
        },
      ]}
    />
  );
};

export default QuickLinksSection;
