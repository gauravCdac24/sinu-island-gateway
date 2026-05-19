import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminForumFetch } from "@/lib/forumApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, MessageSquare, ChevronRight } from "lucide-react";
import { toast } from "sonner";

type SubmissionRow = {
  id: string;
  categoryTitle?: string;
  studentName: string;
  subject: string | null;
  body: string;
  status: string;
  isPublic: boolean;
  createdAt: string;
  replyCount?: number;
};

const statusColors: Record<string, string> = {
  open: "bg-amber-100 text-amber-800",
  in_review: "bg-blue-100 text-blue-800",
  answered: "bg-emerald-100 text-emerald-800",
  closed: "bg-gray-100 text-gray-700",
};

const AdminForumList = () => {
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const q = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const data = (await adminForumFetch(`/admin/forum/submissions${q}`)) as {
        submissions: SubmissionRow[];
        statusCounts: Record<string, number>;
      };
      setSubmissions(data.submissions);
      setStatusCounts(data.statusCounts || {});
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0b2c55]">Student–Management Forum</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review student questions from the SINUSA–Management Dialogue and post
          management responses.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {["open", "in_review", "answered", "closed"].map((s) => (
          <Card key={s}>
            <CardContent className="pt-4">
              <p className="text-xs uppercase text-gray-500">{s.replace("_", " ")}</p>
              <p className="text-2xl font-bold text-[#0b2c55]">
                {statusCounts[s] ?? 0}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_review">In review</SelectItem>
            <SelectItem value="answered">Answered</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#219ebc]" />
        </div>
      ) : submissions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-gray-500">
            <MessageSquare className="mb-3 h-10 w-10 opacity-40" />
            No student questions match this filter.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <Card key={s.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge variant="outline">{s.categoryTitle}</Badge>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        statusColors[s.status] || statusColors.open
                      }`}
                    >
                      {s.status.replace("_", " ")}
                    </span>
                    {s.isPublic && (
                      <Badge className="bg-[#219ebc]">Public</Badge>
                    )}
                  </div>
                  <CardTitle className="text-base">
                    {s.subject || "Student question"}
                  </CardTitle>
                  <p className="mt-1 text-xs text-gray-500">
                    {s.studentName} · {new Date(s.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button asChild variant="outline" size="sm" className="shrink-0">
                  <Link to={`/admin/forum/${s.id}`}>
                    Respond
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-gray-700">{s.body}</p>
                {(s.replyCount ?? 0) > 0 && (
                  <p className="mt-2 text-xs text-gray-500">
                    {s.replyCount} response(s)
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminForumList;
