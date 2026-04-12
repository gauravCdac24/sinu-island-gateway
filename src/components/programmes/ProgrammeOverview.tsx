import { useLocation } from "react-router-dom";

/**
 * Body copy only — section chrome (card, title, anchor) lives in ProgrammeDetails.
 */
const ProgrammeOverview = () => {
  const { state } = useLocation();
  const { programme_name, programme_description } = state || {};

  return (
    <div className="space-y-4 text-gray-700 leading-relaxed">
      {programme_name && (
        <p className="text-lg font-semibold text-university-dark-gray">{programme_name}</p>
      )}
      {programme_description ? (
        <p>{programme_description}</p>
      ) : (
        <p className="text-gray-500 italic">Full description will appear here when available.</p>
      )}
      <p className="text-sm text-gray-600 border-l-4 border-university-gold pl-4 py-1">
        SINU programmes blend theory with practical skills so you graduate ready for work, further
        study, and leadership in the Pacific region.
      </p>
    </div>
  );
};

export default ProgrammeOverview;
