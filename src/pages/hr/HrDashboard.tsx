import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Loader2, PlusCircle } from "lucide-react";
import { hrFetch } from "@/lib/hrApi";

type HrStats = {
  counts: {
    published: number;
    draft: number;
    archived: number;
    pendingJobs: number;
    totalApplications: number;
    pendingApplications: number;
    reviewedApplications: number;
  };
  applicationsByVacancy: { vacancyNo: string; title: string; count: number }[];
  jobStatusPie: { name: string; value: number }[];
};

const PIE_COLORS = ["#082952", "#ffb703", "#94a3b8"];

const HrDashboard = () => {
  const [stats, setStats] = useState<HrStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = (await hrFetch("/hr/stats")) as HrStats;
        if (!cancelled) setStats(data);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (err || !stats) {
    return <p className="text-center text-red-600">{err || "No data"}</p>;
  }

  const barData = stats.applicationsByVacancy.map((v) => ({
    name: v.vacancyNo,
    full: v.title,
    applications: v.count,
  }));

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#082952]">HR Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Job postings, applications, and recruitment analytics
          </p>
        </div>
        <Button asChild className="bg-[#ffb703] text-[#082952] hover:bg-[#082952] hover:text-white">
          <Link to="/hr/jobs/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create job posting
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Published jobs", value: stats.counts.published, accent: "bg-emerald-100 text-emerald-900" },
          { label: "Draft / pending", value: stats.counts.draft, accent: "bg-amber-100 text-amber-900" },
          { label: "Applications received", value: stats.counts.totalApplications, accent: "bg-[#082952]/10 text-[#082952]" },
          { label: "Archived jobs", value: stats.counts.archived, accent: "bg-gray-200 text-gray-800" },
        ].map((c) => (
          <Card key={c.label}>
            <CardContent className="pt-6">
              <p className="text-xs font-semibold uppercase text-muted-foreground">{c.label}</p>
              <p className={`mt-2 text-3xl font-bold ${c.accent} inline-flex rounded-lg px-3 py-1`}>
                {c.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#082952]">Jobs by status</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.jobStatusPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {stats.jobStatusPie.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[#082952]">Applications per vacancy</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} />
                <Tooltip
                  labelFormatter={(_, p) => {
                    const row = p?.[0]?.payload as { full?: string };
                    return row?.full || "";
                  }}
                />
                <Bar dataKey="applications" fill="#082952" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Pending application reviews</p>
            <p className="text-2xl font-bold text-[#082952]">{stats.counts.pendingApplications}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Reviewed applications</p>
            <p className="text-2xl font-bold text-[#082952]">{stats.counts.reviewedApplications}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HrDashboard;
