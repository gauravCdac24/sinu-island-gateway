import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { hrFetch } from "@/lib/hrApi";
import { Badge } from "@/components/ui/badge";

type AppRow = {
  id: string;
  vacancyNo: string;
  positionTitle: string;
  fullName: string;
  email: string;
  status: string;
  createdAt: string;
};

const HrApplications = () => {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = (await hrFetch("/hr/applications")) as { applications: AppRow[] };
        setApps(data.applications);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <h1 className="text-2xl font-bold text-[#082952]">Job applications</h1>
      {apps.length === 0 ? (
        <p className="text-muted-foreground italic">No applications yet.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg bg-white">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-[#082952] text-white">
              <tr>
                <th className="px-4 py-3 text-left">Applicant</th>
                <th className="px-4 py-3 text-left">Vacancy</th>
                <th className="px-4 py-3 text-left">Position</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a, i) => (
                <tr key={a.id} className={i % 2 ? "bg-gray-50" : ""}>
                  <td className="px-4 py-3">
                    <Link to={`/hr/applications/${a.id}`} className="font-medium text-[#22a2bf] hover:underline">
                      {a.fullName}
                    </Link>
                    <p className="text-xs text-muted-foreground">{a.email}</p>
                  </td>
                  <td className="px-4 py-3">{a.vacancyNo}</td>
                  <td className="px-4 py-3">{a.positionTitle}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{a.status}</Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(a.createdAt).toLocaleString()}
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

export default HrApplications;
