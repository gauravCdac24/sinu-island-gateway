import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, FileText, Send, University, Plane } from 'lucide-react';

const ApplicationProcess = () => {
  const steps = [
    {
      step: 1,
      icon: Users,
      title: "Attend Information Session",
      description: "Join our Go Global information sessions to learn about opportunities and get your questions answered.",
      details: "These sessions are the best way to learn about the program that fits you best."
    },
    {
      step: 2,
      icon: FileText,
      title: "Prepare Your Application",
      description: "Complete your Study Plan Proposal Form and gather required documents.",
      details: "Ensure you have approved units and meet all eligibility requirements before applying."
    },
    {
      step: 3,
      icon: Send,
      title: "Submit Application",
      description: "Submit your Go Global application online with all supporting documents.",
      details: "Applications are assessed approximately three weeks after the deadline."
    },
    {
      step: 4,
      icon: University,
      title: "University Nomination",
      description: "We'll nominate you to your preferred host university and facilitate acceptance.",
      details: "Complete the host university application when invited to do so."
    },
    {
      step: 5,
      icon: Plane,
      title: "Prepare for Departure",
      description: "Attend pre-departure sessions and organize travel, accommodation, and visas.",
      details: "Connect with your exchange advisor and prepare for your adventure abroad."
    }
  ];

  const deadlines = [
    { semester: "Semester 1 2026", deadline: "15 August 2025" },
    { semester: "Semester 2 2026", deadline: "15 February 2026" },
    { semester: "Semester 1 2027", deadline: "15 July 2026" },
    { semester: "Semester 2 2027", deadline: "15 February 2027" }
  ];

  return (
    <section className="py-16" style={{ backgroundColor: '#edf4ff' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#082952' }}>
              Application Process
            </h2>
            <p className="text-lg" style={{ color: '#082952' }}>
              Follow these simple steps to apply for your exchange program experience.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {steps.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ backgroundColor: '#ffffff' }}>
                  <CardHeader className="text-center">
                    <div 
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#8ecae6' }}
                    >
                      <span className="text-2xl font-bold mr-2" style={{ color: '#082952' }}>
                        {item.step}
                      </span>
                      <IconComponent className="w-6 h-6" style={{ color: '#082952' }} />
                    </div>
                    <CardTitle className="text-xl" style={{ color: '#082952' }}>
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="mb-3" style={{ color: '#082952' }}>
                      {item.description}
                    </p>
                    <p className="text-sm" style={{ color: '#219ebc' }}>
                      {item.details}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Application Deadlines */}
          <Card className="border-none shadow-lg mb-8" style={{ backgroundColor: '#ffb703' }}>
            <CardHeader>
              <CardTitle className="text-center text-2xl" style={{ color: '#082952' }}>
                Application Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {deadlines.map((item, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 text-center">
                    <h4 className="font-semibold mb-2" style={{ color: '#082952' }}>
                      {item.semester}
                    </h4>
                    <p className="text-lg font-bold" style={{ color: '#219ebc' }}>
                      {item.deadline}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Study Plan Information */}
          <div className="bg-white rounded-lg p-8 shadow-lg mb-8" style={{ borderLeft: '4px solid #219ebc' }}>
            <h3 className="text-2xl font-semibold mb-4" style={{ color: '#082952' }}>
              Study Plan Proposal
            </h3>
            <p className="mb-4" style={{ color: '#082952' }}>
              One of the best parts of going on exchange is that your studies count towards your SINU degree! 
              To ensure you receive credit, you need to complete a study plan proposal form and have your course coordinator approve your units.
            </p>
            <ul className="space-y-2 mb-4" style={{ color: '#082952' }}>
              <li>• Use elective units when possible for greater flexibility</li>
              <li>• You need four preferred units and two alternative units approved</li>
              <li>• Maintain full-time study load (75-100 credits equivalent)</li>
              <li>• Meet minimum enrollment requirements of the host university</li>
            </ul>
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-[#219ebc] hover:bg-[#082952] text-white px-8 py-3 mr-4"
              asChild
            >
              <Link to="/apply">Apply Now</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-[#082952] text-[#082952] hover:bg-[#082952] hover:text-white px-8 py-3"
            >
              Find Information Session
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationProcess;