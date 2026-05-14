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
            className="rounded-md p-2 text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="mt-4 w-full lg:hidden">
            <div className="w-full animate-slide-down rounded-xl bg-[#082952] shadow-2xl ring-1 ring-white/10">
              {/* Quick-access links */}
              <div className="border-b border-white/10 px-4 py-3">
                <TopNavigation isScrolled={false} forceStacked />
              </div>
              {/* Main navigation mega-menu items */}
              <div className="px-4 py-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">
                  Explore
                </p>
                <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  <MainNavigation isScrolled={isScrolled} isMobile />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopHeader;
