import React from "react";
import StudyLevelSecondaryNav, {
  type StudyLevelNavItem,
} from "@/components/study-levels/StudyLevelSecondaryNav";

const tabs: StudyLevelNavItem[] = [
  { label: "Programmes", sectionId: "ug-programmes" },
  { label: "Admission & entry", path: "/admission-requirements" },
  { label: "Key dates", sectionId: "key-dates" },
  { label: "Scholarships", path: "/scholarships" },
  { label: "Events", path: "/campus-events" },
];

const UndergraduateTab: React.FC = () => {
  return (
    <StudyLevelSecondaryNav
      ariaLabel="Undergraduate study sections"
      tabs={tabs}
    />
  );
};

export default UndergraduateTab;
