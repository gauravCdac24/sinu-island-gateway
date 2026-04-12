import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import ApplyHero from "@/components/apply/ApplyHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getApiBaseUrl } from "@/lib/apiBase";
import {
  buildApplicationSummaryHtml,
  type ApplicationSnapshot,
} from "@/lib/applicationSummary";
import { toast } from "sonner";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  FileText,
  UserCircle,
  BookOpen,
  Award,
  ScrollText,
  Languages,
  ClipboardList,
  Download,
  Eye,
  Printer,
  FileDown,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const REFERENCE_FORM_PDF = "/Application-Form.pdf";

type CatalogueRow = {
  programme_code: string;
  programme_name: string;
};

const STEPS = [
  { id: "personal", title: "Personal details", short: "About you", icon: UserCircle },
  { id: "programmes", title: "Programme choices", short: "Priorities", icon: BookOpen },
  { id: "profile", title: "Profile photo", short: "Photo", icon: UserCircle },
  { id: "study", title: "Study documents", short: "Study", icon: FileText },
  { id: "certificates", title: "Certificates", short: "Certs", icon: Award },
  { id: "sop", title: "Statement of purpose", short: "SOP", icon: ScrollText },
  { id: "english", title: "English requirement", short: "English", icon: Languages },
  { id: "review", title: "Review & submit", short: "Submit", icon: ClipboardList },
] as const;

const TOTAL_STEPS = STEPS.length;

async function readJsonOrThrow(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    await res.text();
    throw new Error(
      "The server returned non-JSON. Check VITE_API_URL / backend on port 7000."
    );
  }
  return res.json();
}

const formSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email"),
    phone: z.string().min(5, "Enter a valid phone number"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["Female", "Male", "Other", "Prefer not to say"], {
      required_error: "Select gender",
    }),
    nationality: z.string().min(2, "Nationality is required"),
    residentialAddress: z.string().min(5, "Address is required"),
    programmeCode1: z.string().min(1, "Select your first-choice programme"),
    programmeCode2: z.string().optional(),
    programmeCode3: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const c1 = data.programmeCode1.trim();
    const c2 = data.programmeCode2?.trim() || "";
    const c3 = data.programmeCode3?.trim() || "";
    if (c2 && c2 === c1) {
      ctx.addIssue({
        code: "custom",
        message: "Second choice must differ from your first choice",
        path: ["programmeCode2"],
      });
    }
    if (c3 && (c3 === c1 || (c2 && c3 === c2))) {
      ctx.addIssue({
        code: "custom",
        message: "Third choice must differ from your other choices",
        path: ["programmeCode3"],
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

function FileDropHint({
  id,
  label,
  description,
  required,
  accept,
  multiple,
  files,
  onChange,
}: {
  id: string;
  label: string;
  description: string;
  required?: boolean;
  accept: string;
  multiple?: boolean;
  files: File[];
  onChange: (files: File[]) => void;
}) {
  return (
    <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Label htmlFor={id} className="text-base font-semibold text-[#0b2c55]">
          {label}
          {required ? <span className="text-red-600"> *</span> : <span className="text-muted-foreground font-normal"> (optional)</span>}
        </Label>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Input
        id={id}
        type="file"
        multiple={multiple}
        accept={accept}
        className="cursor-pointer"
        onChange={(e) => {
          const list = e.target.files;
          onChange(list ? Array.from(list) : []);
        }}
      />
      {files.length > 0 && (
        <ul className="list-inside list-disc text-sm text-gray-700">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`}>{f.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

const Apply = () => {
  const API_BASE = getApiBaseUrl();
  const [searchParams] = useSearchParams();
  const preselectCode = searchParams.get("code")?.trim() || "";

  const [catalogue, setCatalogue] = useState<CatalogueRow[]>([]);
  const [loadingCatalogue, setLoadingCatalogue] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSnapshot, setPreviewSnapshot] = useState<ApplicationSnapshot | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    id: string;
    message: string;
    emailSent?: boolean;
  } | null>(null);
  const [submissionSnapshot, setSubmissionSnapshot] = useState<ApplicationSnapshot | null>(null);

  const [profileImage, setProfileImage] = useState<File[]>([]);
  const [studyDocuments, setStudyDocuments] = useState<File[]>([]);
  const [certificates, setCertificates] = useState<File[]>([]);
  const [sopFiles, setSopFiles] = useState<File[]>([]);
  const [englishFiles, setEnglishFiles] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: undefined,
      nationality: "",
      residentialAddress: "",
      programmeCode1: "",
      programmeCode2: "",
      programmeCode3: "",
    },
  });

  const { setValue, watch } = form;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingCatalogue(true);
      try {
        const params = new URLSearchParams({
          programme_name: "all",
          programme_level: "all",
          programme_faculty: "all",
        });
        const res = await fetch(`${API_BASE}/programme_catalogue/search?${params}`);
        if (!res.ok) throw new Error("Could not load programmes");
        const data = (await readJsonOrThrow(res)) as { data?: CatalogueRow[] };
        const rows = Array.isArray(data.data) ? data.data : [];
        if (!cancelled) setCatalogue(rows);
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setCatalogue([]);
          toast.error("Failed to load programme list. Is the API server running?");
        }
      } finally {
        if (!cancelled) setLoadingCatalogue(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [API_BASE]);

  useEffect(() => {
    if (!preselectCode || catalogue.length === 0) return;
    const exists = catalogue.some((p) => p.programme_code === preselectCode);
    if (exists) setValue("programmeCode1", preselectCode);
  }, [preselectCode, catalogue, setValue]);

  const codeToName = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of catalogue) {
      m.set(p.programme_code, p.programme_name);
    }
    return m;
  }, [catalogue]);

  const selectOptions = useMemo(() => {
    return [...catalogue].sort((a, b) =>
      a.programme_name.localeCompare(b.programme_name, undefined, { sensitivity: "base" })
    );
  }, [catalogue]);

  const watched1 = watch("programmeCode1");
  const watched2 = watch("programmeCode2");
  const watched3 = watch("programmeCode3");

  /** If a higher-priority choice changes to match a lower one, clear the conflicting field. */
  useEffect(() => {
    const c1 = watched1?.trim() || "";
    const c2 = watched2?.trim() || "";
    const c3 = watched3?.trim() || "";
    if (c2 && c2 === c1) setValue("programmeCode2", "");
    if (c3 && (c3 === c1 || c3 === c2)) setValue("programmeCode3", "");
  }, [watched1, watched2, watched3, setValue]);

  const optionsForPriority = (slot: 1 | 2 | 3) => {
    const w1 = watched1?.trim() || "";
    const w2 = watched2?.trim() || "";
    const w3 = watched3?.trim() || "";
    const exclude = new Set<string>();
    if (slot !== 1 && w1) exclude.add(w1);
    if (slot !== 2 && w2) exclude.add(w2);
    if (slot !== 3 && w3) exclude.add(w3);
    return selectOptions.filter((p) => !exclude.has(p.programme_code));
  };

  const progressPercent = Math.round(((step + 1) / TOTAL_STEPS) * 100);

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    if (step === 0) {
      const ok = await form.trigger([
        "fullName",
        "email",
        "phone",
        "dateOfBirth",
        "gender",
        "nationality",
        "residentialAddress",
      ]);
      if (!ok) return false;
      const values = form.getValues();
      const email = values.email.trim().toLowerCase();
      const phone = values.phone.trim();
      try {
        const res = await fetch(`${API_BASE}/student_applications/check-duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, phone }),
        });
        const data = (await readJsonOrThrow(res)) as {
          emailTaken?: boolean;
          phoneTaken?: boolean;
          error?: string;
        };
        if (!res.ok) {
          toast.error(data.error || "Could not verify email and phone.");
          return false;
        }
        if (data.emailTaken) {
          form.setError("email", {
            type: "manual",
            message: "This email is already registered for an application.",
          });
          return false;
        }
        if (data.phoneTaken) {
          form.setError("phone", {
            type: "manual",
            message: "This phone number is already registered for an application.",
          });
          return false;
        }
      } catch (e) {
        console.error(e);
        toast.error(e instanceof Error ? e.message : "Could not verify email and phone.");
        return false;
      }
      return true;
    }
    if (step === 1) {
      return form.trigger(["programmeCode1", "programmeCode2", "programmeCode3"]);
    }
    if (step === 2) {
      if (profileImage.length !== 1) {
        toast.error("Upload exactly one profile photo (JPG or PNG).");
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (studyDocuments.length < 1) {
        toast.error("Upload at least one study document (e.g. transcripts, academic records).");
        return false;
      }
      return true;
    }
    if (step === 4) {
      return true;
    }
    if (step === 5) {
      if (sopFiles.length < 1) {
        toast.error("Upload your statement of purpose (SOP).");
        return false;
      }
      return true;
    }
    if (step === 6) {
      if (englishFiles.length < 1) {
        toast.error(
          "Upload English language proof (e.g. IELTS, TOEFL) or an official waiver / placement document."
        );
        return false;
      }
      return true;
    }
    return true;
  }, [step, form, profileImage.length, studyDocuments.length, sopFiles.length, englishFiles.length, API_BASE]);

  const goNext = async () => {
    const ok = await validateCurrentStep();
    if (!ok) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const buildProgrammesPayload = (values: FormValues) => {
    const programmes: {
      priority: number;
      programme_code: string;
      programme_name: string;
    }[] = [
      {
        priority: 1,
        programme_code: values.programmeCode1,
        programme_name: codeToName.get(values.programmeCode1) || "",
      },
    ];
    if (values.programmeCode2?.trim()) {
      programmes.push({
        priority: 2,
        programme_code: values.programmeCode2.trim(),
        programme_name: codeToName.get(values.programmeCode2.trim()) || "",
      });
    }
    if (values.programmeCode3?.trim()) {
      programmes.push({
        priority: 3,
        programme_code: values.programmeCode3.trim(),
        programme_name: codeToName.get(values.programmeCode3.trim()) || "",
      });
    }
    return programmes;
  };

  const makeSnapshot = (values: FormValues): ApplicationSnapshot => {
    const programmes = buildProgrammesPayload(values);
    return {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      nationality: values.nationality.trim(),
      residentialAddress: values.residentialAddress.trim(),
      programmes: programmes.map((p) => ({
        priority: p.priority,
        code: p.programme_code,
        name: p.programme_name,
      })),
      profileImageName: profileImage[0]?.name ?? "",
      studyDocNames: studyDocuments.map((f) => f.name),
      certificateNames: certificates.map((f) => f.name),
      sopNames: sopFiles.map((f) => f.name),
      englishNames: englishFiles.map((f) => f.name),
      submittedAtIso: new Date().toISOString(),
    };
  };

  const openPreview = () => {
    const values = form.getValues();
    setPreviewSnapshot(makeSnapshot(values));
    setPreviewOpen(true);
  };

  const handlePrintSummary = (snapshot: ApplicationSnapshot, applicationId: string) => {
    const html = buildApplicationSummaryHtml(snapshot, applicationId);
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.focus();
      w.print();
    } else {
      toast.error("Pop-up blocked. Allow pop-ups to print your summary.");
    }
  };

  const handleDownloadSummaryHtml = (snapshot: ApplicationSnapshot, applicationId: string) => {
    const html = buildApplicationSummaryHtml(snapshot, applicationId);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SINU-application-summary-${String(applicationId).replace(/[^a-zA-Z0-9_-]/g, "").slice(-12) || "application"}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Summary downloaded");
  };

  const onSubmit = async (values: FormValues) => {
    const programmes = buildProgrammesPayload(values);
    for (const p of programmes) {
      if (!p.programme_name) {
        toast.error("Programme data is incomplete. Reload and try again.");
        return;
      }
    }

    if (profileImage.length !== 1 || studyDocuments.length < 1 || sopFiles.length < 1 || englishFiles.length < 1) {
      toast.error("Complete all required uploads before submitting.");
      setStep(2);
      return;
    }

    const fd = new FormData();
    fd.append("fullName", values.fullName.trim());
    fd.append("email", values.email.trim());
    fd.append("phone", values.phone.trim());
    fd.append("dateOfBirth", values.dateOfBirth);
    fd.append("gender", values.gender);
    fd.append("nationality", values.nationality.trim());
    fd.append("residentialAddress", values.residentialAddress.trim());
    fd.append("programmes", JSON.stringify(programmes));

    fd.append("profile_image", profileImage[0]);
    for (const f of studyDocuments) fd.append("study_documents", f);
    for (const f of certificates) fd.append("certificates", f);
    for (const f of sopFiles) fd.append("sop", f);
    for (const f of englishFiles) fd.append("english_requirement", f);

    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/student_applications`, {
        method: "POST",
        body: fd,
      });
      const payload = (await readJsonOrThrow(res)) as {
        id?: string;
        error?: string;
        message?: string;
        emailSent?: boolean;
      };
      if (!res.ok) {
        toast.error(payload.error || "Submission failed");
        return;
      }
      const snap = makeSnapshot(values);
      const appId = payload.id != null ? String(payload.id) : "unknown";
      setSubmissionSnapshot(snap);
      setSubmissionResult({
        id: appId,
        message: payload.message || "Your application was submitted successfully.",
        emailSent: payload.emailSent,
      });
      toast.success(payload.message || "Application submitted");
      form.reset();
      setProfileImage([]);
      setStudyDocuments([]);
      setCertificates([]);
      setSopFiles([]);
      setEnglishFiles([]);
      setStep(0);
      setPreviewOpen(false);
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>

      <main className="relative flex flex-grow flex-col">
        {/* Full-bleed hero image behind the absolute header / logo */}
        <ApplyHero />

        {submissionResult && submissionSnapshot ? (
          <div className="relative z-10 flex flex-col bg-gray-50">
            <div className="border-b border-emerald-100 bg-emerald-50/95 shadow-sm backdrop-blur-sm">
              <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 sm:px-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <CheckCircle2 className="h-8 w-8" aria-hidden />
                  </div>
                  <h2 className="text-xl font-bold text-emerald-900 sm:text-2xl">Application submitted</h2>
                  <p className="mt-2 max-w-xl text-sm text-emerald-900/90">{submissionResult.message}</p>
                  <p className="mt-2 text-xs text-emerald-800/90">
                    Reference ID: <span className="font-mono font-semibold">{submissionResult.id}</span>
                  </p>
                  {submissionResult.emailSent === true && (
                    <p className="mt-1 text-xs text-emerald-800/80">
                      A confirmation email has been sent to the address you provided.
                    </p>
                  )}
                  {submissionResult.emailSent === false && (
                    <p className="mt-1 text-xs text-amber-800/90">
                      We could not send a confirmation email. Download or print your summary below.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mx-auto w-full max-w-4xl flex-grow px-4 py-10 sm:px-6">
              <p className="mb-6 text-center text-sm text-gray-600 sm:text-base">
                Save or print your application for your records.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="flex flex-col border border-gray-200 shadow-md transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-[#0b2c55]">
                      <Printer className="h-5 w-5 shrink-0" aria-hidden />
                      Print
                    </CardTitle>
                    <CardDescription>Print a copy of your application summary.</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button
                      type="button"
                      className="w-full bg-[#0b2c55] hover:bg-[#d7a12c]"
                      onClick={() => handlePrintSummary(submissionSnapshot, submissionResult.id)}
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Print summary
                    </Button>
                  </CardContent>
                </Card>
                <Card className="flex flex-col border border-gray-200 shadow-md transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-[#0b2c55]">
                      <FileDown className="h-5 w-5 shrink-0" aria-hidden />
                      Download summary
                    </CardTitle>
                    <CardDescription>Your answers and uploaded file names as an HTML file.</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-[#0b2c55] text-[#0b2c55] hover:bg-[#0b2c55]/10"
                      onClick={() => handleDownloadSummaryHtml(submissionSnapshot, submissionResult.id)}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Download HTML
                    </Button>
                  </CardContent>
                </Card>
                <Card className="flex flex-col border border-gray-200 shadow-md transition-shadow hover:shadow-lg sm:col-span-2 lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-[#0b2c55]">
                      <FileText className="h-5 w-5 shrink-0" aria-hidden />
                      Official form
                    </CardTitle>
                    <CardDescription>Blank SINU application form (PDF) for reference.</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-[#0b2c55] text-[#0b2c55] hover:bg-[#0b2c55]/10"
                      asChild
                    >
                      <a href={REFERENCE_FORM_PDF} download>
                        Download application form (PDF)
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
        <div className="relative z-10 flex flex-col bg-gray-50">
          <div className="border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-[#0b2c55]">
                Step {step + 1} of {TOTAL_STEPS}
                <span className="text-muted-foreground font-normal">
                  {" "}
                  — {STEPS[step].title}
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={REFERENCE_FORM_PDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#0b2c55]/30 bg-white px-3 py-1.5 text-xs font-medium text-[#0b2c55] hover:bg-gray-50"
                >
                  <Download className="h-3.5 w-3.5" />
                  Reference: application form (PDF)
                </a>
              </div>
            </div>
            <Progress value={progressPercent} className="h-2 bg-gray-200" />
            <div className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const done = i < step;
                const active = i === step;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (i <= step) setStep(i);
                    }}
                    disabled={i > step}
                    title={s.title}
                    className={cn(
                      "flex min-w-[4.5rem] shrink-0 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors sm:min-w-[5.5rem] sm:text-xs",
                      done && "text-emerald-700",
                      active && "bg-[#0b2c55]/10 text-[#0b2c55]",
                      !active && !done && "text-gray-400",
                      i > step && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] sm:h-8 sm:w-8",
                        done && "border-emerald-600 bg-emerald-50 text-emerald-700",
                        active && "border-[#0b2c55] bg-[#0b2c55] text-white",
                        !active && !done && "border-gray-300 bg-white text-gray-500"
                      )}
                    >
                      {done ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    </span>
                    <span className="max-w-[5rem] text-center leading-tight sm:max-w-none">{s.short}</span>
                  </button>
                );
              })}
            </div>
          </div>
          </div>

          <div className="flex-grow px-4 py-8 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="mb-6 text-center text-sm text-gray-600 sm:text-base">
              Work through each step. Fields marked * are required. Use the PDF reference to align with the
              official paper form where helpful.
            </p>

            <Card className="border border-gray-200 shadow-md">
              <CardHeader>
                <CardTitle className="text-xl text-[#0b2c55]">{STEPS[step].title}</CardTitle>
                <CardDescription>
                  {step === 0 && "Your legal name and contact details as they should appear on your record."}
                  {step === 1 && "Choose up to three programmes in priority order (first = highest priority)."}
                  {step === 2 && "One recent passport-style photo for your applicant profile."}
                  {step === 3 && "Academic transcripts, study records, or equivalent study documentation."}
                  {step === 4 && "Certified copies of certificates or qualifications (optional if already in study docs)."}
                  {step === 5 && "Your statement of purpose for the programme(s) you selected."}
                  {step === 6 && "English test scores (e.g. IELTS, TOEFL) or official evidence per programme rules."}
                  {step === 7 && "Confirm your details and upload summary, then submit."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingCatalogue && step <= 1 ? (
                  <div className="flex items-center justify-center gap-2 py-16 text-gray-600">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Loading programmes…
                  </div>
                ) : (
                  <Form {...form}>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (step === TOTAL_STEPS - 1) void form.handleSubmit(onSubmit)(e);
                      }}
                      className="space-y-6"
                    >
                      {step === 0 && (
                        <>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="As on official ID" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email *</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="you@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Include country code if applicable" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="dateOfBirth"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date of birth *</FormLabel>
                                  <FormControl>
                                    <Input type="date" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <FormField
                              control={form.control}
                              name="gender"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Gender *</FormLabel>
                                  <FormControl>
                                    <select
                                      className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-base"
                                      value={field.value ?? ""}
                                      onChange={field.onChange}
                                      onBlur={field.onBlur}
                                      ref={field.ref}
                                    >
                                      <option value="" disabled>
                                        Select…
                                      </option>
                                      <option value="Female">Female</option>
                                      <option value="Male">Male</option>
                                      <option value="Other">Other</option>
                                      <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="nationality"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nationality *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Country of citizenship" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="residentialAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Residential address *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Street, island, country" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </>
                      )}

                      {step === 1 && (
                        <div className="space-y-4">
                          <FormField
                            control={form.control}
                            name="programmeCode1"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First choice *</FormLabel>
                                <FormControl>
                                  <select
                                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-base"
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                  >
                                    <option value="">Select programme…</option>
                                    {optionsForPriority(1).map((p) => (
                                      <option key={p.programme_code} value={p.programme_code}>
                                        {p.programme_name} ({p.programme_code})
                                      </option>
                                    ))}
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="programmeCode2"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Second choice (optional)</FormLabel>
                                <FormControl>
                                  <select
                                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-base"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                  >
                                    <option value="">—</option>
                                    {optionsForPriority(2).map((p) => (
                                      <option key={p.programme_code} value={p.programme_code}>
                                        {p.programme_name} ({p.programme_code})
                                      </option>
                                    ))}
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="programmeCode3"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Third choice (optional)</FormLabel>
                                <FormControl>
                                  <select
                                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-base"
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                  >
                                    <option value="">—</option>
                                    {optionsForPriority(3).map((p) => (
                                      <option key={p.programme_code} value={p.programme_code}>
                                        {p.programme_name} ({p.programme_code})
                                      </option>
                                    ))}
                                  </select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}

                      {step === 2 && (
                        <FileDropHint
                          id="profile_image"
                          label="Profile image"
                          description="Upload one passport-style photo (face visible, plain background). JPG or PNG, max 12 MB."
                          required
                          accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                          files={profileImage}
                          onChange={(f) => setProfileImage(f.slice(0, 1))}
                        />
                      )}

                      {step === 3 && (
                        <FileDropHint
                          id="study_documents"
                          label="Study documents"
                          description="Transcripts, academic records, or official study history. PDF or images. At least one file."
                          required
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
                          files={studyDocuments}
                          onChange={setStudyDocuments}
                        />
                      )}

                      {step === 4 && (
                        <FileDropHint
                          id="certificates"
                          label="Certificates"
                          description="Certified copies of certificates, diplomas, or awards. Optional if already included above."
                          accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/*"
                          multiple
                          files={certificates}
                          onChange={setCertificates}
                        />
                      )}

                      {step === 5 && (
                        <FileDropHint
                          id="sop"
                          label="Statement of purpose (SOP)"
                          description="Your SOP for the chosen programme(s). PDF preferred."
                          required
                          accept=".pdf,.doc,.docx,application/pdf"
                          multiple
                          files={sopFiles}
                          onChange={setSopFiles}
                        />
                      )}

                      {step === 6 && (
                        <FileDropHint
                          id="english_requirement"
                          label="English language requirement"
                          description="IELTS, TOEFL, PTE, or other approved test results, or an official waiver / placement letter if applicable."
                          required
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/*"
                          files={englishFiles}
                          onChange={setEnglishFiles}
                        />
                      )}

                      {step === 7 && (
                        <div className="space-y-4 text-sm text-gray-800">
                          <p className="font-semibold text-[#0b2c55]">Review your application</p>
                          <ul className="space-y-2 rounded-lg border bg-gray-50 p-4">
                            <li>
                              <span className="font-medium">Name:</span> {form.watch("fullName") || "—"}
                            </li>
                            <li>
                              <span className="font-medium">Email:</span> {form.watch("email") || "—"}
                            </li>
                            <li>
                              <span className="font-medium">Phone:</span> {form.watch("phone") || "—"}
                            </li>
                            <li>
                              <span className="font-medium">Programmes:</span>{" "}
                              {[watched1, watched2, watched3].filter(Boolean).join(" → ") || "—"}
                            </li>
                            <li>
                              <span className="font-medium">Profile photo:</span>{" "}
                              {profileImage.length === 1 ? profileImage[0].name : "—"}
                            </li>
                            <li>
                              <span className="font-medium">Study documents:</span> {studyDocuments.length} file(s)
                            </li>
                            <li>
                              <span className="font-medium">Certificates:</span>{" "}
                              {certificates.length > 0 ? `${certificates.length} file(s)` : "None"}
                            </li>
                            <li>
                              <span className="font-medium">SOP:</span> {sopFiles.length} file(s)
                            </li>
                            <li>
                              <span className="font-medium">English requirement:</span> {englishFiles.length}{" "}
                              file(s)
                            </li>
                          </ul>
                          <p className="text-muted-foreground">
                            By submitting, you confirm the information and files are accurate. Confirmation email
                            is sent when the server mail settings are configured.
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={goBack}
                          disabled={step === 0 || submitting}
                          className="gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Back
                        </Button>
                        {step < TOTAL_STEPS - 1 ? (
                          <Button
                            type="button"
                            onClick={() => void goNext()}
                            className="gap-1 bg-[#0b2c55] hover:bg-[#d7a12c]"
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        ) : (
                          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={openPreview}
                              className="gap-1 border-[#0b2c55] text-[#0b2c55] hover:bg-[#0b2c55]/10"
                              disabled={submitting}
                            >
                              <Eye className="h-4 w-4" />
                              Preview
                            </Button>
                            <Button
                              type="submit"
                              disabled={submitting}
                              className="gap-1 bg-[#0b2c55] hover:bg-[#d7a12c]"
                            >
                              {submitting ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Submitting…
                                </>
                              ) : (
                                "Submit application"
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
          </div>
        </div>
        )}
      </main>

      <Dialog
        open={previewOpen}
        onOpenChange={(open) => {
          setPreviewOpen(open);
          if (!open) setPreviewSnapshot(null);
        }}
      >
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application preview</DialogTitle>
            <DialogDescription>
              Review your details before submitting. This is not saved until you click Submit application.
            </DialogDescription>
          </DialogHeader>
          {previewSnapshot && (
            <div className="space-y-3 text-sm text-gray-800">
              <div className="rounded-lg border bg-gray-50 p-4">
                <p className="font-semibold text-[#0b2c55]">Applicant</p>
                <ul className="mt-2 space-y-1">
                  <li>
                    <span className="font-medium">Name:</span> {previewSnapshot.fullName}
                  </li>
                  <li>
                    <span className="font-medium">Email:</span> {previewSnapshot.email}
                  </li>
                  <li>
                    <span className="font-medium">Phone:</span> {previewSnapshot.phone}
                  </li>
                  <li>
                    <span className="font-medium">Date of birth:</span> {previewSnapshot.dateOfBirth}
                  </li>
                  <li>
                    <span className="font-medium">Gender:</span> {previewSnapshot.gender}
                  </li>
                  <li>
                    <span className="font-medium">Nationality:</span> {previewSnapshot.nationality}
                  </li>
                  <li>
                    <span className="font-medium">Address:</span> {previewSnapshot.residentialAddress}
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border bg-gray-50 p-4">
                <p className="font-semibold text-[#0b2c55]">Programmes (priority)</p>
                <ul className="mt-2 list-inside list-decimal space-y-1">
                  {previewSnapshot.programmes.map((p) => (
                    <li key={p.priority}>
                      {p.name} ({p.code})
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-lg border bg-gray-50 p-4">
                <p className="font-semibold text-[#0b2c55]">Uploads</p>
                <ul className="mt-2 space-y-1">
                  <li>
                    <span className="font-medium">Profile photo:</span> {previewSnapshot.profileImageName || "—"}
                  </li>
                  <li>
                    <span className="font-medium">Study documents:</span> {previewSnapshot.studyDocNames.length}{" "}
                    file(s)
                  </li>
                  <li>
                    <span className="font-medium">Certificates:</span>{" "}
                    {previewSnapshot.certificateNames.length > 0
                      ? `${previewSnapshot.certificateNames.length} file(s)`
                      : "None"}
                  </li>
                  <li>
                    <span className="font-medium">SOP:</span> {previewSnapshot.sopNames.length} file(s)
                  </li>
                  <li>
                    <span className="font-medium">English requirement:</span> {previewSnapshot.englishNames.length}{" "}
                    file(s)
                  </li>
                </ul>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
    </div>
  );
};

export default Apply;
