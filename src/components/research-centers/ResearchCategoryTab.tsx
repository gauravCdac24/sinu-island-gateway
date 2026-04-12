import React from 'react';
import { Lightbulb, Users, Microscope } from 'lucide-react';

const categories = [
  {
    icon: Lightbulb,
    title: 'Impact',
    color: 'border-amber-400',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    count: 7,
    description:
      'Research that directly shapes policy, improves lives, and addresses major societal challenges — from climate security and national governance to public health outcomes.',
  },
  {
    icon: Users,
    title: 'Engagement',
    color: 'border-green-500',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
    count: 7,
    description:
      'Community-driven partnerships and collaborative projects that co-design solutions with local communities, government agencies, and international partners.',
  },
  {
    icon: Microscope,
    title: 'Discovery',
    color: 'border-university-blue',
    iconBg: 'bg-blue-100',
    iconColor: 'text-university-blue',
    count: 4,
    description:
      'Fundamental scientific research expanding knowledge of marine ecosystems, environmental DNA, ocean acidification, and biodiversity unique to the Pacific region.',
  },
];

const ResearchCategoryTabs = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-university-gold font-semibold text-sm uppercase tracking-widest">
            How We Categorise
          </span>
          <h2 className="text-3xl font-bold text-university-dark-gray mt-2">
            Three Dimensions of Research
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            SINU's research portfolio is framed around three interconnected
            dimensions that together drive sustainable development in Solomon Islands
            and the wider Pacific.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map(({ icon: Icon, title, color, iconBg, iconColor, count, description }) => (
            <div
              key={title}
              className={`rounded-xl p-8 border-t-4 ${color} bg-white shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${iconBg} mb-5`}>
                <Icon size={22} className={iconColor} />
              </div>
              <div className="flex items-baseline gap-3 mb-3">
                <h3 className="text-xl font-bold text-university-dark-gray">{title}</h3>
                <span className="text-sm text-gray-400">{count} projects</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
};

export default ResearchCategoryTabs;
