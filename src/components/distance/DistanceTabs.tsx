import React from "react";
import StudyLevelSecondaryNav, {
  type StudyLevelNavItem,
} from "@/components/study-levels/StudyLevelSecondaryNav";

const tabs: StudyLevelNavItem[] = [
  { label: "Learning centres", sectionId: "find-center" },
  { label: "Admission & entry", path: "/admission-requirements" },
  { label: "Key dates", sectionId: "key-dates" },
  { label: "Scholarships", path: "/scholarships" },
  { label: "Events", path: "/campus-events" },
];

const DistanceTab: React.FC = () => {
  return (
    <StudyLevelSecondaryNav
      ariaLabel="Distance and flexible learning sections"
      tabs={tabs}
    />
  );
};

export default DistanceTab;
