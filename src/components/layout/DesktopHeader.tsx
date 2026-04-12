import React, { useState } from 'react';
import HeaderLogo from './HeaderLogo';
import MainNavigation from './MainNavigation';
import TopNavigation from './TopNavigation';
import { Menu, X } from 'lucide-react';

interface DesktopHeaderProps {
  isScrolled?: boolean;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ isScrolled = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="w-full min-h-[80px] bg-transparent">
      <div className="container mx-auto flex flex-col px-4 py-4 sm:py-8">
        <div className="flex w-full items-center justify-between">
          <HeaderLogo isScrolled={isScrolled} />

          <div className="hidden flex-1 items-center justify-end lg:flex">
            <TopNavigation isScrolled={isScrolled} />
          </div>

          <button
            type="button"
            className="p-2 text-gray-700 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 w-full lg:hidden">
            <div className="w-full animate-slide-down rounded-lg bg-white p-4 shadow-lg">
              <div className="relative grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-4">
                <MainNavigation isScrolled={isScrolled} isMobile />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopHeader;
