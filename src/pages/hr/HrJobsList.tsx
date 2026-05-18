import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, Pencil, XCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { hrFetch } from "@/lib/hrApi";

type VacancyRow = {
  id: string;
  vacancyNo: string;
  position: string;
  facultyDepartment: string;
  dueDate: string;
  status: string;
  applicationCount: number;
};

const HrJobsList = () => {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "";
  const [vacancies, setVacancies] = useState<VacancyRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const q = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const data = (await hrFetch(`/hr/vacancies${q}`)) as { vacancies: VacancyRow[] };
      setVacancies(data.vacancies);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [statusFilter]);

  const publish = async (id: string) => {
    try {
      await hrFetch(`/hr/vacancies/${id}/publish`, { method: "POST" });
      toast.success("Job published");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Publish failed");
    }
  };

  const closeJob = async (id: string) => {
    if (!confirm("Close this posting? It will move to archived jobs.")) return;
    try {
      await hrFetch(`/hr/vacancies/${id}/close`, { method: "POST" });
      toast.success("Job closed and archived");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Close failed");
    }
  };

  const title =
    statusFilter === "archived"
      ? "Archived jobs"
      : statusFilter === "published"
        ? "Published jobs"
        : statusFilter === "draft"
          ? "Draft jobs"
          : "All job postings";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#082952]">{title}</h1>
          <div className="flex gap-2 mt-2 text-sm">
            <Link to="/hr/jobs" className={!statusFilter ? "font-bold text-[#082952]" : "text-[#22a2bf]"}>
              All
            </Link>
            <Link
              to="/hr/jobs?status=draft"
              className={statusFilter === "draft" ? "font-bold text-[#082952]" : "text-[#22a2bf]"}
            >
              Draft
            </Link>
            <Link
              to="/hr/jobs?status=published"
              className={statusFilter === "published" ? "font-bold text-[#082952]" : "text-[#22a2bf]"}
            >
              Published
            </Link>
            <Link
              to="/hr/jobs?status=archived"
              className={statusFilter === "archived" ? "font-bold text-[#082952]" : "text-[#22a2bf]"}
            >
              Archived
            </Link>
          </div>
        </div>
        <Button asChild className="bg-[#ffb703] text-[#082952]">
          <Link to="/hr/jobs/new">Create job</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : vacancies.length === 0 ? (
        <p className="text-muted-foreground italic">No jobs in this category.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg bg-white">
          <table className="w-full text-sm text-left min-w-[720px]">
            <thead className="bg-[#082952] text-white">
              <tr>
                <th className="px-4 py-3">Vacancy No.</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Due</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Apps</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vacancies.map((v, i) => (
                <tr key={v.id} className={i % 2 ? "bg-gray-50" : "bg-white"}>
                  <td className="px-4 py-3 font-medium">{v.vacancyNo}</td>
                  <td className="px-4 py-3">{v.position}</td>
                  <td className="px-4 py-3">{v.facultyDepartment}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{v.dueDate}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        v.status === "published"
                          ? "default"
                          : v.status === "archived"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {v.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{v.applicationCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-1 flex-wrap">
                      <Button size="sm" variant="ghost" asChild title="View public">
                        <a
                          href={
                            v.status === "archived"
                              ? `/jobs-vacancies/archived`
                              : `/jobs-vacancies`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Eye className="h-4 w-4" />
                        </a>
                      </Button>
                      {v.status !== "archived" && (
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/hr/jobs/${v.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {v.status === "draft" && (
                        <Button size="sm" variant="ghost" onClick={() => void publish(v.id)}>
                          <Send className="h-4 w-4 text-green-700" />
                        </Button>
                      )}
                      {v.status === "published" && (
                        <Button size="sm" variant="ghost" onClick={() => void closeJob(v.id)}>
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HrJobsList;
