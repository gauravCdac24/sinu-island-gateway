import { useState } from "react";
import axios from "axios";


interface PdfFile {
  _id: string;
  filename: string;
  data: Buffer;
  mimetype: string;
}

export default function PoliciesSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL;

  const handleSearch = async () => {
    setLoading(true);

    try {
      let res;

      if (!query.trim()) {
        // If input empty → fetch all files
        res = await axios.get<PdfFile[]>(
          `${API_BASE}/policy_files/all`
        );
      } else {
        // Search by query
        res = await axios.get<PdfFile[]>(
          `${API_BASE}/policy_files/search/${query}`
        );
      }

      console.log("Results:", res.data);
      setResults(res.data || []);
    } catch (err) {
      console.error("Search error:", err);
    }

    setLoading(false);
  };

  return (
    <section
      id="policies-search"
      className="p-4 sm:p-10 max-w-full sm:max-w-2xl lg:max-w-3xl mx-auto"
    >
      <h2 className="text-xl sm:text-4xl font-bold mb-8 text-center sm:text-left">
        Browse Our Policy Library
      </h2>

      {/* Search bar */}
      <div className="flex flex-col sm:flex gap-3 mb-8 w-full">
        <input
          type="text"
          placeholder="Search by filename or keywords..."
          className="border px-3 py-2 rounded w-full sm:flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-xl text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Search
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-center">Searching...</p>}

      {/* No results */}
      {!loading && results.length === 0 && query !== "" && (
        <p className="text-gray-600 text-center">No files found.</p>
      )}

      {/* Results */}
      <ul className="space-y-3 mt-4">
        {results.map((file) => (
          <li
            key={file._id}
            className="border p-3 rounded flex flex-col sm:flex-row justify-between bg-black/30 sm:items-center gap-2"
          >
            <span className="break-words font-bold">{file.filename}</span>

            <a
              href={`${API_BASE}${API_HOST}:${API_PORT}/policy_files/file/${file._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm sm:text-base"
            >
              View / Download Policy
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
