import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/common/BackToTop";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import JobsHero from "@/components/jobs/JobsHero";
import VacanciesTable from "@/components/jobs/VacanciesTable";
import { fetchArchivedVacancies, fetchVacancyDetail } from "@/lib/jobVacanciesApi";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const JobsArchived = () => {
  const [searchParams] = useSearchParams();
  const viewNo = searchParams.get("view")?.trim() || "";
  const [vacancies, setVacancies] = useState<
    { vacancyNo: string; position: string; facultyDepartment: string; dueDate: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchArchivedVacancies();
        if (!cancelled) setVacancies(rows);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!viewNo) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchVacancyDetail(viewNo);
        if (!cancelled && data.vacancy) setDetail(data.vacancy as Record<string, unknown>);
      } catch {
        if (!cancelled) setDetail(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [viewNo]);

  return (
    <div className="relative min-h-screen flex flex-col bg-university-light-gray/50">
      <Header />

      <div className="relative z-10">
        <ErrorBoundary>
          <JobsHero variant="archived" />
        </ErrorBoundary>
      </div>

      <main className="relative z-10 flex-grow w-full bg-[#f4f7fb]">
        <section
          id="archived-vacancies"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 scroll-mt-24"
        >
          <Card className="border-0 shadow-md">
            <CardHeader className="bg-[#082952] text-white rounded-t-lg">
              <CardTitle className="text-xl md:text-2xl font-bold">Archived positions</CardTitle>
              <p className="text-[#8ecae6] text-sm mt-1 font-normal">
                These roles are closed — applications are no longer accepted.
              </p>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-6">
              {loading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-10 w-10 animate-spin text-[#22a2bf]" />
                </div>
              ) : (
                <VacanciesTable vacancies={vacancies} showApply={false} />
              )}
            </CardContent>
          </Card>

          {viewNo && detail && (
            <Card className="mt-10 border-0 shadow-md border-l-4 border-l-[#ffb703]">
              <CardHeader>
                <CardTitle className="text-[#082952]">
                  {String(detail.position)} ({viewNo})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-gray-800">
                <p>
                  <strong>Department:</strong> {String(detail.facultyDepartment)}
                </p>
                {detail.salaryRange != null && (
                  <p>
                    <strong>Salary:</strong> {String(detail.salaryRange)}
                  </p>
                )}
                {detail.mainDuties != null && (
                  <div>
                    <strong>Main duties:</strong>
                    <p className="mt-1 whitespace-pre-wrap">{String(detail.mainDuties)}</p>
                  </div>
                )}
                {detail.qualificationsRequired != null && (
                  <div>
                    <strong>Qualifications:</strong>
                    <p className="mt-1 whitespace-pre-wrap">
                      {String(detail.qualificationsRequired)}
                    </p>
                  </div>
                )}
                <Link
                  to="/jobs-vacancies"
                  className="inline-block text-[#22a2bf] font-medium hover:underline"
                >
                  ← View current openings
                </Link>
              </CardContent>
            </Card>
          )}

          <p className="text-center mt-10">
            <Link
              to="/jobs-vacancies"
              className="text-[#22a2bf] font-medium hover:underline"
            >
              Back to Job Opportunities
            </Link>
          </p>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default JobsArchived;
