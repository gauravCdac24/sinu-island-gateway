
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Users } from 'lucide-react';

const FeaturedScholarshipsSection = () => {
  const featuredScholarships = [
    {
      title: "SINU Excellence Scholarship",
      description: "Our premier scholarship for outstanding academic achievers entering undergraduate programs.",
      amount: "$8,000 per year",
      deadline: "December 15, 2024",
      eligibility: "High school graduates with GPA 3.8+",
      status: "Open"
    },
    {
      title: "Pacific Islands Research Grant",
      description: "Supporting postgraduate research projects focused on Pacific Island development and sustainability.",
      amount: "$15,000",
      deadline: "January 31, 2025",
      eligibility: "Postgraduate research students",
      status: "Open"
    },
    {
      title: "Indigenous Knowledge Scholarship",
      description: "Preserving and promoting indigenous knowledge systems through academic study.",
      amount: "$6,000 per year",
      deadline: "February 28, 2025",
      eligibility: "Students of indigenous heritage",
      status: "Open"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#082952] mb-4">
            Featured Scholarships
          </h2>
          <p className="text-lg text-[#082952] max-w-3xl mx-auto">
            These scholarships are currently accepting applications. Don't miss these opportunities to fund your education.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featuredScholarships.map((scholarship, index) => (
            <Card key={index} className="h-full hover:shadow-lg transition-shadow border-l-4 border-l-[#219ebc]">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-[#082952] text-xl">{scholarship.title}</CardTitle>
                  <span className="bg-[#8ecae6] text-[#082952] px-2 py-1 rounded-full text-xs font-medium">
                    {scholarship.status}
                  </span>
                </div>
                <CardDescription className="text-[#082952]">
                  {scholarship.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-[#082952]">
                    <DollarSign className="h-4 w-4 mr-2 text-[#219ebc]" />
                    <span className="font-semibold">{scholarship.amount}</span>
                  </div>
                  <div className="flex items-center text-[#082952]">
                    <Calendar className="h-4 w-4 mr-2 text-[#219ebc]" />
                    <span>Deadline: {scholarship.deadline}</span>
                  </div>
                  <div className="flex items-start text-[#082952]">
                    <Users className="h-4 w-4 mr-2 mt-1 text-[#219ebc]" />
                    <span className="text-sm">{scholarship.eligibility}</span>
                  </div>
                </div>
                <Button className="w-full bg-[#219ebc] hover:bg-[#219ebc]/90 text-white" asChild>
                  <Link to="/apply">Apply Now</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedScholarshipsSection;
