import React from 'react';
import { useNavigate } from 'react-router-dom';

const tabs = [
  {label: 'Home', sectionId: 'policies-home'},
  { label: 'Browse Policies', sectionId: 'policies-search' },
  { label: 'Bulletins', sectionId: 'key-dates' },
  { label: 'News', path: '/news' },
];

const PoliciesTab: React.FC = () => {
  const navigate = useNavigate();

  const handleTabClick = (tab: typeof tabs[number]) => {
    if (tab.path) {
      navigate(tab.path);
    } else if (tab.sectionId) {
      const section = document.getElementById(tab.sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div
          className="
          flex gap-6 sm:gap-10 lg:gap-16 border-b border-gray-200 pb-1
          overflow-x-auto scroll-smooth scrollbar-hide
          md:overflow-visible md:justify-center md:flex-wrap
        "
        >
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => handleTabClick(tab)}
              className="whitespace-nowrap px-2 py-2 text-sm md:text-base text-gray-500 hover:text-university-dark-gray border-b-2 border-transparent hover:border-university-blue transition font-semibold"
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoliciesTab;
