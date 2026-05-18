import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/common/BackToTop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { getApiUrl } from "@/lib/apiBase";
import { fetchVacancyDetail, type PublicVacancy } from "@/lib/jobVacanciesApi";
import type {
  EmploymentRow,
  JobApplicationFormData,
  QualificationRow,
  RefereeRow,
  ResumeExtracted,
} from "@/lib/jobApplicationTypes";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Upload,
  UserCircle,
  Briefcase,
  GraduationCap,
  Users,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";
const STEPS = [
  { id: "documents", title: "Documents & CV", icon: Upload },
  { id: "position", title: "Position details", icon: Briefcase },
  { id: "personal", title: "Personal information", icon: UserCircle },
  { id: "statement", title: "Personal statement", icon: FileText },
  { id: "education", title: "Education", icon: GraduationCap },
  { id: "employment", title: "Employment history", icon: Briefcase },
  { id: "ksc", title: "Selection criteria", icon: ClipboardList },
  { id: "referees", title: "Referees & submit", icon: Users },
] as const;

const emptyQualification = (): QualificationRow => ({
  qualification: "",
  name: "",
  institution: "",
});

const emptyEmployment = (): EmploymentRow => ({
  organisation: "",
  responsibilities: "",
  years: "",
});

const emptyReferee = (): RefereeRow => ({
  name: "",
  positionTitle: "",
  organisation: "",
  address: "",
  phone: "",
});

function defaultFormData(vacancy?: PublicVacancy): JobApplicationFormData {
  const ksc: Record<string, string> = {};
  vacancy?.keySelectionCriteria?.forEach((_, i) => {
    ksc[`ksc${i + 1}`] = "";
  });
  return {
    positionApplyingFor: vacancy?.position ?? "",
    bandGrade: vacancy?.bandGrade ?? "",
    schoolDepartment: vacancy?.facultyDepartment ?? "",
    gender: "",
    personalStatement: "",
    qualifications: [emptyQualification(), emptyQualification()],
    currentlyEmployed: "",
    currentEmployer: "",
    currentPosition: "",
    currentResponsibilities: "",
    employmentPeriod: "",
    currentSalary: "",
    ifNotEmployed: "",
    previousEmployment: [
      emptyEmployment(),
      emptyEmployment(),
      emptyEmployment(),
      emptyEmployment(),
    ],
    skillsDevelopment: [emptyEmployment()],
    keySelectionCriteria: ksc,
    referees: [emptyReferee(), emptyReferee()],
    declarationAccepted: false,
    electronicSignature: "",
    signatureDate: new Date().toISOString().slice(0, 10),
  };
}

function emptyVacancyFormDefaults(): JobApplicationFormData {
  return defaultFormData();
}

function FileUploadBlock({
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
      <Label htmlFor={id} className="text-base font-semibold text-[#0b2c55]">
        {label}
        {required ? <span className="text-red-600"> *</span> : (
          <span className="text-muted-foreground font-normal"> (optional)</span>
        )}
      </Label>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Input
        id={id}
        type="file"
        multiple={multiple}
        accept={accept}
        className="cursor-pointer"
        onChange={(e) => onChange(e.target.files ? Array.from(e.target.files) : [])}
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

const JobApply = () => {
  const [searchParams] = useSearchParams();
  const vacancyNo = searchParams.get("vacancy")?.trim() || "";
  const [vacancy, setVacancy] = useState<PublicVacancy | null>(null);
  const [vacancyLoading, setVacancyLoading] = useState(true);

  useEffect(() => {
    if (!vacancyNo) {
      setVacancy(null);
      setVacancyLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchVacancyDetail(vacancyNo);
        if (!cancelled) {
          if (data.canApply && data.vacancy) {
            setVacancy(data.vacancy);
            setFormData(defaultFormData(data.vacancy));
          } else {
            setVacancy(null);
          }
        }
      } catch {
        if (!cancelled) setVacancy(null);
      } finally {
        if (!cancelled) setVacancyLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [vacancyNo]);

  const [step, setStep] = useState(0);
  const [parsing, setParsing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [resume, setResume] = useState<File[]>([]);
  const [coverLetter, setCoverLetter] = useState<File[]>([]);
  const [certifiedCopies, setCertifiedCopies] = useState<File[]>([]);
  const [referenceLetter, setReferenceLetter] = useState<File[]>([]);
  const [extracted, setExtracted] = useState<ResumeExtracted | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [lastEmployer, setLastEmployer] = useState("");
  const [lastPosition, setLastPosition] = useState("");

  const [formData, setFormData] = useState<JobApplicationFormData>(() => emptyVacancyFormDefaults());

  const progress = ((step + 1) / STEPS.length) * 100;

  const parseResume = useCallback(async (file: File) => {
    setParsing(true);
    try {
      const fd = new FormData();
      fd.append("resume", file);
      const res = await fetch(getApiUrl("/job_applications/parse-resume"), {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as { ok?: boolean; extracted?: ResumeExtracted; error?: string };
      if (!res.ok) throw new Error(data.error || "Could not parse resume.");
      const ex = data.extracted || {};
      setExtracted(ex);
      if (ex.fullName) setFullName(ex.fullName);
      if (ex.email) setEmail(ex.email);
      if (ex.phone) setPhone(ex.phone);
      if (ex.dateOfBirth) setDateOfBirth(ex.dateOfBirth);
      if (ex.address) setAddress(ex.address);
      if (ex.yearsExperience) setYearsExperience(ex.yearsExperience);
      if (ex.lastEmployer) {
        setLastEmployer(ex.lastEmployer);
        setFormData((prev) => ({ ...prev, currentEmployer: ex.lastEmployer || prev.currentEmployer }));
      }
      if (ex.lastPosition) {
        setLastPosition(ex.lastPosition);
        setFormData((prev) => ({ ...prev, currentPosition: ex.lastPosition || prev.currentPosition }));
      }
      toast.success("Resume parsed. Review and edit the extracted details.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Resume parsing failed.");
    } finally {
      setParsing(false);
    }
  }, []);

  const handleResumeChange = (files: File[]) => {
    setResume(files);
    if (files[0]) void parseResume(files[0]);
  };

  const validateStep = (s: number): boolean => {
    if (s === 0) {
      if (!resume.length) {
        toast.error("Upload your resume (CV).");
        return false;
      }
      if (!coverLetter.length) {
        toast.error("Upload your cover letter.");
        return false;
      }
      if (!certifiedCopies.length) {
        toast.error("Upload certified copies of certificates and transcripts.");
        return false;
      }
      return true;
    }
    if (s === 2) {
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        toast.error("Full name, email, and phone are required.");
        return false;
      }
      return true;
    }
    if (s === 7) {
      if (!formData.declarationAccepted) {
        toast.error("Accept the declaration to submit.");
        return false;
      }
      if (!formData.electronicSignature.trim()) {
        toast.error("Type your name as electronic signature.");
        return false;
      }
      return true;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const submitApplication = async () => {
    if (!vacancy) return;
    if (!validateStep(0) || !validateStep(2) || !validateStep(7)) return;

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("vacancyNo", vacancy.vacancyNo);
      fd.append("fullName", fullName.trim());
      fd.append("email", email.trim());
      fd.append(
        "formData",
        JSON.stringify({
          ...formData,
          contact: { fullName, email, phone, dateOfBirth, address, citizenship, yearsExperience, lastEmployer, lastPosition },
        })
      );
      if (extracted) fd.append("resumeExtracted", JSON.stringify(extracted));
      fd.append("resume", resume[0]);
      coverLetter.forEach((f) => fd.append("cover_letter", f));
      certifiedCopies.forEach((f) => fd.append("certified_copies", f));
      referenceLetter.forEach((f) => fd.append("reference_letter", f));

      const res = await fetch(getApiUrl("/job_applications"), { method: "POST", body: fd });
      const data = (await res.json()) as { ok?: boolean; message?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setSubmitted(true);
      toast.success(data.message || "Application submitted.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (vacancyLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow flex justify-center items-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-[#22a2bf]" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-[#082952] mb-4">Vacancy not found</h1>
          <p className="text-gray-600 mb-6">Select a position from the Job Opportunities page.</p>
          <Button asChild className="bg-[#ffb703] text-[#082952]">
            <Link to="/jobs-vacancies">View vacancies</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow max-w-2xl mx-auto px-4 py-16 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#082952] mb-4">Application submitted</h1>
          <p className="text-gray-600 mb-6">
            Thank you for applying for <strong>{vacancy.position}</strong> ({vacancy.vacancyNo}).
            You will only be contacted if your application is successful for the next stage of selection.
          </p>
          <Button asChild className="bg-[#ffb703] text-[#082952]">
            <Link to="/jobs-vacancies">Back to Job Opportunities</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link to="/jobs-vacancies" className="text-sm text-[#22a2bf] hover:underline">
              ← Back to Job Opportunities
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-[#082952] mt-2">
              SINU Job Application
            </h1>
            <p className="text-gray-600 mt-1">
              {vacancy.position} · {vacancy.vacancyNo}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>
                Step {step + 1} of {STEPS.length}: {STEPS[step].title}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#082952] flex items-center gap-2">
                {React.createElement(STEPS[step].icon, { className: "h-5 w-5" })}
                {STEPS[step].title}
              </CardTitle>
              <CardDescription>
                {step === 0 &&
                  "Upload your CV first — we will extract your details. Then add cover letter and certified copies."}
                {step === 7 && "Provide referee details and confirm your declaration."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 0 && (
                <>
                  <FileUploadBlock
                    id="resume"
                    label="Curriculum Vitae (Resume)"
                    description="PDF, DOCX, or TXT. We extract name, experience, employer, date of birth, and more."
                    required
                    accept=".pdf,.doc,.docx,.txt"
                    files={resume}
                    onChange={handleResumeChange}
                  />
                  {parsing && (
                    <p className="text-sm text-[#22a2bf] flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Parsing resume…
                    </p>
                  )}
                  {extracted && (
                    <div className="rounded-lg bg-[#edf4ff] border border-[#22a2bf]/30 p-4 text-sm space-y-2">
                      <p className="font-semibold text-[#082952]">Extracted from resume (editable on next steps)</p>
                      <ul className="grid sm:grid-cols-2 gap-1 text-gray-700">
                        {extracted.fullName && <li>Name: {extracted.fullName}</li>}
                        {extracted.email && <li>Email: {extracted.email}</li>}
                        {extracted.phone && <li>Phone: {extracted.phone}</li>}
                        {extracted.dateOfBirth && <li>DOB: {extracted.dateOfBirth}</li>}
                        {extracted.yearsExperience && <li>Experience: {extracted.yearsExperience} yrs</li>}
                        {extracted.lastEmployer && <li>Last employer: {extracted.lastEmployer}</li>}
                        {extracted.lastPosition && <li>Last role: {extracted.lastPosition}</li>}
                      </ul>
                    </div>
                  )}
                  <FileUploadBlock
                    id="cover"
                    label="Cover letter"
                    description="PDF or Word document."
                    required
                    accept=".pdf,.doc,.docx"
                    files={coverLetter}
                    onChange={setCoverLetter}
                  />
                  <FileUploadBlock
                    id="certs"
                    label="Certified copies — certificates & transcripts"
                    description="Upload all certified copies (PDF or images)."
                    required
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    files={certifiedCopies}
                    onChange={setCertifiedCopies}
                  />
                  <FileUploadBlock
                    id="ref"
                    label="Reference letter"
                    description="Optional but recommended."
                    accept=".pdf,.doc,.docx"
                    multiple
                    files={referenceLetter}
                    onChange={setReferenceLetter}
                  />
                </>
              )}

              {step === 1 && (
                <div className="grid gap-4">
                  <div>
                    <Label>Vacancy No.</Label>
                    <Input value={vacancy.vacancyNo} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label>Position applying for</Label>
                    <Input
                      value={formData.positionApplyingFor}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, positionApplyingFor: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Band/Grade</Label>
                    <Input
                      value={formData.bandGrade}
                      onChange={(e) => setFormData((p) => ({ ...p, bandGrade: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>School/Department</Label>
                    <Input
                      value={formData.schoolDepartment}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, schoolDepartment: e.target.value }))
                      }
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label>Full name *</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(v) => setFormData((p) => ({ ...p, gender: v }))}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="Male" id="g-m" />
                        <Label htmlFor="g-m">Male</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="Female" id="g-f" />
                        <Label htmlFor="g-f">Female</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label>Date of birth</Label>
                    <Input
                      type="date"
                      value={dateOfBirth.includes("/") ? "" : dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                    {dateOfBirth.includes("/") && (
                      <p className="text-xs text-muted-foreground mt-1">From CV: {dateOfBirth}</p>
                    )}
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <Label>Phone *</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Address</Label>
                    <Textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} />
                  </div>
                  <div>
                    <Label>Country of citizenship</Label>
                    <Input value={citizenship} onChange={(e) => setCitizenship(e.target.value)} />
                  </div>
                  <div>
                    <Label>Years of experience</Label>
                    <Input value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)} />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <Label>Personal statement — yourself and career aspirations</Label>
                  <Textarea
                    className="mt-2 min-h-[200px]"
                    value={formData.personalStatement}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, personalStatement: e.target.value }))
                    }
                  />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Education and qualifications (most recent first). Add rows as needed.
                  </p>
                  {formData.qualifications.map((q, i) => (
                    <div key={i} className="grid gap-2 border p-3 rounded-lg">
                      <Input
                        placeholder="Qualification (e.g. Bachelor)"
                        value={q.qualification}
                        onChange={(e) => {
                          const next = [...formData.qualifications];
                          next[i] = { ...q, qualification: e.target.value };
                          setFormData((p) => ({ ...p, qualifications: next }));
                        }}
                      />
                      <Input
                        placeholder="Name of qualification (include majors)"
                        value={q.name}
                        onChange={(e) => {
                          const next = [...formData.qualifications];
                          next[i] = { ...q, name: e.target.value };
                          setFormData((p) => ({ ...p, qualifications: next }));
                        }}
                      />
                      <Input
                        placeholder="Institution and country"
                        value={q.institution}
                        onChange={(e) => {
                          const next = [...formData.qualifications];
                          next[i] = { ...q, institution: e.target.value };
                          setFormData((p) => ({ ...p, qualifications: next }));
                        }}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        qualifications: [...p.qualifications, emptyQualification()],
                      }))
                    }
                  >
                    Add qualification row
                  </Button>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6">
                  <div>
                    <Label>Are you currently employed?</Label>
                    <RadioGroup
                      value={formData.currentlyEmployed}
                      onValueChange={(v) =>
                        setFormData((p) => ({
                          ...p,
                          currentlyEmployed: v as JobApplicationFormData["currentlyEmployed"],
                        }))
                      }
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="yes" id="emp-y" />
                        <Label htmlFor="emp-y">Yes</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="no" id="emp-n" />
                        <Label htmlFor="emp-n">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  {formData.currentlyEmployed === "yes" && (
                    <div className="grid gap-3">
                      <Input
                        placeholder="Current employer"
                        value={formData.currentEmployer}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, currentEmployer: e.target.value }))
                        }
                      />
                      <Input
                        placeholder="Position title"
                        value={formData.currentPosition}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, currentPosition: e.target.value }))
                        }
                      />
                      <Textarea
                        placeholder="Key responsibilities"
                        value={formData.currentResponsibilities}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, currentResponsibilities: e.target.value }))
                        }
                      />
                      <Input
                        placeholder="Period of employment"
                        value={formData.employmentPeriod}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, employmentPeriod: e.target.value }))
                        }
                      />
                      <Input
                        placeholder="Current basic salary"
                        value={formData.currentSalary}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, currentSalary: e.target.value }))
                        }
                      />
                    </div>
                  )}
                  {formData.currentlyEmployed === "no" && (
                    <Textarea
                      placeholder="If not employed, what are you currently doing?"
                      value={formData.ifNotEmployed}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, ifNotEmployed: e.target.value }))
                      }
                    />
                  )}
                  <div>
                    <Label className="mb-2 block">Other previous employment</Label>
                    {formData.previousEmployment.map((row, i) => (
                      <div key={i} className="grid gap-2 border p-3 rounded-lg mb-2">
                        <Input
                          placeholder="Organisation"
                          value={row.organisation}
                          onChange={(e) => {
                            const next = [...formData.previousEmployment];
                            next[i] = { ...row, organisation: e.target.value };
                            setFormData((p) => ({ ...p, previousEmployment: next }));
                          }}
                        />
                        <Textarea
                          placeholder="Responsibilities"
                          value={row.responsibilities}
                          onChange={(e) => {
                            const next = [...formData.previousEmployment];
                            next[i] = { ...row, responsibilities: e.target.value };
                            setFormData((p) => ({ ...p, previousEmployment: next }));
                          }}
                        />
                        <Input
                          placeholder="Years (e.g. 2018–2022)"
                          value={row.years}
                          onChange={(e) => {
                            const next = [...formData.previousEmployment];
                            next[i] = { ...row, years: e.target.value };
                            setFormData((p) => ({ ...p, previousEmployment: next }));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Answer each key selection criterion for this role (refer to the job description).
                  </p>
                  {vacancy.keySelectionCriteria?.map((criterion, i) => {
                    const key = `ksc${i + 1}`;
                    return (
                      <div key={key}>
                        <Label>
                          KSC {i + 1}: {criterion}
                        </Label>
                        <Textarea
                          className="mt-2 min-h-[100px]"
                          value={formData.keySelectionCriteria[key] || ""}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              keySelectionCriteria: {
                                ...p.keySelectionCriteria,
                                [key]: e.target.value,
                              },
                            }))
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {step === 7 && (
                <div className="space-y-6">
                  {formData.referees.map((ref, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-2">
                      <p className="font-semibold text-[#082952]">Referee {i + 1}</p>
                      <Input
                        placeholder="Name"
                        value={ref.name}
                        onChange={(e) => {
                          const next = [...formData.referees];
                          next[i] = { ...ref, name: e.target.value };
                          setFormData((p) => ({ ...p, referees: next }));
                        }}
                      />
                      <Input
                        placeholder="Position title"
                        value={ref.positionTitle}
                        onChange={(e) => {
                          const next = [...formData.referees];
                          next[i] = { ...ref, positionTitle: e.target.value };
                          setFormData((p) => ({ ...p, referees: next }));
                        }}
                      />
                      <Input
                        placeholder="Organisation"
                        value={ref.organisation}
                        onChange={(e) => {
                          const next = [...formData.referees];
                          next[i] = { ...ref, organisation: e.target.value };
                          setFormData((p) => ({ ...p, referees: next }));
                        }}
                      />
                      <Input
                        placeholder="Address"
                        value={ref.address}
                        onChange={(e) => {
                          const next = [...formData.referees];
                          next[i] = { ...ref, address: e.target.value };
                          setFormData((p) => ({ ...p, referees: next }));
                        }}
                      />
                      <Input
                        placeholder="Phone"
                        value={ref.phone}
                        onChange={(e) => {
                          const next = [...formData.referees];
                          next[i] = { ...ref, phone: e.target.value };
                          setFormData((p) => ({ ...p, referees: next }));
                        }}
                      />
                    </div>
                  ))}
                  <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700 space-y-3">
                    <p>
                      In submitting this application I confirm that the information provided is true
                      to the best of my knowledge and I am willing to participate in the selection
                      process.
                    </p>
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="decl"
                        checked={formData.declarationAccepted}
                        onCheckedChange={(c) =>
                          setFormData((p) => ({ ...p, declarationAccepted: c === true }))
                        }
                      />
                      <Label htmlFor="decl" className="leading-snug">
                        I accept the declaration above
                      </Label>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <Label>Electronic signature (type full name)</Label>
                        <Input
                          value={formData.electronicSignature}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, electronicSignature: e.target.value }))
                          }
                        />
                      </div>
                      <div>
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={formData.signatureDate}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, signatureDate: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t">
                <Button type="button" variant="outline" onClick={goBack} disabled={step === 0}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    className="bg-[#ffb703] text-[#082952] hover:bg-[#082952] hover:text-white"
                    onClick={goNext}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="bg-[#082952] text-white"
                    onClick={() => void submitApplication()}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting…
                      </>
                    ) : (
                      "Submit application"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default JobApply;
