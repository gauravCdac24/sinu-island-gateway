
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, FileText, CreditCard } from 'lucide-react';
import OptimizedImage from '@/components/common/OptimizedImage';

const EnrollmentSection = () => {
  const enrollmentSteps = [
    {
      icon: FileText,
      title: "1. Check Requirements",
      description: "Review program prerequisites and ensure you meet entry requirements",
      action: "View Requirements",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173"
    },
    {
      icon: Calendar,
      title: "2. Choose Your Schedule",
      description: "Select from our flexible start dates and delivery modes",
      action: "View Calendar",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    },
    {
      icon: CreditCard,
      title: "3. Apply & Pay",
      description: "Complete your application and arrange payment or financial aid",
      action: "Apply Now",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
    },
    {
      icon: CheckCircle,
      title: "4. Get Started",
      description: "Attend orientation and begin your learning journey",
      action: "Learn More",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
    }
  ];

  return (
    <section className="py-16 bg-white md:mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-4">
            Ready to Start Your Journey?
            <span className="block h-1 w-20 bg-blue-600 mx-auto mt-2 rounded-sm"></span>
          </h2>
          <p className="text-xl text-[#082952] max-w-3xl mx-auto">
            Follow these simple steps to enroll in our distance and flexible learning programs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
          {enrollmentSteps.map((step, index) => (
            <Card key={index} className="border-[#8ecae6] text-center hover:shadow-lg transition-shadow overflow-hidden">
              <div className="relative h-32">
                <OptimizedImage
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-[#082952]/20"></div>
              </div>
              <CardHeader>
                <div className="bg-[#035ac5ff] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-[#fff]" />
                </div>
                <CardTitle className="text-lg text-[#222222]">{step.title}</CardTitle>
                <CardDescription className="text-[#082952]">{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {step.action === "Apply Now" ? (
                  <Button variant="outline" size="sm" className="border-[#035ac5ff] text-[#035ac5ff] hover:bg-[#035ac5ff] hover:text-white" asChild>
                    <Link to="/apply">{step.action}</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="border-[#035ac5ff] text-[#035ac5ff] hover:bg-[#035ac5ff] hover:text-white">
                    {step.action}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnrollmentSection;
