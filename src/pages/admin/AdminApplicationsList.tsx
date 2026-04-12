import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "@/lib/apiBase";
import { authHeaders, getAdminToken } from "@/lib/authStorage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type Row = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  status?: string;
  createdAt?: string;
  programmes?: { programme_name?: string; programme_code?: string }[];
};

const titles: Record<"pending" | "approved" | "rejected", string> = {
  pending: "Applied — pending review",
  approved: "Accepted applications",
  rejected: "Rejected applications",
};

const AdminApplicationsList = ({ status }: { status: "pending" | "approved" | "rejected" }) => {
  const API = getApiBaseUrl();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const q = status === "pending" ? "pending" : status;
        const url = new URL(`${API}/admin/applications`);
        url.searchParams.set("status", q);
        const res = await fetch(url.toString(), {
          headers: authHeaders(getAdminToken()),
        });
        if (res.status === 401) {
          if (!cancelled) {
            setRows([]);
            setLoadError("Session expired — sign in again from the admin login page.");
          }
          return;
        }
        if (!res.ok) throw new Error("Failed to load");
        const data = (await res.json()) as { data: Row[] };
        if (!cancelled) setRows(data.data || []);
      } catch {
        if (!cancelled) {
          setRows([]);
          setLoadError("Could not load applications. Check that the API is running and VITE_API_URL points to it.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [API, status]);

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#0b2c55]">{titles[status] || "Applications"}</h1>
        <p className="text-sm text-muted-foreground">Click a row to review details and documents</p>
      </div>
      {loadError ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{loadError}</p>
      ) : null}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">{rows.length} record(s)</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {loading ? (
            <div className="flex justify-center py-16 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>First choice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow
                    key={r._id}
                    className="cursor-pointer hover:bg-muted/60"
                    onClick={() => navigate(`/admin/application/${r._id}`)}
                  >
                    <TableCell className="font-medium">{r.fullName}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell className="max-w-[220px] truncate text-sm">
                      {r.programmes?.[0]?.programme_name || "—"}
                    </TableCell>
                    <TableCell className="capitalize">{r.status || "pending"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!loading && rows.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">No records</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminApplicationsList;
