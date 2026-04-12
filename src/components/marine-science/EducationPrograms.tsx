import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, Users, Award } from 'lucide-react';

const EducationPrograms: React.FC = () => {
  const programs = [
    {
      icon: GraduationCap,
      title: "Graduate Research Programs",
      level: "PhD & Masters",
      description: "Advanced research degrees in marine science with emphasis on Pacific region studies",
      features: [
        "Supervised research projects",
        "International fieldwork opportunities",
        "Conference presentation support",
        "Publication mentorship"
      ],
      duration: "2-4 years"
    },
    {
      icon: BookOpen,
      title: "Undergraduate Opportunities",
      level: "Bachelor's Level",
      description: "Research experience and internship programs for undergraduate students",
      features: [
        "Summer research internships",
        "Field work experience",
        "Laboratory training",
        "Thesis project support"
      ],
      duration: "3-12 months"
    },
    {
      icon: Users,
      title: "Professional Development",
      level: "Continuing Education",
      description: "Training programs for marine professionals and community leaders",
      features: [
        "Short-term workshops",
        "Technical skill development",
        "Policy training sessions",
        "Community outreach programs"
      ],
      duration: "1-4 weeks"
    },
    {
      icon: Award,
      title: "International Exchange",
      level: "All Levels",
      description: "Student and researcher exchange programs with partner institutions",
      features: [
        "Research mobility grants",
        "Cultural exchange opportunities",
        "Joint degree programs",
        "Collaborative projects"
      ],
      duration: "1-12 months"
    }
  ];

  const achievements = [
    {
      number: "200+",
      label: "Graduates",
      description: "Marine science professionals trained"
    },
    {
      number: "50+",
      label: "Current Students",
      description: "Active research students"
    },
    {
      number: "25+",
      label: "Countries",
      description: "Student origins worldwide"
    },
    {
      number: "90%",
      label: "Employment Rate",
      description: "Graduates in marine careers"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#082952] mb-6">
            Education & Training Programs
          </h2>
          <p className="text-lg text-[#219ebc] max-w-3xl mx-auto">
            Developing the next generation of marine scientists and conservation leaders 
            through comprehensive education and training opportunities
          </p>
        </div>

        {/* Student Success Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center bg-[#edf4ff] rounded-lg p-6 border border-[#8ecae6]">
              <div className="text-3xl font-bold text-[#219ebc] mb-2">
                {achievement.number}
              </div>
              <div className="text-lg font-semibold text-[#082952] mb-1">
                {achievement.label}
              </div>
              <div className="text-sm text-[#082952]">
                {achievement.description}
              </div>
            </div>
          ))}
        </div>

        {/* Program Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {programs.map((program, index) => (
            <Card key={index} className="border-[#8ecae6] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-[#8ecae6] w-12 h-12 rounded-lg flex items-center justify-center">
                    <program.icon className="h-6 w-6 text-[#082952]" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-[#082952]">{program.title}</CardTitle>
                    <div className="text-sm text-[#219ebc] font-medium">{program.level}</div>
                  </div>
                </div>
                <div className="bg-[#ffb703] text-[#082952] px-3 py-1 rounded-full text-sm font-medium inline-block">
                  Duration: {program.duration}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-[#082952] mb-6 leading-relaxed">
                  {program.description}
                </p>
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#082952]">Program Features:</h4>
                  {program.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-[#219ebc] rounded-full mr-3"></div>
                      <span className="text-[#082952]">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[#8ecae6] to-[#219ebc] rounded-lg p-8 text-white">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Start Your Marine Science Journey</h3>
            <p className="text-lg leading-relaxed mb-6">
              Join our community of passionate marine scientists and contribute to protecting 
              our ocean ecosystems. Explore our programs and find the right path for your career in marine science.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#082952] font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                View Program Details
              </button>
              <Link
                to="/apply"
                className="bg-[#ffb703] hover:bg-[#d7a12c] text-[#082952] font-semibold px-8 py-3 rounded-lg transition-colors inline-block text-center"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationPrograms;