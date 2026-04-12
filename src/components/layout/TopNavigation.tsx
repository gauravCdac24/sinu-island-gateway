import React from 'react';
import { Search, Book, User, Users, Library, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import MainNavigation from './MainNavigation';
import { cn } from '@/lib/utils';

interface TopNavigationProps {
  isScrolled?: boolean;
  forceStacked?: boolean;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ isScrolled = false, forceStacked = false }) => {
  const navItems = [
    {
      href: 'https://sinu.myhubintranet.com/Intranet-Login',
      icon: User,
      label: 'Staff Portal',
      external: true,
    },
    {
      to: '/student-login',
      icon: Users,
      label: 'Student Portal',
    },
    {
      href: 'https://elearn.sinu.edu.sb/login/index.php',
      icon: GraduationCap,
      label: 'Moodle',
      external: true,
    },
    { to: '/library-services', icon: Library, label: 'Library' },
    { to: '/apply', icon: Book, label: 'Apply Now' },
    { to: '/course-finder', icon: Search, label: 'Search' },
  ];

  if (forceStacked) {
    return (
      <div className="flex w-full flex-col gap-1">
        {navItems.map(({ to, href, icon: Icon, label, external }) => (
          <Button
            key={label}
            asChild
            variant="ghost"
            size="sm"
            className="h-10 w-full justify-start font-medium text-university-dark-gray hover:bg-university-light-blue/30"
          >
            {external ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </a>
            ) : (
              <Link to={to!} className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </Link>
            )}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <div
        className={cn(
          'flex w-full items-center justify-end transition-all duration-500',
          isScrolled ? 'hidden lg:flex' : 'flex'
        )}
      >
        <div className="flex flex-wrap items-center justify-end gap-x-0.5">
          {navItems.map(({ to, href, icon: Icon, label, external }) => (
            <Button
              key={label}
              asChild
              variant="ghost"
              size="sm"
              className="flex items-center font-sans text-lg font-medium text-white transition-colors duration-300 hover:bg-[#22a2bf]/70 hover:text-[#222]"
            >
              {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </a>
              ) : (
                <Link to={to!} className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              )}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-10 hidden w-full justify-center lg:flex">
        <MainNavigation isScrolled={isScrolled} />
      </div>
    </div>
  );
};

export default TopNavigation;
