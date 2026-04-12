import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, DollarSign, Clock, ExternalLink } from 'lucide-react';

const FundingOpportunities = () => {
  const opportunities = [
    {
      title: "Pacific Research Excellence Grant",
      agency: "Pacific Research Council",
      amount: "Up to $150,000",
      deadline: "March 15, 2024",
      duration: "2 years",
      category: "General Research",
      description: "Competitive grants for innovative research addressing Pacific region challenges in any discipline.",
      eligibility: "Open to all academic staff and postgraduate students",
      status: "Open"
    },
    {
      title: "Climate Adaptation Research Initiative",
      agency: "Pacific Climate Foundation",
      amount: "Up to $250,000",
      deadline: "April 30, 2024",
      duration: "3 years",
      category: "Climate Change",
      description: "Research focused on climate change adaptation strategies for small island developing states.",
      eligibility: "Collaborative projects preferred",
      status: "Open"
    },
    {
      title: "Marine Conservation Research Fund",
      agency: "Blue Pacific Initiative",
      amount: "Up to $100,000",
      deadline: "May 20, 2024",
      duration: "18 months",
      category: "Marine Sciences",
      description: "Support for marine conservation research and ecosystem restoration projects.",
      eligibility: "Early career researchers encouraged",
      status: "Opening Soon"
    },
    {
      title: "Indigenous Knowledge Documentation Grant",
      agency: "Cultural Heritage Foundation",
      amount: "Up to $75,000",
      deadline: "June 10, 2024",
      duration: "1 year",
      category: "Cultural Studies",
      description: "Funding for research documenting and preserving traditional knowledge systems.",
      eligibility: "Community partnerships required",
      status: "Open"
    },
    {
      title: "Health Innovation Challenge",
      agency: "Pacific Health Research Institute",
      amount: "Up to $200,000",
      deadline: "July 15, 2024",
      duration: "2 years",
      category: "Public Health",
      description: "Research addressing health challenges specific to Pacific island populations.",
      eligibility: "Multidisciplinary teams preferred",
      status: "Open"
    },
    {
      title: "Technology for Development Grant",
      agency: "Digital Pacific Foundation",
      amount: "Up to $120,000",
      deadline: "August 30, 2024",
      duration: "18 months",
      category: "Technology",
      description: "Support for technology solutions addressing development challenges in the Pacific.",
      eligibility: "Industry partnerships encouraged",
      status: "Opening Soon"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return '#219ebc';
      case 'Opening Soon': return '#ffb703';
      case 'Closed': return '#8ecae6';
      default: return '#082952';
    }
  };

  return (
    <section className="py-16" style={{ backgroundColor: '#edf4ff' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#082952' }}>
            Current Funding Opportunities
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: '#082952' }}>
            Explore available grants and funding opportunities aligned with SINU's research priorities
          </p>
        </div>

        <div className="space-y-6">
          {opportunities.map((opportunity, index) => (
            <div 
              key={index}
              className="rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #8ecae6'
              }}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1 lg:mr-6">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold" style={{ color: '#082952' }}>
                      {opportunity.title}
                    </h3>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: getStatusColor(opportunity.status),
                        color: '#ffffff'
                      }}
                    >
                      {opportunity.status}
                    </span>
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: '#d7a12c', color: '#082952' }}
                    >
                      {opportunity.category}
                    </span>
                  </div>
                  
                  <p className="text-sm font-medium mb-2" style={{ color: '#219ebc' }}>
                    {opportunity.agency}
                  </p>
                  
                  <p className="mb-4" style={{ color: '#082952' }}>
                    {opportunity.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2" style={{ color: '#219ebc' }} />
                      <span className="text-sm" style={{ color: '#082952' }}>
                        <strong>Amount:</strong> {opportunity.amount}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" style={{ color: '#219ebc' }} />
                      <span className="text-sm" style={{ color: '#082952' }}>
                        <strong>Deadline:</strong> {opportunity.deadline}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" style={{ color: '#219ebc' }} />
                      <span className="text-sm" style={{ color: '#082952' }}>
                        <strong>Duration:</strong> {opportunity.duration}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-4" style={{ color: '#082952' }}>
                    <strong>Eligibility:</strong> {opportunity.eligibility}
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2 lg:w-48">
                  <button 
                    className="py-2 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                    style={{ backgroundColor: '#ffb703', color: '#082952' }}
                  >
                    <ExternalLink className="w-4 h-4 inline mr-2" />
                    View Details
                  </button>
                  <Link 
                    to="/apply"
                    className="py-2 px-4 rounded-lg font-medium transition-all duration-200 hover:shadow-md inline-block text-center"
                    style={{ backgroundColor: '#219ebc', color: '#ffffff' }}
                  >
                    <ArrowRight className="w-4 h-4 inline mr-2" />
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
            style={{ backgroundColor: '#219ebc', color: '#ffffff' }}
          >
            View All Opportunities
          </button>
        </div>
      </div>
    </section>
  );
};

export default FundingOpportunities;