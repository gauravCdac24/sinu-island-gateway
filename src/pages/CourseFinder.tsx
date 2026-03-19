import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Link, Search } from 'lucide-react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import OptimizedImage from '@/components/common/OptimizedImage';
import { useNavigate } from "react-router-dom";

const CourseFinder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [scrolled, setScrolled] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_BASE = "http://10.80.210.65:3000";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery.length === 4) {
        const res = await fetch(`${API_BASE}/programme_catalogue/code/${trimmedQuery}`);
        if (!res.ok) {
          setResults([]);
          setError('Programme not found');
        } else {
          const data = await res.json();
          setResults([data]);
        }
      } else {
        const params = new URLSearchParams({
          programme_name: trimmedQuery || 'all',
          programme_level: selectedLevel,
          programme_faculty: selectedFaculty,
        });

        const res = await fetch(`${API_BASE}/programme_catalogue/search?${params.toString()}`);
        if (!res.ok) {
          setResults([]);
          setError('No programmes found');
        } else {
          const data = await res.json();
          setResults(data.data || []);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch programmes');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const imagePush = Math.min(scrolled, 200);

  return (
    <div className="min-h-screen flex flex-col">
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>

      <main className="flex-grow">
        {/* Hero Banner */}
        <div className="relative bg-[#023047] h-[70vh] lg:h-[98vh] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{ transform: `translateY(${imagePush}px)` }}
          >
            <OptimizedImage
              src="/lovable-uploads/DSC05873.jpg"
              alt="Hero"
              className="w-full h-full object-cover"
              priority
              width={1920}
              height={1080}
            />

                <div
                  className="
                    absolute 
                    inset-x-0 bottom-20 translate-y-50 flex justify-center px-4
                    sm:inset-x-auto sm:bottom-16 sm:translate-y-0 sm:left-8 md:left-12 sm:justify-start
                    z-10
                  "
                >
                  <div
                    className="
                    bg-[#22a2bf]/50 backdrop-blur-md rounded-2xl shadow-2xl
                    p-4 sm:p-6 md:p-8 lg:p-10
                    w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl
                    text-center sm:text-left
                  "
                  >
                    <h2 className="font-semibold text-xl sm:text-2xl md:text-3xl lg:text-3xl text-[#222] mb-4 sm:mb-6">
                    Search and Explore Our Programmes
                    </h2>
                  </div>
                </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">

              <div className="  rounded-xl p-6 md:p-8 bg-white">
                <h2 className="font-semibold text-2xl text-center md:text-3xl mb-6">
                  Browse Our Programmes
                  <span className="block h-1 w-20 bg-blue-600 mx-auto mt-2 rounded-sm"></span>

                </h2>

                <form onSubmit={handleSearch}>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:pb-10">
                    <div>
                      <label className="block text-sm font-medium mb-2">Faculty</label>
                      <select
                        className="w-full border border-gray-300 rounded-md p-3 text-base"
                        value={selectedFaculty}
                        onChange={(e) => setSelectedFaculty(e.target.value)}
                      >
                        <option value="all">All Faculties</option>
                        <option value="Faculty of Science and Technology">Science & Technology</option>
                        <option value="Faculty of Education and Humanities">Education & Humanities</option>
                        <option value="Faculty of Business & Tourism Studies">Business & Tourism Studies</option>
                        <option value="Faculty of Nursing, Medicine and  Health Sciences">Nursing, Medicine & Health Sciences</option>
                        <option value="Faculty of Agriculture, Forestry and Fisheries">Agriculture & Fisheries</option>
                        <option value="SINU TAFE School of Technology">TAFE & TVET</option>
                        <option value="Solomon Islands Maritime College">Maritime</option>
                        <option value="Center for Distance & Flexible Learning">Distance & Flexible Learning</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Course Level</label>
                      <select
                        className="w-full border border-gray-300 rounded-md p-3 text-base"
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                      >
                        <option value="all">All Levels</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="technical_and_trade">Technical & Trade</option>
                        <option value="University Preparatory Certificate">University Preparatory</option>
                        <option value="Double Major">Double Major</option>
                        <option value="Certificate">Certificate</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-6">
                    <div className="flex items-center border-2 border-[#0b2c55] rounded-md overflow-hidden">
                      <Input
                        type="text"
                        placeholder="Search by course name or code..."
                        className="border-none text-lg flex-grow focus-visible:ring-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button
                        type="submit"
                        className="bg-[#0b2c55] hover:bg-[#d7a12c] rounded-none h-14 px-6"
                      >
                        <Search className="mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>
                  <div className="text-xl bg-orange-600/40 text-black mt-8 p-4 rounded-md duration-300 ease-in-out hover:scale-105">
                    <AlertTriangle className="w-6 h-6 text-black mt-1" />
                    <span>
                      <strong> Note: </strong> SINU is currently reviewing all programmes to comply with the Solomon Islands Qualifications Framework (SIQF). Programme SIQF levels may be updated soon.
                    </span>
                  </div>
                </form>

                {/* Results */}
                {loading && <p className="mt-4">Loading...</p>}
                {error && <p className="mt-4 text-red-500">{error}</p>}

                {results.length > 0 && (
                  <div className="mt-6 pt-10 space-y-4">
                    {results.map((course, idx) => (
                      < Card
                        key={idx}
                        className="cursor-pointer hover:text-blue-600 hover:bg-gray-100 transition-colors duration-300 ease-in-out hover:scale-105"
                        onClick={() =>
                          navigate(`/programme/${course.programme_code}`, {
                            state: {
                              programme_name: course.programme_name,
                              programme_code: course.programme_code,
                              programme_description: course.programme_description,
                              SIQF_level: course.SIQF_level,
                              programme_faculty: course.programme_faculty,
                              programme_department: course.programme_department,
                              programme_credits: course.programme_credits,
                              programme_entry_requirement: course.programme_entry_requirement,
                              programme_year: course.programme_year,
                              programme_study_type: course.programme_study_type,
                              programme_location: course.programme_location,
                              programme_study_period: course.programme_study_period,
                              programme_english_requirement: course.programme_english_requirement,
                              programme_units: course.programme_units,

                            },
                          })
                        }
                      >
                        <CardContent className="grid grid-cols-2 items-center ">
                          <div>
                            <h3 className="font-bold text-lg">
                              {course.programme_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Programme Code: {course.programme_code}
                            </p>
                          </div>

                          <div className="text-right font-semibold">
                            {course.programme_credits} Credits
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main >

      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </div >
  );
};

export default CourseFinder;
