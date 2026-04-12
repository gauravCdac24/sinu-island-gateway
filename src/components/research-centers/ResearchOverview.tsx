import React, { useState, useMemo } from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  researchProjects,
  CATEGORIES,
  FACULTIES,
  type ImpactCategory,
} from '@/data/researchImpactData';

const categoryStyles: Record<string, string> = {
  Impact: 'bg-amber-100 text-amber-800',
  Engagement: 'bg-green-100 text-green-800',
  Discovery: 'bg-blue-100 text-blue-800',
};

const categoryDot: Record<string, string> = {
  Impact: 'bg-amber-500',
  Engagement: 'bg-green-600',
  Discovery: 'bg-university-blue',
};

const statusStyles = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('activ') || s.includes('ongoing')) return 'bg-green-500';
  if (s.includes('conclud') || s.includes('complet')) return 'bg-gray-400';
  if (s.includes('negot') || s.includes('pending') || s.includes('await')) return 'bg-university-gold';
  return 'bg-university-blue';
};

const formatGrant = (g: number | null): string | null => {
  if (!g) return null;
  if (g >= 1000000) return `$${(g / 1000000).toFixed(1)}M`;
  if (g >= 1000) return `$${(g / 1000).toFixed(0)}K`;
  return `$${g}`;
};

const ResearchOverview = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeFaculty, setActiveFaculty] = useState<string>('all');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return researchProjects.filter((p) => {
      const catOk = activeCategory === 'all' || p.category === activeCategory;
      const facOk = activeFaculty === 'all' || p.faculty.includes(activeFaculty);
      return catOk && facOk;
    });
  }, [activeCategory, activeFaculty]);

  return (
    <section className="py-12 bg-university-light-gray min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-gray-200">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${
                activeCategory === key
                  ? 'bg-university-dark-gray text-white border-university-dark-gray'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {key !== 'all' && (
                <span className={`h-2 w-2 rounded-full ${categoryDot[key]}`} />
              )}
              {label}
            </button>
          ))}
        </div>

        {/* Faculty Filter */}
        <div className="flex flex-wrap gap-2 mb-6 items-center">
          <span className="text-sm text-gray-500 mr-1">Faculty:</span>
          {FACULTIES.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setActiveFaculty(code)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors border ${
                activeFaculty === code
                  ? 'bg-university-blue text-white border-university-blue'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing <strong className="text-university-dark-gray">{filtered.length}</strong> project{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No projects match the selected filters.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project) => {
              const grant = formatGrant(project.grant);
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md hover:border-university-blue/30 transition-all group"
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-xs text-gray-400">{project.id}</span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${categoryStyles[project.category]}`}
                    >
                      {project.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-university-dark-gray text-sm leading-snug group-hover:text-university-blue transition-colors">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-university-light-gray text-gray-600 px-2.5 py-1 rounded-full">
                      {project.area}
                    </span>
                    {project.faculty !== '—' && (
                      <span className="text-xs bg-university-light-gray text-gray-600 px-2.5 py-1 rounded-full">
                        {project.faculty}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span
                        className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${statusStyles(project.status)}`}
                      />
                      <span>
                        {project.funder !== '—' ? project.funder : 'Funder TBC'}
                      </span>
                    </div>
                    {grant && (
                      <span className="text-xs font-semibold text-university-blue bg-blue-50 px-2.5 py-1 rounded-full">
                        {grant}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
       <div className="bg-[#8ecae6] rounded-lg p-8 text-center md:mt-20">
          <h3 className="text-2xl font-bold text-[#023047] mb-4">
            Need Help with Your Research?
          </h3>
          <p className="text-[#023047] mb-6">
            Our research team is here to guide you through the research process. 
            Contact us for personalized support and advice.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-start sm:items-center">
  {/* Phone */}
  <div className="text-center ml-10">
    <p className="font-semibold  text-[#023047] mb-2">Phone</p>
    <a
      href="tel:+67712345678"
      className="inline-block px-4 py-2 bg-blue-900  text-white rounded-lg hover:bg-blue-700 transition"
    >
      Call +677 12345678
    </a>
  </div>

  {/* Email Button */}
  <div className="text-center ml-16">
    <p className="font-semibold text-[#023047] mb-2">Email</p>
    <a
      href="mailto:admissions@sinu.edu.sb"
      className="inline-block px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-green-700 transition"
    >
      Send Email
    </a>
  </div>

  {/* Office Hours */}
  <div className="text-center ml-10">
    <p className="font-semibold text-[#023047]">Office Hours</p>
    <p className="text-[#023047]">Mon-Fri, 8:00 AM - 4:00 PM</p>
  </div>
</div>
        </div>
    </section>
  );
};

export default ResearchOverview;
