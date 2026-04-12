import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OptimizedImage from '../common/OptimizedImage';
import ErrorBoundary from '../common/ErrorBoundary';



const learningPathways = [
  {
    id: "form3-4",
    title: "For Form 3 and 4",
    description: "Explore foundation-level courses to build core skills.",
    features: ["UPC 3: Typically caters to students who need further preparation beyond Form 6 to progress to higher studies.", "UPC 4: Serves as a more advanced level, preparing students who have completed UPC 3 or equivalent qualifications to transition into degree-level studies.",],
    image: "/public/lovable-uploads/9763b031-1bb6-490a-bd9c-b086819fa224.png",
    eligibleCourses: [
      { title: "Course 1", image: "/public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "desc" },
      { title: "Course 2", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "desc" },
      { title: "Course 3", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "desc" },
      { title: "Course 1", image: "/public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "desc" },
      { title: "Course 2", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "desc" },
{ title: "Course 1", image: "/public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "desc" },
      { title: "Course 2", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "desc" },
{ title: "Course 1", image: "/public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "desc" },
      { title: "Course 2", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "desc" },

    ],
  },
  {
    id: "form5",
    title: "For Form 5",
    description: "Advance your education with intermediate-level courses.",
    image: "/public/lovable-uploads/9763b031-1bb6-490a-bd9c-b086819fa224.png",
        features: ["feature1", "feature2"],

    eligibleCourses: [
      { title: "Course 4", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "desc" },
      { title: "Course 5", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "desc" },
      { title: "Course 6", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "desc" },
    ],
  },
  {
    id: "form6-7",
    title: "For Form 6 and 7",
    description: "Prepare for higher studies with specialized programs.",
    image: "/public/lovable-uploads/9763b031-1bb6-490a-bd9c-b086819fa224.png",
        features: ["feature1", "feature2"],

    eligibleCourses: [
      { title: "Certificate in Tropical Agriculture", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "This Program comes under Faculty of Agriculture Forestry & Fishery [FAFF]" },
      { title: "Certificate in Business Entrepreneurship", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "This Program comes under the Faculty of Business and Tourism Studies [FBT]" },
      { title: "Certificate in Chemistry & Biology", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "This program comes under Faculty of Science & Technology [FST]" },
      { title: "Certificate in Physics & Maths", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "This program comes under Faculty of Science & Technology [FST]" },
      { title: "Certificate in Physics & Chemistry", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "This program comes under Faculty of Science & Technology [FST]" },

    ],
  },
];

const higherQualificationCourses = [
       { title: "Certificate in Tropical Agriculture", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "This Program comes under Faculty of Agriculture Forestry & Fishery [FAFF]" },
      { title: "Certificate in Business Entrepreneurship", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "This Program comes under the Faculty of Business and Tourism Studies [FBT]" },
      { title: "Certificate in Chemistry & Biology", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "This program comes under Faculty of Science & Technology [FST]" },
      { title: "Certificate in Physics & Maths", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "This program comes under Faculty of Science & Technology [FST]" },
      { title: "Certificate in Physics & Chemistry", image: "public/lovable-uploads/a23d8180-72b6-4460-bda4-a7f878b1d27b.png", description: "This program comes under Faculty of Science & Technology [FST]" },
];

const DFLProgramStructure = () => {
  // Section 1 states
  const [selectedPathway, setSelectedPathway] = useState<string | null>(null);

  // Section 2 states
  const [searchQueryHigher, setSearchQueryHigher] = useState("");
  const [searchResultsHigher, setSearchResultsHigher] = useState(higherQualificationCourses);

    const scrollRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
  const handleCardClick = (pathwayId: string) => {
    setSelectedPathway(pathwayId);
  };
  
  const handleSearchHigher = (query: string) => {
    setSearchQueryHigher(query);
    if (!query.trim()) {
      setSearchResultsHigher(higherQualificationCourses);
    } else {
      setSearchResultsHigher(
        higherQualificationCourses.filter((course) =>
          course.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
      const container = scrollRef.current;
      if (!container) return;
  
      const scrollStep = 2;
      const delay = 30;
  
      const interval = setInterval(() => {
        if (!isPaused && container) {
          if (direction === 'right') {
            container.scrollLeft += scrollStep;
  
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
              setDirection('left');
            }
          } else {
            container.scrollLeft -= scrollStep;
  
            if (container.scrollLeft <= 0) {
              setDirection('right');
            }
          }
        }
      }, delay);
  
      return () => clearInterval(interval);
    }, [isPaused, direction]);
  
  return (
    <div className="p-6 space-y-12">
      {/* Section 1 - Learning Pathway Education */}

<section id = "dfl-programs">
  <h2 className="text-4xl font-bold text-center mb-10 text-[#222222] md:mt-20">
    DFL Program Structure
    <span className="block h-1 w-20 bg-blue-600 mx-auto mt-2 rounded-sm"></span>
  </h2>
  <h2 className="text-2xl font-bold text-center mb-10 text-[#222222]">
    The Learning Pathway Education
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {learningPathways.map((path) => (
      <motion.div
        key={path.id}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => handleCardClick(path.id)}
        className={`cursor-pointer rounded-lg shadow-md overflow-hidden transform transition-all duration-500 hover:scale-105 ${
          selectedPathway === path.id
            ? "border-2 border-blue-600"
            : "border border-gray-200"
        }`}
      >
        <img
          src={path.image}
          alt={path.title}
          className="w-full h-40 object-cover rounded-t-lg"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">{path.title}</h3>
         <ul className="list-disc list-inside text-[#222222] space-y-1">
            {path.features.map((feature, featureIndex) => (
           <li key={featureIndex}>{feature}</li>
                      ))}
                    </ul>
                  </div>
      
      </motion.div>
    ))}
  </div>

  {selectedPathway && (
<div
  ref={scrollRef}
  className="flex overflow-x-auto space-x-6 md:space-x-8 scroll-smooth py-4 px-1 scrollbar-hide"
  onMouseEnter={() => setIsPaused(true)}
  onMouseLeave={() => setIsPaused(false)}
>
  {learningPathways
    .find((p) => p.id === selectedPathway)
    ?.eligibleCourses.map((program, index) => (
      <ErrorBoundary key={index}>
        <Card className="min-w-[280px] max-w-[280px] shrink-0 overflow-hidden hover:shadow-lg transition-shadow duration-300 h-[420px] flex flex-col justify-between">
          
          {/* Top section */}
          <div>
            <div className="h-48 overflow-hidden">
              <OptimizedImage
                src={program.image}
                alt={program.title}
                className="w-full h-full"
                objectFit="cover"
                width={400}
              />
            </div>
            <CardHeader>
              <CardTitle className="text-[#222222] line-clamp-2">{program.title}</CardTitle>
              <CardDescription className="text-[#222222]/80 line-clamp-3">
                {program.description}
              </CardDescription>
            </CardHeader>
          </div>

          {/* Footer pinned at bottom */}
          <CardFooter>
            <Button
              variant="outline"
              className="w-full text-[#035ac5ff] border-[#035ac5ff] hover:bg-[#035ac5ff] hover:text-white"
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>

        </Card>
      </ErrorBoundary>
    ))}
</div>
  )}
</section>

        
      {/* Section 2 - Higher Qualification Programs */}
      <section>
  <h2 className="text-2xl font-bold text-center mb-6 text-[#222222] md:mt-40">
    Higher Qualification Programs
  </h2>
  <input
    type="text"
    placeholder="Search for higher qualification courses..."
    value={searchQueryHigher}
    onChange={(e) => handleSearchHigher(e.target.value)}
    className="w-full border border-blue-600 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
  />
  <AnimatePresence>
    {searchQueryHigher.trim() !== "" && searchResultsHigher.length > 0 && (
      <motion.div
        key="results"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {searchResultsHigher.map((course, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-32 object-cover rounded-t-lg"
            />
            <h4 className="mt-2 font-semibold">{course.title}</h4>
            <p className="text-[#222222]/80 ">{course.description}</p>
          </motion.div>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
</section>
    </div>
  );
};

export default DFLProgramStructure;
