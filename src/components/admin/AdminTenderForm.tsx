import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type AdminTenderFormState = {
  referenceNo: string;
  title: string;
  description: string;
  department: string;
  type: "tender" | "eoi";
  closingDate: string;
  documentLabel1: string;
  documentLabel2: string;
  documentLabel3: string;
  existingDocs: { slot: number; filename: string; label: string | null }[];
};

export const emptyTenderForm = (): AdminTenderFormState => ({
  referenceNo: "",
  title: "",
  description: "",
  department: "",
  type: "tender",
  closingDate: "",
  documentLabel1: "",
  documentLabel2: "",
  documentLabel3: "",
  existingDocs: [],
});

type AdminTenderFormProps = {
  value: AdminTenderFormState;
  onChange: (v: AdminTenderFormState) => void;
  files: { document1?: File; document2?: File; document3?: File };
  onFilesChange: (f: AdminTenderFormProps["files"]) => void;
  disabled?: boolean;
};

const AdminTenderForm = ({ value, onChange, files, onFilesChange, disabled }: AdminTenderFormProps) => {
  const set = <K extends keyof AdminTenderFormState>(key: K, val: AdminTenderFormState[K]) => {
    onChange({ ...value, [key]: val });
  };

  const existingForSlot = (slot: number) =>
    value.existingDocs.find((d) => d.slot === slot);

  return (
    <div className="space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0b2c55] border-b pb-2">Listing details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Reference number</Label>
            <Input
              value={value.referenceNo}
              onChange={(e) => set("referenceNo", e.target.value)}
              placeholder="TND-2026-001"
              disabled={disabled}
            />
          </div>
          <div>
            <Label>Type *</Label>
            <Select
              value={value.type}
              onValueChange={(v) => set("type", v as "tender" | "eoi")}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tender">Tender</SelectItem>
                <SelectItem value="eoi">Expression of Interest (EOI)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:col-span-2">
            <Label>Title *</Label>
            <Input
              value={value.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Supply of laboratory equipment"
              disabled={disabled}
            />
          </div>
          <div>
            <Label>Department *</Label>
            <Input
              value={value.department}
              onChange={(e) => set("department", e.target.value)}
              placeholder="Faculty of Science"
              disabled={disabled}
            />
          </div>
          <div>
            <Label>Closing date *</Label>
            <Input
              type="date"
              value={value.closingDate}
              onChange={(e) => set("closingDate", e.target.value)}
              disabled={disabled}
            />
          </div>
          <div className="sm:col-span-2">
            <Label>Description *</Label>
            <Textarea
              value={value.description}
              onChange={(e) => set("description", e.target.value)}
              rows={6}
              placeholder="Full description of the tender or expression of interest…"
              disabled={disabled}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0b2c55] border-b pb-2">
          Supporting documents (PDF, up to 3)
        </h2>
        <p className="text-sm text-muted-foreground">
          Upload PDF files. Leave blank to keep an existing file when editing.
        </p>
        {[1, 2, 3].map((slot) => {
          const existing = existingForSlot(slot);
          const fileKey = `document${slot}` as keyof typeof files;
          return (
            <div key={slot} className="rounded-lg border border-gray-100 bg-gray-50/80 p-4 space-y-3">
              <p className="text-sm font-semibold text-[#082952]">Document {slot}</p>
              <div>
                <Label>Display label</Label>
                <Input
                  value={
                    slot === 1
                      ? value.documentLabel1
                      : slot === 2
                        ? value.documentLabel2
                        : value.documentLabel3
                  }
                  onChange={(e) => {
                    if (slot === 1) set("documentLabel1", e.target.value);
                    else if (slot === 2) set("documentLabel2", e.target.value);
                    else set("documentLabel3", e.target.value);
                  }}
                  placeholder={`e.g. Tender specification ${slot}`}
                  disabled={disabled}
                />
              </div>
              {existing && (
                <p className="text-xs text-muted-foreground">
                  Current file: <span className="font-medium">{existing.filename}</span>
                </p>
              )}
              <div>
                <Label>PDF file</Label>
                <Input
                  type="file"
                  accept="application/pdf,.pdf"
                  disabled={disabled}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    onFilesChange({ ...files, [fileKey]: f });
                  }}
                />
                {files[fileKey] && (
                  <p className="text-xs text-emerald-700 mt-1">Selected: {files[fileKey]!.name}</p>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default AdminTenderForm;
