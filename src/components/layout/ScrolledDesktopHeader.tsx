import React, { useState } from 'react';
import HeaderLogo from './HeaderLogo';
import MainNavigation from './MainNavigation';
import { Menu, X } from 'lucide-react';

const ScrolledDesktopHeader = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative z-[100] w-full border-b-2 border-university-gold bg-university-dark-gray shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 overflow-visible px-4 py-2 sm:px-6 lg:px-8 lg:py-2.5">
        <HeaderLogo isScrolled />
        <div className="hidden min-w-0 flex-1 justify-center overflow-visible lg:flex">
          <MainNavigation isScrolled />
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-university-gold lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-white/10 bg-university-dark-gray lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <MainNavigation isScrolled isMobile />
          </div>
        </div>
      )}
    </div>
  );
};

export default ScrolledDesktopHeader;
