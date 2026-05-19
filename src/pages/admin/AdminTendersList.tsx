import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, PlusCircle, Pencil, Send, Archive } from "lucide-react";
import { toast } from "sonner";
import { adminTendersFetch, type AdminTenderRow } from "@/lib/adminTendersApi";

const AdminTendersList = () => {
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "";
  const [items, setItems] = useState<AdminTenderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const q = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const data = (await adminTendersFetch(`/admin/tenders-eoi${q}`)) as {
        items: AdminTenderRow[];
      };
      setItems(data.items);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [statusFilter]);

  const publish = async (id: string) => {
    try {
      await adminTendersFetch(`/admin/tenders-eoi/${id}/publish`, { method: "POST" });
      toast.success("Published — visible on the public Tenders & EOI page.");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Publish failed");
    }
  };

  const archive = async (id: string) => {
    if (!confirm("Archive this listing? It will be removed from the public page.")) return;
    try {
      await adminTendersFetch(`/admin/tenders-eoi/${id}/archive`, { method: "POST" });
      toast.success("Archived");
      void load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Archive failed");
    }
  };

  const title =
    statusFilter === "archived"
      ? "Archived tenders & EOI"
      : statusFilter === "published"
        ? "Published"
        : statusFilter === "draft"
          ? "Drafts"
          : "All tenders & EOI";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0b2c55]">{title}</h1>
          <div className="mt-2 flex flex-wrap gap-3 text-sm">
            <Link
              to="/admin/tenders"
              className={!statusFilter ? "font-bold text-[#0b2c55]" : "text-[#219ebc] hover:underline"}
            >
              All
            </Link>
            <Link
              to="/admin/tenders?status=draft"
              className={statusFilter === "draft" ? "font-bold text-[#0b2c55]" : "text-[#219ebc] hover:underline"}
            >
              Drafts
            </Link>
            <Link
              to="/admin/tenders?status=published"
              className={
                statusFilter === "published" ? "font-bold text-[#0b2c55]" : "text-[#219ebc] hover:underline"
              }
            >
              Published
            </Link>
            <Link
              to="/admin/tenders?status=archived"
              className={
                statusFilter === "archived" ? "font-bold text-[#0b2c55]" : "text-[#219ebc] hover:underline"
              }
            >
              Archived
            </Link>
          </div>
        </div>
        <Button asChild className="bg-[#ffb703] text-[#082952] hover:bg-[#d7a12c]">
          <Link to="/admin/tenders/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            New listing
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No listings yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#0b2c55] text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Title</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Department</th>
                <th className="px-4 py-3 text-left font-semibold">Closes</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-medium text-[#082952]">{row.title}</td>
                  <td className="px-4 py-3 capitalize">{row.type === "eoi" ? "EOI" : "Tender"}</td>
                  <td className="px-4 py-3 text-gray-600">{row.department}</td>
                  <td className="px-4 py-3">{row.closingDateFormatted}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="secondary"
                      className={
                        row.status === "published"
                          ? "bg-emerald-100 text-emerald-900"
                          : row.status === "draft"
                            ? "bg-amber-100 text-amber-900"
                            : "bg-gray-100 text-gray-700"
                      }
                    >
                      {row.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild title="Edit">
                        <Link to={`/admin/tenders/${row.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      {row.status === "draft" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Publish"
                          onClick={() => void publish(row.id)}
                        >
                          <Send className="h-4 w-4 text-emerald-700" />
                        </Button>
                      )}
                      {row.status === "published" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Archive"
                          onClick={() => void archive(row.id)}
                        >
                          <Archive className="h-4 w-4 text-gray-600" />
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

export default AdminTendersList;
