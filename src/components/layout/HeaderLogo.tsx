import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderLogoProps {
  isScrolled: boolean;
  handleLogoClick?: () => void;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({ isScrolled, handleLogoClick }) => {
  return (
    <div
      className={`
        flex items-center justify-center text-center
        transition-all duration-500 ease-in-out
        ${isScrolled ? 'flex-row shrink-0' : 'flex-col pt-0'}
      `}
    >
      <Link
        to="/"
        onClick={handleLogoClick}
        className={
          isScrolled
            ? 'h-12 w-12 shrink-0 sm:h-14 sm:w-14'
            : 'h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24'
        }
      >
        <img
          src="/lovable-uploads/e89a9d15-f230-44b8-8ecb-322ac2085582.png"
          alt="SINU Logo"
          className="h-full w-full object-contain"
        />
      </Link>

      <div
        className={`
          mt-2 w-full max-w-xs sm:max-w-sm md:max-w-md
          transition-opacity duration-500 ease-in-out
          ${isScrolled ? 'hidden' : 'opacity-100'}
        `}
      >
        <div className="mx-auto px-2 sm:px-3">
          <p className="text-center text-sm font-bold leading-snug tracking-wide text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.95),0_0_1rem_rgba(0,0,0,0.5)] sm:text-base md:text-lg">
            Solomon Islands
          </p>
          <p className="mt-0.5 text-center text-sm font-bold leading-snug tracking-wide text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.95),0_0_1rem_rgba(0,0,0,0.5)] sm:text-base md:text-lg">
            National University
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeaderLogo;
