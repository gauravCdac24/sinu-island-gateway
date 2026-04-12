import React from "react";
import StudyLevelSecondaryNav, {
  type StudyLevelNavItem,
} from "@/components/study-levels/StudyLevelSecondaryNav";
import { cn } from "@/lib/utils";

const tabs: StudyLevelNavItem[] = [
  { label: "How we help", sectionId: "support-services" },
  { label: "Resources & tools", sectionId: "student-resources" },
  { label: "Life & wellbeing", sectionId: "life-support" },
  { label: "Contact SAS", sectionId: "contact-sas" },
];

type StudentSupportSecondaryNavProps = {
  className?: string;
};

const StudentSupportSecondaryNav: React.FC<StudentSupportSecondaryNavProps> = ({ className }) => (
  <StudyLevelSecondaryNav
    ariaLabel="Student academic support sections"
    tabs={tabs}
    className={cn(className)}
  />
);

export default StudentSupportSecondaryNav;
