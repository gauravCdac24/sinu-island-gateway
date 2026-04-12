import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OptimizedImage from "@/components/common/OptimizedImage";
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
  programme_units: string;
}

const API_BASE = import.meta.env.VITE_API_URL_7000 || "http://localhost:7000";

const FACULTIES = [
  "Faculty of Science and Technology",
  "Faculty of Education and Humanities",
  "Faculty of Business & Tourism Studies",
  "Faculty of Nursing, Medicine and  Health Sciences",
  "Faculty of Agriculture, Forestry and Fisheries",
  "SINU TAFE School of Technology",
  "Solomon Islands Maritime College",
];

const StudyOptionsSection = () => {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [filteredProgrammes, setFilteredProgrammes] = useState<Programme[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState("All");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProgrammes = async (faculty?: string) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (faculty && faculty !== "All") {
        params.append("programme_faculty", faculty);
      }

      params.append("programme_level", "Undergraduate");
      const res = await fetch(
        `${API_BASE}/programme_catalogue/search?${params.toString()}`
      );
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

  useEffect(() => {
    fetchProgrammes();
  }, []);

  useEffect(() => {
    if (selectedFaculty === "All") {
      setFilteredProgrammes(programmes);
    } else {
      console.log("Filtering programmes for faculty:", selectedFaculty);

      setFilteredProgrammes(
        programmes.filter(
          (p) => p.programme_faculty === selectedFaculty
        )
      );
    }

    fetchProgrammes(selectedFaculty);
  }, [selectedFaculty]);

  return (
    <section className="py-16 bg-white md:mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#222222] mb-4">
            Search by study area...
            <span className="block h-1 w-20 bg-blue-600 mx-auto mt-2 rounded-sm"></span>
          </h2>
        </div>

        <div className="flex justify-center mb-10">
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="border border-gray-400 rounded-md px-4 py-2 w-full max-w-md"
          >
            {FACULTIES.map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center">Loading programmes...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProgrammes.map((programme) => (
              <Card
                key={programme._id}
                className="hover:shadow-lg transition-shadow border-[#8ecae6] overflow-hidden cursor-pointer"
                onClick={() =>
                  navigate(`/programme/${programme.programme_code}`, {
                    state: {
                      programme_name: programme.programme_name,
                      programme_code: programme.programme_code,
                      programme_description: programme.programme_description,
                      SIQF_level: programme.SIQF_level,
                      programme_faculty: programme.programme_faculty,
                      programme_department: programme.programme_department,
                      programme_credits: programme.programme_credits,
                      programme_entry_requirement: programme.programme_entry_requirement,
                      programme_year: programme.programme_year,
                      programme_study_type: programme.programme_study_type,
                      programme_location: programme.programme_location,
                      programme_study_period: programme.programme_study_period,
                      programme_english_requirement: programme.programme_english_requirement,
                      programme_units: programme.programme_units,
                    },
                  })
                }
              >
                {programme.programme_image && (
                  <div className="relative h-48">
                    <OptimizedImage
                      src={programme.programme_image}
                      alt={programme.programme_name}
                      className="w-full h-full"
                      objectFit="cover"
                    />
                    <div className="absolute inset-0 bg-[#082952]/20"></div>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl text-[#222222]">{programme.programme_name}</CardTitle>
                  <CardDescription className="text-[#ffb703] font-medium">
                    {programme.programme_study_period}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-[#082952] line-clamp-3">{programme.programme_description}</p>
                </CardContent>
              </Card>

            ))}

            {filteredProgrammes.length === 0 && (
              <p className="text-center col-span-full text-gray-500">
                No programmes found for selected faculty.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default StudyOptionsSection;
