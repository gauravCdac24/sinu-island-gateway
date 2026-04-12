import React from "react";
import StudyLevelSecondaryNav, {
  type StudyLevelNavItem,
} from "@/components/study-levels/StudyLevelSecondaryNav";

const tabs: StudyLevelNavItem[] = [
  { label: "Programmes", sectionId: "pg-programmes" },
  { label: "Admission & entry", path: "/admission-requirements" },
  { label: "Key dates", sectionId: "key-dates" },
  { label: "Scholarships", path: "/scholarships" },
  { label: "Events", path: "/campus-events" },
];

const PostgraduateTab: React.FC = () => {
  return (
    <StudyLevelSecondaryNav
      ariaLabel="Postgraduate study sections"
      tabs={tabs}
    />
  );
};

export default PostgraduateTab;
