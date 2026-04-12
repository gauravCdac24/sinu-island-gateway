import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Search, Loader2, ChevronRight, BookOpen, MapPin } from "lucide-react";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import OptimizedImage from "@/components/common/OptimizedImage";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "@/lib/apiBase";
import { cn } from "@/lib/utils";

type ProgrammeResult = {
  programme_name?: string;
  programme_code?: string;
  programme_credits?: number | string;
  programme_faculty?: string;
  programme_location?: string;
  programme_level?: string;
  programme_description?: unknown;
  SIQF_level?: unknown;
  programme_department?: unknown;
  programme_entry_requirement?: unknown;
  programme_year?: unknown;
  programme_study_type?: unknown;
  programme_study_period?: unknown;
  programme_english_requirement?: unknown;
  programme_units?: unknown;
};

async function readJsonOrThrow(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    await res.text();
    throw new Error(
      "The server returned a page instead of JSON. The API base URL may point at the frontend (wrong port). Use VITE_API_URL, VITE_API_URL_7000, or VITE_API_HOST + VITE_API_PORT for the Express backend."
    );
  }
  return res.json();
}

const CourseFinder = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [scrolled, setScrolled] = useState(0);
  const [results, setResults] = useState<ProgrammeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const API_BASE = getApiBaseUrl();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const trimmedQuery = searchQuery.trim();

      if (trimmedQuery.length === 4) {
        const res = await fetch(`${API_BASE}/programme_catalogue/code/${trimmedQuery}`);
        if (!res.ok) {
          setResults([]);
          setError("Programme not found");
        } else {
          const data = (await readJsonOrThrow(res)) as Record<string, unknown>;
          setResults([data as ProgrammeResult]);
        }
      } else {
        const params = new URLSearchParams({
          programme_name: trimmedQuery || "all",
          programme_level: selectedLevel,
          programme_faculty: selectedFaculty,
        });

        const res = await fetch(`${API_BASE}/programme_catalogue/search?${params.toString()}`);
        if (!res.ok) {
          setResults([]);
          setError("No programmes found");
        } else {
          const data = (await readJsonOrThrow(res)) as { data?: unknown[] };
          setResults(Array.isArray(data.data) ? (data.data as ProgrammeResult[]) : []);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to fetch programmes");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const imagePush = Math.min(scrolled, 200);

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f7fb]">
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>

      <main className="flex-grow">
        {/* Hero — unchanged structure, refined overlay */}
        <div className="relative h-[70vh] overflow-hidden bg-[#023047] lg:h-[min(92vh,900px)]">
          <div
            className="absolute inset-0"
            style={{ transform: `translateY(${imagePush}px)` }}
          >
            <OptimizedImage
              src="/lovable-uploads/DSC05873.jpg"
              alt="SINU campus"
              className="h-full w-full object-cover"
              priority
              width={1920}
              height={1080}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#023047]/90 via-[#023047]/35 to-transparent"
              aria-hidden
            />
            <div
              className="
                absolute inset-x-0 bottom-16 z-10 flex justify-center px-4
                sm:inset-x-auto sm:bottom-20 sm:left-8 md:left-12 sm:justify-start
              "
            >
              <div
                className="
                  w-full max-w-lg rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-md
                  sm:max-w-xl md:max-w-2xl md:p-8
                "
              >
                <p className="text-xs font-bold uppercase tracking-widest text-university-blue">
                  Programme catalogue
                </p>
                <h1 className="mt-2 font-bold text-2xl leading-tight text-university-dark-gray sm:text-3xl md:text-4xl">
                  Search and explore our programmes
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
                  Filter by faculty and level, or search by name. Use a four-letter code for an exact match.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & results */}
        <section className="relative z-10 -mt-6 rounded-t-3xl bg-gradient-to-b from-[#eef3f9] to-[#f4f7fb] px-4 pb-16 pt-2 sm:-mt-8">
          <div className="container mx-auto max-w-5xl">
            <Card className="overflow-hidden border border-gray-200/90 bg-white shadow-xl shadow-[#0b2c55]/[0.07]">
              <div className="border-b border-gray-100 bg-gradient-to-r from-[#0b2c55]/[0.03] to-transparent px-6 py-6 sm:px-8 sm:py-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-university-dark-gray md:text-3xl">
                      Find a programme
                    </h2>
                    <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                      Narrow your search, then open a programme for full details and entry requirements.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="shrink-0 border-university-blue/40 text-university-blue hover:bg-university-light-blue/30"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedLevel("all");
                      setSelectedFaculty("all");
                      setResults([]);
                      setError("");
                      setHasSearched(false);
                    }}
                  >
                    Reset filters
                  </Button>
                </div>
              </div>

              <CardContent className="space-y-8 p-6 sm:p-8">
                <form onSubmit={handleSearch} className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="faculty" className="text-university-dark-gray">
                        Faculty / school
                      </Label>
                      <select
                        id="faculty"
                        className={cn(
                          "h-12 w-full rounded-lg border border-gray-200 bg-white px-3 text-base",
                          "shadow-sm transition-colors focus:border-university-blue focus:outline-none focus:ring-2 focus:ring-university-blue/25"
                        )}
                        value={selectedFaculty}
                        onChange={(e) => setSelectedFaculty(e.target.value)}
                      >
                        <option value="all">All faculties</option>
                        <option value="Faculty of Science and Technology">Science &amp; Technology</option>
                        <option value="Faculty of Education and Humanities">Education &amp; Humanities</option>
                        <option value="Faculty of Business & Tourism Studies">Business &amp; Tourism</option>
                        <option value="Faculty of Nursing, Medicine and  Health Sciences">
                          Nursing, Medicine &amp; Health
                        </option>
                        <option value="Faculty of Agriculture, Forestry and Fisheries">
                          Agriculture &amp; Fisheries
                        </option>
                        <option value="SINU TAFE School of Technology">TAFE &amp; TVET</option>
                        <option value="Solomon Islands Maritime College">Maritime</option>
                        <option value="Center for Distance & Flexible Learning">Distance &amp; flexible learning</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="level" className="text-university-dark-gray">
                        Course level
                      </Label>
                      <select
                        id="level"
                        className={cn(
                          "h-12 w-full rounded-lg border border-gray-200 bg-white px-3 text-base",
                          "shadow-sm transition-colors focus:border-university-blue focus:outline-none focus:ring-2 focus:ring-university-blue/25"
                        )}
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                      >
                        <option value="all">All levels</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                        <option value="technical_and_trade">Technical &amp; trade</option>
                        <option value="University Preparatory Certificate">University preparatory</option>
                        <option value="Double Major">Double major</option>
                        <option value="Certificate">Certificate</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="search-query" className="text-university-dark-gray">
                      Keywords or 4-letter programme code
                    </Label>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch sm:gap-0">
                      <div className="flex min-h-[3.5rem] flex-1 items-center overflow-hidden rounded-xl border-2 border-[#0b2c55]/20 bg-white shadow-inner focus-within:border-university-blue focus-within:ring-2 focus-within:ring-university-blue/20">
                        <Search className="ml-4 h-5 w-5 shrink-0 text-gray-400" aria-hidden />
                        <Input
                          id="search-query"
                          type="text"
                          placeholder="e.g. nursing, business, or ABCD"
                          className="h-14 flex-1 border-0 bg-transparent text-base focus-visible:ring-0 sm:text-lg"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="h-14 shrink-0 rounded-xl bg-[#0b2c55] px-8 font-semibold hover:bg-[#d7a12c] sm:ml-3 sm:rounded-xl"
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <Search className="mr-2 h-5 w-5" />
                            Search
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <Alert className="border-amber-200/80 bg-amber-50/90 text-amber-950">
                    <AlertTriangle className="h-4 w-4 text-amber-700" />
                    <AlertTitle className="text-amber-950">SIQF alignment</AlertTitle>
                    <AlertDescription className="text-amber-950/90">
                      SINU is reviewing programmes for the Solomon Islands Qualifications Framework (SIQF).
                      Published levels may be updated; confirm details on your offer and transcript.
                    </AlertDescription>
                  </Alert>
                </form>

                {/* Results */}
                <div className="border-t border-gray-100 pt-8">
                  {loading && (
                    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                      <Loader2 className="h-10 w-10 animate-spin text-university-blue" />
                      <p className="text-sm font-medium">Searching programmes…</p>
                    </div>
                  )}

                  {!loading && error && (
                    <div
                      className="rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-center text-sm font-medium text-red-800"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}

                  {!loading && !error && hasSearched && results.length === 0 && (
                    <p className="py-12 text-center text-muted-foreground">
                      No programmes matched your filters. Try different keywords or reset filters.
                    </p>
                  )}

                  {!loading && results.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-university-dark-gray">
                        {results.length} programme{results.length === 1 ? "" : "s"} found
                      </p>
                      <ul className="space-y-3">
                        {results.map((course, idx) => (
                          <li key={`${course.programme_code ?? idx}-${idx}`}>
                            <Card
                              className={cn(
                                "group cursor-pointer overflow-hidden border border-gray-200/90 bg-white",
                                "transition-all duration-200 hover:border-university-blue/40 hover:shadow-lg hover:shadow-university-blue/5"
                              )}
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
                              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="inline-flex items-center rounded-md bg-university-light-blue/40 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-university-blue">
                                      {course.programme_code || "—"}
                                    </span>
                                    {course.programme_level && (
                                      <span className="text-xs text-muted-foreground">{course.programme_level}</span>
                                    )}
                                  </div>
                                  <h3 className="mt-2 font-semibold text-lg leading-snug text-university-dark-gray group-hover:text-university-blue md:text-xl">
                                    {course.programme_name}
                                  </h3>
                                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                    {course.programme_faculty && (
                                      <span className="inline-flex items-center gap-1">
                                        <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                        {course.programme_faculty}
                                      </span>
                                    )}
                                    {course.programme_location && (
                                      <span className="inline-flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                                        {course.programme_location}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end">
                                  <span className="rounded-full bg-[#0b2c55]/10 px-4 py-1.5 text-sm font-bold text-[#0b2c55]">
                                    {course.programme_credits != null && course.programme_credits !== ""
                                      ? `${course.programme_credits} credits`
                                      : "—"}
                                  </span>
                                  <span className="flex items-center text-sm font-semibold text-university-blue">
                                    View details
                                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                  </span>
                                </div>
                              </CardContent>
                            </Card>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {!loading && !hasSearched && (
                    <p className="py-10 text-center text-sm text-muted-foreground">
                      Choose filters and click <strong>Search</strong> to see programmes.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </div>
  );
};

export default CourseFinder;
