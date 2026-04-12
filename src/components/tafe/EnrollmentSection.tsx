import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, FileText, Phone } from 'lucide-react';

const EnrollmentSection = () => {
  const steps = [
    {
      icon: FileText,
      title: "1. Choose Your Course",
      description: "Browse our course areas and find the program that matches your interests and career goals.",
      button: "TAFE Courses",
      targetId: "tafe-courses" // <-- ID to scroll to
    },
    {
      icon: Calendar,
      title: "2. Apply Online",
      description: "Complete your application form and upload required documents through our online portal.",
      button: "Apply Now",
      targetId: "apply-section",
      linkTo: "/apply",
    },
    {
      icon: Phone,
      title: "3. Enroll & Start",
      description: "Confirm your enrollment and tuition fees payment.",
      button: "Contact Us",
      targetId: "key-dates"
    },
    {
      icon: CheckCircle,
      title: "4. Course Commence",
      description: "Await course commencement, attend orientation, and begin your journey to success.",
      button: "Get Started",
      targetId: "orientation-section"
    },
  ];

  // Smooth scroll function
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="tafe-admission" className="py-16 bg-white md:mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-4">
            Admission Process
                          <span className="block h-1 w-20 bg-blue-600 mx-auto mt-2 rounded-sm"></span>

          </h2>
          <p className="text-xl text-[#082952] max-w-3xl mx-auto">
            Getting started is easy. Follow these simple steps to begin your TAFE & TVET journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="flex flex-col justify-between min-h-[360px] text-center hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="bg-[#035ac5ff] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-lg text-[#082952]">{step.title}</CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col flex-grow">
                <CardDescription className="text-[#082952] mb-4">
                  {step.description}
                </CardDescription>
                <div className="mt-auto">
                  {"linkTo" in step && step.linkTo ? (
                    <Button
                      variant="outline"
                      className="w-full text-[#035ac5ff] border-[#035ac5ff] hover:bg-[#035ac5ff] hover:text-white"
                      asChild
                    >
                      <Link to={step.linkTo}>{step.button}</Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full text-[#035ac5ff] border-[#035ac5ff] hover:bg-[#035ac5ff] hover:text-white"
                      onClick={() => scrollToSection(step.targetId)}
                    >
                      {step.button}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnrollmentSection;
