import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import HrJobForm, { emptyVacancyForm } from "@/components/hr/HrJobForm";
import { hrFetch, type HrVacancyPayload } from "@/lib/hrApi";

const HrCreateJob = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<HrVacancyPayload>(emptyVacancyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string>("draft");

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = (await hrFetch(`/hr/vacancies/${id}`)) as {
          vacancy: HrVacancyPayload & { status: string; keySelectionCriteria: string[] };
        };
        if (cancelled) return;
        const v = data.vacancy;
        setStatus(v.status || "draft");
        setForm({
          vacancyNo: v.vacancyNo,
          title: v.title,
          divisionDepartment: v.divisionDepartment,
          locationCampus: v.locationCampus,
          bandGrade: v.bandGrade || "",
          staffCategory: v.staffCategory || "",
          reportsTo: v.reportsTo || "",
          summaryOfDuties: v.summaryOfDuties || "",
          mainDuties: v.mainDuties || "",
          dimensions: v.dimensions || "",
          generalResponsibilities: v.generalResponsibilities || "",
          qualificationsRequired: v.qualificationsRequired || "",
          experienceRequired: v.experienceRequired || "",
          minimumQualificationExperience: v.minimumQualificationExperience || "",
          salaryRange: v.salaryRange || "",
          employmentType: v.employmentType || "",
          termsAndConditions: v.termsAndConditions || "",
          keySelectionCriteria:
            v.keySelectionCriteria?.length > 0 ? v.keySelectionCriteria : ["", "", ""],
          closingDate: (v as { closingDate?: string }).closingDate?.slice?.(0, 10) || "",
        });
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Failed to load job");
        navigate("/hr/jobs");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const save = async (publishAfter = false) => {
    const ksc = form.keySelectionCriteria.map((s) => s.trim()).filter(Boolean);
    const payload = { ...form, keySelectionCriteria: ksc };
    if (!payload.vacancyNo || !payload.title || !payload.divisionDepartment || !payload.locationCampus) {
      toast.error("Fill required fields: vacancy number, title, department, location.");
      return;
    }
    setSaving(true);
    try {
      let vacancyId = id;
      if (isEdit && id) {
        await hrFetch(`/hr/vacancies/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        const created = (await hrFetch("/hr/vacancies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })) as { id: string };
        vacancyId = created.id;
      }
      if (publishAfter && vacancyId) {
        await hrFetch(`/hr/vacancies/${vacancyId}/publish`, { method: "POST" });
        toast.success("Job published — visible on Job Opportunities page.");
      } else {
        toast.success(isEdit ? "Draft saved." : "Job draft created.");
      }
      navigate("/hr/jobs");
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
        <Link to="/hr/jobs" className="text-sm text-[#22a2bf] hover:underline">
          ← Back to jobs
        </Link>
        <h1 className="text-2xl font-bold text-[#082952] mt-2">
          {isEdit ? "Edit job posting" : "Create job posting"}
        </h1>
        {readOnly && (
          <p className="text-amber-700 text-sm mt-1">This vacancy is archived and cannot be edited.</p>
        )}
      </div>

      <HrJobForm value={form} onChange={setForm} disabled={readOnly} />

      {!readOnly && (
        <div className="flex flex-wrap gap-3 pb-8">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => void save(false)}
          >
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

export default HrCreateJob;
