import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Programme {
  _id: string;
  programme_name: string;
  programme_code: string;
  programme_description?: string;
  programme_image?: string;
  programme_credits: number;
  programme_study_period: string;
  programme_level: string;
  programme_faculty: string;
  programme_department: string;
  programme_entry_requirement: string;
  programme_year: number;
  programme_study_type: string[];
  programme_location: string;
  programme_english_requirement: string;
  SIQF_level: string;

}

const PostgraduateStudyOptions: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [results, setResults] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const API_BASE = "http://10.80.210.65:7000";

  /* ---------------- BUTTON SEARCH ---------------- */
  const handleSearch = async () => {
    const query = searchInput.trim();
    if (!query) return;

    try {
      setLoading(true);
      setError("");
      setHasSearched(true);

      const params = new URLSearchParams({
        programme_name: query,
      });
      console.log("Searching with params:", params.toString());
      const res = await fetch(
        `${API_BASE}/programme_catalogue/postgraduate_search?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error("No programmes found");
      }

      const data = await res.json();
      setResults(data.data || []);
    } catch (err) {
      setError("Failed to fetch programmes");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:pt-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#222222]">
          Postgraduate Degrees
        </h2>
        <span className="block h-1 w-20 bg-blue-600 mx-auto mt-2 rounded-sm"></span>
        <p className="text-lg text-[#082952] max-w-3xl mx-auto md:mt-4">
            Choose from our range of postgraduate programs designed to prepare you for success 
            in your chosen career while contributing to the development of the Solomon Islands.
          </p>
      </div>

      <label className="text-lg font-medium text-[#222222]">
        Degree you are looking for:
      </label>

      {/* INPUT + SEARCH BUTTON */}
      <div className="flex mt-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by programme name..."
          className="flex-1 px-4 py-2 border border-gray-600 rounded-l-md focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSearch}
          disabled={!searchInput.trim() || loading}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {/* STATUS */}
      {hasSearched && (
        <div className="mt-6">
          {loading && <p>Loading programmes...</p>}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      )}

          {results.map((programme) => (
            <div
              key={programme._id}
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
                  },
                })
              }
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
            >
              {programme.programme_image && (
                <img
                  src={programme.programme_image}
                  alt={programme.programme_name}
                  className="w-full h-56 object-cover"
                />
              )}

              <div className="p-6">
                <h3 className="text-2xl font-semibold text-gray-800">
                  {programme.programme_name}
                </h3>

                {programme.programme_description && (
                  <p className="mt-2 text-gray-600 line-clamp-3">
                    {programme.programme_description}
                  </p>
                )}

                <p className="mt-4 text-blue-600 font-medium">
                  Credits: {programme.programme_credits}
                </p>

                <p className="mt-2 text-blue-600 font-medium">
                  Availability: {programme.programme_study_period}
                </p>
              </div>
            </div>
          ))}

        </div>
  );
};

export default PostgraduateStudyOptions;
