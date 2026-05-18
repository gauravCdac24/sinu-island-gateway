import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VacanciesTable from "@/components/jobs/VacanciesTable";
import { fetchOpenVacancies, type PublicVacancy } from "@/lib/jobVacanciesApi";
import { Loader2, FileText, MapPin, Monitor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const scrollToVacancies = () => {
  document.getElementById("current-vacancies")?.scrollIntoView({ behavior: "smooth" });
};

const RECRUITMENT_EMAIL = "sinu.recruitment@sinu.edu.sb";

type JobsContentProps = {
  vacancies?: PublicVacancy[];
  loading?: boolean;
};

const JobsContent = ({ vacancies: propVacancies, loading: propLoading }: JobsContentProps) => {
  const [vacancies, setVacancies] = useState<PublicVacancy[]>(propVacancies ?? []);
  const [loading, setLoading] = useState(propLoading ?? !propVacancies);

  useEffect(() => {
    if (propVacancies) return;
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchOpenVacancies();
        if (!cancelled) setVacancies(rows);
      } catch {
        if (!cancelled) setVacancies([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [propVacancies]);

  return (
    <div className="bg-[#f4f7fb]">
      {/* Intro */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-2 md:w-3 shrink-0 bg-[#ffb703]" aria-hidden />
            <CardContent className="flex-1 py-8 md:py-10 px-6 md:px-10">
              <p className="text-gray-800 leading-relaxed text-base md:text-lg">
                The Solomon Islands National University is the national university of the country. It
                is a dual-sector university, offering programmes in Higher Education as well as TVET.
                SINU enrolled over seven thousand full-time students during 2019. The demand for SINU
                programmes is growing rapidly. The University operates from 3 campuses in Honiara, and
                a number of distance education and outreach sections in various parts of the country.
              </p>
              <p className="mt-6 text-[#082952] font-semibold text-lg">
                The University is looking for suitably qualified, experienced and dynamic persons for
                the following positions:
              </p>
            </CardContent>
          </div>
        </Card>
      </section>

      {/* Vacancies */}
      <section
        id="current-vacancies"
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16 scroll-mt-24"
      >
        <Card className="border-0 shadow-md">
          <CardHeader className="bg-[#082952] text-white rounded-t-lg pb-6">
            <CardTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-[#ffb703]" aria-hidden />
              Current job opportunities
            </CardTitle>
            <p className="text-[#8ecae6] text-sm mt-2 font-normal">
              Note: some JDs for some positions are not attached below — email{" "}
              <a
                href={`mailto:${RECRUITMENT_EMAIL}`}
                className="underline font-semibold text-white hover:text-[#ffb703]"
              >
                {RECRUITMENT_EMAIL}
              </a>{" "}
              or visit the HR Department at Kukum Campus.
            </p>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-6">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-[#22a2bf]" />
              </div>
            ) : (
              <VacanciesTable vacancies={vacancies} showApply />
            )}
          </CardContent>
        </Card>
      </section>

      {/* Requirements & submission */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-[#082952]">Required documents</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-3 text-gray-700 text-sm md:text-base">
                <li>A cover letter</li>
                <li>Curriculum Vitae</li>
                <li>
                  <a
                    href="/templates/SINU-JOB-APPLICATION-TEMPLATE.docx"
                    className="text-[#22a2bf] underline font-medium"
                    download
                  >
                    SINU-JOB-APPLICATION-TEMPLATE
                  </a>{" "}
                  (or complete the online form via Apply Now)
                </li>
                <li>
                  <strong>Certified copies</strong> of certificates and transcripts — uncertified
                  copies will not be considered
                </li>
                <li>Reference letter (optional online; recommended)</li>
              </ol>
              <p className="mt-6 text-sm text-gray-700 border-t pt-4">
                <strong className="text-[#082952]">Medical and Police Report:</strong> Successful
                applicants must provide a police clearance and medical certificate before taking up
                the position.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-[#082952] flex items-center gap-2">
                <Monitor className="h-5 w-5 text-[#22a2bf]" aria-hidden />
                How to apply
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 text-sm md:text-base">
              <div className="rounded-lg bg-[#edf4ff] p-4">
                <p className="font-semibold text-[#082952] mb-2">Apply online</p>
                <p className="text-sm text-gray-700 mb-3">
                  Click <strong>Apply Now</strong> next to your chosen vacancy in the table above,
                  or use the button below.
                </p>
                <Button
                  type="button"
                  size="sm"
                  className="bg-[#ffb703] text-[#082952] font-semibold hover:bg-[#082952] hover:text-white"
                  onClick={scrollToVacancies}
                >
                  View vacancies &amp; apply online
                </Button>
              </div>
              <p className="text-center font-semibold text-gray-500 text-sm">OR</p>
              <div className="rounded-lg bg-gray-50 p-4 flex gap-3">
                <MapPin className="h-5 w-5 text-[#ffb703] shrink-0 mt-0.5" aria-hidden />
                <address className="not-italic leading-relaxed text-sm">
                  Sealed and hand-delivered to the HR Department at Kukum Campus, or mailed to:
                  <br />
                  <br />
                  “Position Title”
                  <br />
                  The Director Human Resources
                  <br />
                  Human Resources Department
                  <br />
                  Solomon Islands National University
                  <br />
                  P.O Box R113, Honiara
                  <br />
                  Attention: Secretary
                </address>
              </div>
              <p className="font-bold text-[#082952] text-center pt-2 border-t">
                Late or incomplete applications will not be considered.
              </p>
            </CardContent>
          </Card>
        </div>

        <p className="text-center mt-10">
          <Link
            to="/jobs-vacancies/archived"
            className="inline-flex items-center gap-2 text-[#22a2bf] font-medium italic hover:underline text-base"
          >
            View job archives →
          </Link>
        </p>
      </section>
    </div>
  );
};

export default JobsContent;
