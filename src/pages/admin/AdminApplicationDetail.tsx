import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApiBaseUrl } from "@/lib/apiBase";
import { authHeaders, getAdminToken } from "@/lib/authStorage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";

type Doc = {
  category: string;
  storedFileName: string;
  originalName: string;
};

type Application = {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  residentialAddress: string;
  status?: string;
  adminRemarks?: string;
  reviewedAt?: string;
  programmes: { priority: number; programme_code: string; programme_name: string }[];
  documents: Doc[];
  createdAt?: string;
};

const categoryLabel: Record<string, string> = {
  profile_image: "Profile image",
  study_documents: "Study documents",
  certificates: "Certificates",
  sop: "Statement of purpose",
  english_requirement: "English requirement",
};

const AdminApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const API = getApiBaseUrl();
  const navigate = useNavigate();
  const [app, setApp] = useState<Application | null>(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/admin/applications/${id}`, {
          headers: authHeaders(getAdminToken()),
        });
        if (!res.ok) throw new Error("Not found");
        const data = (await res.json()) as Application;
        if (!cancelled) {
          setApp(data);
          setRemarks(data.adminRemarks || "");
        }
      } catch {
        if (!cancelled) setApp(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [API, id]);

  const openFile = async (storedFileName: string) => {
    const token = getAdminToken();
    if (!token || !id) return;
    try {
      const res = await fetch(
        `${API}/admin/files/${id}/${encodeURIComponent(storedFileName)}`,
        { headers: authHeaders(token) }
      );
      if (!res.ok) {
        toast.error("Could not open file");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      toast.error("Could not open file");
    }
  };

  const doAction = async (action: "approve" | "reject") => {
    if (!id) return;
    setActionLoading(true);
    try {
      const res = await fetch(`${API}/admin/applications/${id}`, {
        method: "PATCH",
        headers: {
          ...authHeaders(getAdminToken()),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, remarks }),
      });
      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok) {
        toast.error(data.error || "Failed");
        return;
      }
      toast.success(data.message || "Updated");
      navigate(-1);
    } catch {
      toast.error("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!app) {
    return <p className="text-center text-red-600">Application not found</p>;
  }

  const isPending = !app.status || app.status === "pending";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button type="button" variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-[#0b2c55]">{app.fullName}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Status: <span className="font-semibold capitalize">{app.status || "pending"}</span>
            {app.reviewedAt && ` · ${new Date(app.reviewedAt).toLocaleString()}`}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Email</p>
              <p>{app.email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Phone</p>
              <p>{app.phone}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Date of birth</p>
              <p>{app.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Gender</p>
              <p>{app.gender}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Nationality</p>
              <p>{app.nationality}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Address</p>
              <p>{app.residentialAddress}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Programmes</p>
            <ol className="list-decimal space-y-1 pl-5">
              {app.programmes?.map((p) => (
                <li key={p.priority}>
                  {p.programme_name} ({p.programme_code})
                </li>
              ))}
            </ol>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Documents</p>
            <ul className="space-y-2">
              {app.documents?.map((d, i) => (
                <li
                  key={`${d.storedFileName}-${i}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2"
                >
                  <div>
                    <span className="text-xs font-medium text-university-blue">
                      {categoryLabel[d.category] || d.category}
                    </span>
                    <p className="text-sm">{d.originalName}</p>
                  </div>
                  <Button type="button" size="sm" variant="outline" onClick={() => openFile(d.storedFileName)}>
                    <ExternalLink className="mr-1 h-3.5 w-3.5" />
                    Open
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks (shown to student on reject; optional on approve)</Label>
            <Textarea
              id="remarks"
              rows={4}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Internal / student-facing remarks…"
            />
          </div>

          {isPending && (
            <div className="flex flex-wrap gap-3 border-t pt-4">
              <Button
                type="button"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={actionLoading}
                onClick={() => void doAction("approve")}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accept"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={actionLoading}
                onClick={() => void doAction("reject")}
              >
                Reject
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminApplicationDetail;
