import React, { useEffect, useMemo, useState } from "react";
import { getApiBaseUrl } from "@/lib/apiBase";
import { authHeaders, getAdminToken } from "@/lib/authStorage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Loader2 } from "lucide-react";

type Stats = {
  counts: {
    pending: number;
    approved: number;
    rejected: number;
    total: number;
    registered: number;
  };
  byProgramme: { programme_code: string; programme_name: string; count: number }[];
};

const PIE_COLORS = ["#0b2c55", "#219ebc", "#ffb703", "#94a3b8"];

const AdminDashboard = () => {
  const API = getApiBaseUrl();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [programmeFilter, setProgrammeFilter] = useState<string>("all");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await fetch(`${API}/admin/stats`, { headers: authHeaders(getAdminToken()) });
        if (!res.ok) {
          if (res.status === 401) throw new Error("Session expired");
          throw new Error("Failed to load");
        }
        const data = (await res.json()) as Stats;
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
  }, [API]);

  const pieData = stats
    ? [
        { name: "Pending", value: stats.counts.pending },
        { name: "Approved", value: stats.counts.approved },
        { name: "Rejected", value: stats.counts.rejected },
      ]
    : [];

  const barData = useMemo(
    () =>
      stats?.byProgramme.map((p) => ({
        code: p.programme_code,
        name: p.programme_code || p.programme_name.slice(0, 12),
        full: p.programme_name,
        applications: p.count,
      })) ?? [],
    [stats?.byProgramme]
  );

  const filteredBarData = useMemo(() => {
    if (programmeFilter === "all") return barData;
    return barData.filter((row) => row.code === programmeFilter);
  }, [barData, programmeFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (err || !stats) {
    return <p className="text-center text-red-600">{err || "No data"}</p>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0b2c55]">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of student applications</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total applications", value: stats.counts.total, accent: "bg-[#0b2c55]/10 text-[#0b2c55]" },
          { label: "Pending review", value: stats.counts.pending, accent: "bg-amber-100 text-amber-900" },
          { label: "Approved", value: stats.counts.approved, accent: "bg-emerald-100 text-emerald-900" },
          { label: "Rejected", value: stats.counts.rejected, accent: "bg-red-100 text-red-900" },
        ].map((c) => (
          <Card key={c.label} className="border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{c.label}</p>
              <p className={`mt-2 inline-flex rounded-lg px-3 py-1 text-3xl font-bold ${c.accent}`}>{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#0b2c55]">Applications by status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="space-y-3">
            <div>
              <CardTitle className="text-lg text-[#0b2c55]">First-choice programme (applications)</CardTitle>
              <p className="text-xs text-muted-foreground">Count of applicants per programme (priority 1)</p>
            </div>
            <div className="flex max-w-md flex-col gap-2">
              <Label htmlFor="prog-filter" className="text-xs font-medium text-muted-foreground">
                Filter by programme
              </Label>
              <Select value={programmeFilter} onValueChange={setProgrammeFilter}>
                <SelectTrigger id="prog-filter" className="h-9">
                  <SelectValue placeholder="All programmes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All programmes</SelectItem>
                  {stats.byProgramme.map((p) => (
                    <SelectItem key={p.programme_code} value={p.programme_code}>
                      {p.programme_name} ({p.programme_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredBarData} margin={{ top: 8, right: 8, left: 0, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-35} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} />
                <Tooltip
                  formatter={(value: number) => [value, "Applications"]}
                  labelFormatter={(_, p) => {
                    const row = p?.[0]?.payload as { full?: string } | undefined;
                    return row?.full || "";
                  }}
                />
                <Bar dataKey="applications" fill="#0b2c55" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
