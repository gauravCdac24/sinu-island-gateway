import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import AdminTenderForm, {
  emptyTenderForm,
  type AdminTenderFormState,
} from "@/components/admin/AdminTenderForm";
import { adminTendersFetch, saveTenderFormData } from "@/lib/adminTendersApi";
import type { AdminTenderDetail } from "@/lib/adminTendersApi";

const AdminCreateTender = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<AdminTenderFormState>(emptyTenderForm());
  const [files, setFiles] = useState<{
    document1?: File;
    document2?: File;
    document3?: File;
  }>({});
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("draft");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = (await adminTendersFetch(`/admin/tenders-eoi/${id}`)) as {
          item: AdminTenderDetail;
        };
        if (cancelled) return;
        const t = data.item;
        setStatus(t.status);
        const bySlot = (slot: number) => t.documents.find((d) => d.slot === slot);
        setForm({
          referenceNo: t.referenceNo || "",
          title: t.title,
          description: t.description,
          department: t.department,
          type: t.type,
          closingDate: t.closingDate,
          documentLabel1: bySlot(1)?.label || "",
          documentLabel2: bySlot(2)?.label || "",
          documentLabel3: bySlot(3)?.label || "",
          existingDocs: t.documents.map((d) => ({
            slot: d.slot,
            filename: d.filename,
            label: d.label,
          })),
        });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load");
        navigate("/admin/tenders");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("referenceNo", form.referenceNo);
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("department", form.department);
    fd.append("type", form.type);
    fd.append("closingDate", form.closingDate);
    fd.append("documentLabel1", form.documentLabel1);
    fd.append("documentLabel2", form.documentLabel2);
    fd.append("documentLabel3", form.documentLabel3);
    if (files.document1) fd.append("document1", files.document1);
    if (files.document2) fd.append("document2", files.document2);
    if (files.document3) fd.append("document3", files.document3);
    return fd;
  };

  const save = async (publishAfter = false) => {
    if (!form.title || !form.description || !form.department || !form.closingDate) {
      toast.error("Fill required fields: title, description, department, closing date, and type.");
      return;
    }
    setSaving(true);
    try {
      const fd = buildFormData();
      const result = await saveTenderFormData(id, fd);
      const tenderId = result.id || id;
      if (publishAfter && tenderId) {
        await adminTendersFetch(`/admin/tenders-eoi/${tenderId}/publish`, { method: "POST" });
        toast.success("Published — visible on Tenders & EOI page.");
      } else {
        toast.success(isEdit ? "Saved." : "Draft created.");
      }
      navigate("/admin/tenders");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const readOnly = status === "archived";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link to="/admin/tenders" className="text-sm text-[#219ebc] hover:underline">
          ← Back to tenders & EOI
        </Link>
        <h1 className="text-2xl font-bold text-[#0b2c55] mt-2">
          {isEdit ? "Edit listing" : "Create tender or EOI"}
        </h1>
        {readOnly && (
          <p className="text-amber-700 text-sm mt-1">This listing is archived and cannot be edited.</p>
        )}
      </div>

      <AdminTenderForm
        value={form}
        onChange={setForm}
        files={files}
        onFilesChange={setFiles}
        disabled={readOnly}
      />

      {!readOnly && (
        <div className="flex flex-wrap gap-3 pb-8">
          <Button type="button" variant="outline" disabled={saving} onClick={() => void save(false)}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save draft
          </Button>
          <Button
            type="button"
            className="bg-[#ffb703] text-[#082952]"
            disabled={saving}
            onClick={() => void save(true)}
          >
            {status === "published" ? "Save & keep published" : "Save & publish"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminCreateTender;
