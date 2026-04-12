import React, { useState, useEffect } from 'react';
import DesktopHeader from './DesktopHeader';
import ScrolledDesktopHeader from './ScrolledDesktopHeader';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Only enable scrolled header on desktop (>=1024px)
      if (window.innerWidth >= 1024) {
        setIsScrolled(window.scrollY > 30); // adjust trigger
      } else {
        setIsScrolled(false); // disable on smaller screens
      }
    };

    // Initial check in case page is already scrolled
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll); // handle resize

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Over hero: readable bar aligned with max-w-7xl content */}
      <header className="absolute left-0 top-0 z-[80] w-full">
        <DesktopHeader isScrolled={false} />
      </header>

      {/* Compact bar after scroll (desktop) — stays above page content */}
      <div
        className={`fixed left-0 top-0 z-[100] w-full transition-transform duration-300 ease-in-out ${
          isScrolled ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <ScrolledDesktopHeader />
      </div>
    </>
  );
};

export default Header;
