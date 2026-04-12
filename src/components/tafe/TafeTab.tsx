import React from "react";
import StudyLevelSecondaryNav, {
  type StudyLevelNavItem,
} from "@/components/study-levels/StudyLevelSecondaryNav";

const tabs: StudyLevelNavItem[] = [
  { label: "Programmes", sectionId: "tafe-courses" },
  { label: "Admission & entry", path: "/admission-requirements" },
  { label: "Key dates", sectionId: "key-dates" },
  { label: "Scholarships", path: "/scholarships" },
  { label: "Events", path: "/campus-events" },
];

const TafeTab: React.FC = () => {
  return (
    <StudyLevelSecondaryNav ariaLabel="TAFE and TVET sections" tabs={tabs} />
  );
};

export default TafeTab;
