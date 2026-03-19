
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Stethoscope, Car, Cpu, Building, Users, ChefHat, Palette, ArrowRight } from 'lucide-react';
import OptimizedImage from '../common/OptimizedImage';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";

interface Programme {
  _id: string;
  programme_name: string;
  programme_code: string;
  programme_description: string;
  programme_image?: string;
  programme_study_period?: string;
  programme_faculty: string;
  programme_department: string;
  programme_level: string;
  programme_entry_requirement: string;
  programme_year: number;
  programme_study_type: string[];
  programme_location: string;
  programme_english_requirement: string;
  SIQF_level: string;
  programme_credits: number;
}

const API_BASE = "http://10.80.210.65:7000";

const CourseAreasSection = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
    const [filteredProgrammes, setFilteredProgrammes] = useState<Programme[]>([]);
    const [selectedFaculty, setSelectedFaculty] = useState("All");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    /* ---------------- FETCH PROGRAMMES ---------------- */
    const fetchProgrammes = async () => {
      try {
        setLoading(true);
  
        const params = new URLSearchParams();
          params.append("programme_faculty", "SINU TAFE School of Technology");
  
        console.log("Fetching programmes with params:", params.toString());
        const res = await fetch(
          `${API_BASE}/programme_catalogue/search?${params.toString()}`
        );
        console.log("Fetch response:", res);
        const json = await res.json();
        const data = json.data || [];
  
        setProgrammes(data);
        setFilteredProgrammes(data);
      } catch (err) {
        console.error("Failed to fetch programmes", err);
        setProgrammes([]);
        setFilteredProgrammes([]);
      } finally {
        setLoading(false);
      }
    };
  
    /* ---------------- INITIAL LOAD ---------------- */
    useEffect(() => {
      fetchProgrammes();
    }, []);


  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollStep = 1;
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
    <section id= "tafe-courses" className="py-4 bg-white md:mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-4">
            TAFE Offered Courses
                          <span className="block h-1 w-20 bg-blue-600 mx-auto mt-2 rounded-sm"></span>

          </h2>
          <p className="text-xl text-[#082952] max-w-3xl mx-auto">
            Discover your pathway to success with our comprehensive range of technical and vocational courses
          </p>
        </div>
        
         <div
  ref={scrollRef}
  className="flex overflow-x-auto space-x-6 md:space-x-8 scroll-smooth py-4 px-1 scrollbar-hide"
  onMouseEnter={() => setIsPaused(true)}
  onMouseLeave={() => setIsPaused(false)}
>
  {filteredProgrammes.map((area, index) => (
    <Card
      key={index}
      className="flex flex-col border-[#22a2bf] justify-between min-h-[400px] shrink-0 w-80 
                 transition-shadow hover:shadow-lg"
    >
      {/* IMAGE */}
      <div className="h-40 sm:h-48 w-full overflow-hidden flex-shrink-0">
        <OptimizedImage
          src={area.programme_image}
          alt={area.programme_name}
          className="w-full h-full"
          objectFit="cover"
          width={400}
        />
      </div>

      {/* CONTENT */}
      <CardHeader className="flex-1 px-4 py-3">
        <CardTitle className="text-[#222]  text-lg font-semibold">
          {area.programme_name}
        </CardTitle>
        <CardDescription className="text-[#023047] text-sm">
          Programme Code: {area.programme_code}
          <br />
          Total Credits: {area.programme_credits}
        </CardDescription>
      </CardHeader>

      {/* FOOTER */}
      <CardFooter className="px-4 pb-4 pt-2">
        <Button
          variant="outline"
          onClick={(e) => {
            e.stopPropagation(); // prevent any parent click
            navigate(`/programme/${area.programme_code}`, {
              state: {
                programme_name: area.programme_name,
                programme_code: area.programme_code,
                programme_description: area.programme_description,
                SIQF_level: area.SIQF_level,
                programme_faculty: area.programme_faculty,
                programme_department: area.programme_department,
                programme_credits: area.programme_credits,
                programme_entry_requirement: area.programme_entry_requirement,
                programme_year: area.programme_year,
                programme_study_type: area.programme_study_type,
                programme_location: area.programme_location,
                programme_study_period: area.programme_study_period,
                programme_english_requirement: area.programme_english_requirement,
              },
            });
          }}
          className="w-full text-[#035ac5ff] border-[#035ac5ff] 
                     hover:bg-[#035ac5ff] hover:text-white 
                     flex items-center justify-center"
        >
          Learn More
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  ))}
</div>


      </div>
    </section>
  );
};

export default CourseAreasSection;
