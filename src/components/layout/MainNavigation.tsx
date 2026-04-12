import React from 'react';
import MegaMenu from './MegaMenu';
import { megaMenuData } from '@/data/megaMenuData';
import { cn } from '@/lib/utils';

interface MainNavigationProps {
  isScrolled?: boolean;
  isMobile?: boolean;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ isScrolled = false, isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 relative">
        {Object.entries(megaMenuData).map(([key, menuData], index) => (
          <div key={key} className="relative">
            <MegaMenu
              id={`mega-menu-${index}`}
              title={menuData.title || key}
              links={menuData.links || []}
              image={menuData.image}
              isScrolled={isScrolled}
            />
          </div>
        ))}
      </div>
    );
  }

  const entries = Object.entries(megaMenuData);
  const lastIndex = entries.length - 1;

  // Desktop layout
  return (
    <nav
      className={cn(
        'flex justify-center',
        isScrolled
          ? 'min-w-0 flex-nowrap justify-center gap-0.5 overflow-visible md:gap-1 lg:gap-2'
          : 'flex-wrap gap-1 md:gap-2 lg:gap-3'
      )}
    >
      {entries.map(([key, menuData], index) => (
        <MegaMenu
          key={key}
          id={`mega-menu-${index}`}
          title={menuData.title || key}
          links={menuData.links || []}
          image={menuData.image}
          isScrolled={isScrolled}
          alignDropdownEnd={index === lastIndex}
        />
      ))}
    </nav>
  );
};

export default MainNavigation;
