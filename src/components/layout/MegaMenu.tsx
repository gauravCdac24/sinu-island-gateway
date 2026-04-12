import React, { useState, useRef, useEffect } from "react";

interface LinkItem {
  title: string;
  url: string;
}

interface ImageItem {
  src: string;
  alt: string;
}

interface MegaMenuProps {
  id: string;
  title: string;
  links: LinkItem[];
  image?: ImageItem;
  isScrolled?: boolean;
  /** Anchor dropdown to the right so the panel stays in the viewport (e.g. last nav item). */
  alignDropdownEnd?: boolean;
}

const MegaMenu: React.FC<MegaMenuProps> = ({
  id,
  title,
  links,
  image,
  isScrolled = false,
  alignDropdownEnd = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const buttonClasses = `
    px-2 py-2 flex items-center justify-between w-full md:w-auto rounded-lg
    font-sans font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-university-gold focus-visible:ring-offset-2
    ${
      isScrolled
        ? "px-3 py-2.5 text-sm text-white hover:bg-white/10 hover:text-university-gold md:px-3.5 md:py-3 md:text-base lg:px-4"
        : "text-sm sm:text-base md:text-lg md:py-3 px-3 py-2.5 text-white hover:bg-white/10 hover:text-university-gold"
    }
  `;

  return (
    <div
      ref={menuRef}
      className="relative w-full md:w-auto"
      onMouseEnter={() => window.innerWidth >= 768 && setIsOpen(true)}
      onMouseLeave={() => window.innerWidth >= 768 && setIsOpen(false)}
    >
      {/* Menu Button */}
      <button
        className={buttonClasses}
        onClick={() => window.innerWidth < 768 && setIsOpen(!isOpen)}
        aria-controls={id}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        {/* Mobile arrow indicator */}
        <span className="md:hidden ml-2">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Desktop Dropdown */}
      <div
        id={id}
        className={`
          absolute top-full z-[110] hidden md:block bg-white border-t-2 border-university-gold shadow-xl
          transform transition-all duration-300 ease-in-out
          ${alignDropdownEnd ? "right-0 left-auto origin-top-right" : "left-0 origin-top"}
          ${isOpen ? "opacity-100 scale-y-100" : "pointer-events-none opacity-0 scale-y-0"}
        `}
      >
        <div className="flex w-max max-w-[min(100vw-1.5rem,28rem)] flex-col gap-6 p-4 md:flex-row md:px-6 md:py-4">
          <ul className="flex-1 space-y-4">
            {links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  className="block font-sans text-base font-semibold text-university-dark-gray/80 transition-colors hover:text-university-blue"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Collapsible List */}
      {isOpen && (
        <div className="md:hidden border-l-2 border-university-light-blue bg-university-light-gray/40 py-4 pl-4 pr-3">
          <ul className="space-y-3">
            {links.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  className="block font-sans text-sm font-medium text-university-dark-gray/90 transition-colors hover:text-university-blue"
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MegaMenu;
