import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { HrVacancyPayload } from "@/lib/hrApi";

type HrJobFormProps = {
  value: HrVacancyPayload;
  onChange: (v: HrVacancyPayload) => void;
  disabled?: boolean;
};

const HrJobForm = ({ value, onChange, disabled }: HrJobFormProps) => {
  const set = <K extends keyof HrVacancyPayload>(key: K, val: HrVacancyPayload[K]) => {
    onChange({ ...value, [key]: val });
  };

  const updateKsc = (index: number, text: string) => {
    const next = [...value.keySelectionCriteria];
    next[index] = text;
    while (next.length < 3) next.push("");
    set("keySelectionCriteria", next);
  };

  const addKsc = () => set("keySelectionCriteria", [...value.keySelectionCriteria, ""]);

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#082952] border-b pb-2">
          Career opportunity (advertisement)
        </h2>
        <p className="text-sm text-muted-foreground">
          Based on SINU HR advertisement format — e.g. HR 118/2022 Senior Internal Auditor.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Vacancy number *</Label>
            <Input
              value={value.vacancyNo}
              onChange={(e) => set("vacancyNo", e.target.value)}
              placeholder="HR 118/2026"
              disabled={disabled}
            />
          </div>
          <div>
            <Label>Position title *</Label>
            <Input
              value={value.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Senior Internal Auditor"
              disabled={disabled}
            />
          </div>
          <div>
            <Label>Division / Department *</Label>
            <Input
              value={value.divisionDepartment}
              onChange={(e) => set("divisionDepartment", e.target.value)}
              placeholder="Office of the Vice-Chancellor"
              disabled={disabled}
            />
          </div>
          <div>
            <Label>Location / Campus *</Label>
            <Input
              value={value.locationCampus}
              onChange={(e) => set("locationCampus", e.target.value)}
              placeholder="Kukum"
              disabled={disabled}
            />
          </div>
          <div>
            <Label>Band / Grade</Label>
            <Input
              value={value.bandGrade || ""}
              onChange={(e) => set("bandGrade", e.target.value)}
              placeholder="B4.1"
              disabled={disabled}
            />
          </div>
          <div>
            <Label>Staff category</Label>
            <Input
              value={value.staffCategory || ""}
              onChange={(e) => set("staffCategory", e.target.value)}
              placeholder="Support Staff"
              disabled={disabled}
            />
          </div>
          <div>
            <Label>Reports to</Label>
            <Input
              value={value.reportsTo || ""}
              onChange={(e) => set("reportsTo", e.target.value)}
              placeholder="Vice Chancellor"
              disabled={disabled}
            />
          </div>
          <div>
            <Label>Closing date (optional)</Label>
            <Input
              type="date"
              value={value.closingDate || ""}
              onChange={(e) => set("closingDate", e.target.value)}
              disabled={disabled}
            />
            <p className="text-xs text-muted-foreground mt-1">
              If set, job auto-archives after this date. If empty, close manually from the jobs list.
            </p>
          </div>
          <div>
            <Label>Salary range</Label>
            <Input
              value={value.salaryRange || ""}
              onChange={(e) => set("salaryRange", e.target.value)}
              placeholder="SBD$100,000 – SBD$170,000 per annum"
              disabled={disabled}
            />
          </div>
          <div>
            <Label>Employment type</Label>
            <Input
              value={value.employmentType || ""}
              onChange={(e) => set("employmentType", e.target.value)}
              placeholder="Three (3) years Fixed Term"
              disabled={disabled}
            />
          </div>
        </div>
        <div>
          <Label>Minimum qualification & experience (advert text)</Label>
          <Textarea
            value={value.minimumQualificationExperience || ""}
            onChange={(e) => set("minimumQualificationExperience", e.target.value)}
            rows={4}
            disabled={disabled}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#082952] border-b pb-2">Job description</h2>
        <div>
          <Label>Summary of duties of section</Label>
          <Textarea
            value={value.summaryOfDuties || ""}
            onChange={(e) => set("summaryOfDuties", e.target.value)}
            rows={4}
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Main duties and responsibilities</Label>
          <Textarea
            value={value.mainDuties || ""}
            onChange={(e) => set("mainDuties", e.target.value)}
            rows={8}
            placeholder="Bullet points or paragraphs from the JD…"
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Dimensions (problem-solving, resource management, working environment)</Label>
          <Textarea
            value={value.dimensions || ""}
            onChange={(e) => set("dimensions", e.target.value)}
            rows={6}
            disabled={disabled}
          />
        </div>
        <div>
          <Label>General responsibilities</Label>
          <Textarea
            value={value.generalResponsibilities || ""}
            onChange={(e) => set("generalResponsibilities", e.target.value)}
            rows={4}
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Qualifications required</Label>
          <Textarea
            value={value.qualificationsRequired || ""}
            onChange={(e) => set("qualificationsRequired", e.target.value)}
            rows={4}
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Experience (essential requirements)</Label>
          <Textarea
            value={value.experienceRequired || ""}
            onChange={(e) => set("experienceRequired", e.target.value)}
            rows={5}
            disabled={disabled}
          />
        </div>
        <div>
          <Label>Terms and conditions</Label>
          <Textarea
            value={value.termsAndConditions || ""}
            onChange={(e) => set("termsAndConditions", e.target.value)}
            rows={4}
            placeholder="Gratuity, housing, etc."
            disabled={disabled}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#082952] border-b pb-2">
          Key selection criteria (for applicants)
        </h2>
        {value.keySelectionCriteria.map((ksc, i) => (
          <div key={i}>
            <Label>KSC {i + 1}</Label>
            <Textarea
              value={ksc}
              onChange={(e) => updateKsc(i, e.target.value)}
              rows={2}
              disabled={disabled}
            />
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addKsc} disabled={disabled}>
          Add selection criterion
        </Button>
      </section>
    </div>
  );
};

export default HrJobForm;

export function emptyVacancyForm(): HrVacancyPayload {
  return {
    vacancyNo: "",
    title: "",
    divisionDepartment: "",
    locationCampus: "",
    bandGrade: "",
    staffCategory: "",
    reportsTo: "",
    summaryOfDuties: "",
    mainDuties: "",
    dimensions: "",
    generalResponsibilities: "",
    qualificationsRequired: "",
    experienceRequired: "",
    minimumQualificationExperience: "",
    salaryRange: "",
    employmentType: "",
    termsAndConditions: "",
    keySelectionCriteria: ["", "", ""],
    closingDate: "",
  };
}
