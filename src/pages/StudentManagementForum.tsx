import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StudentPageShell from "@/components/student-ui/StudentPageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  fetchForumCategories,
  fetchForumMeta,
  fetchMyForumSubmissions,
  fetchPublicAnswers,
  submitForumQuestion,
  type ForumCategory,
  type ForumMeta,
  type ForumSubmission,
} from "@/lib/forumApi";
import { getStudentToken } from "@/lib/authStorage";
import {
  Calendar,
  Loader2,
  MessageSquare,
  Send,
  Users,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

const statusLabel: Record<string, string> = {
  open: "Awaiting response",
  in_review: "Under review",
  answered: "Answered",
  closed: "Closed",
};

const StudentManagementForum = () => {
  const [meta, setMeta] = useState<ForumMeta | null>(null);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [publicAnswers, setPublicAnswers] = useState<ForumSubmission[]>([]);
  const [myQuestions, setMyQuestions] = useState<ForumSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [categoryId, setCategoryId] = useState("");
  const [suggestedQuestionId, setSuggestedQuestionId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const isLoggedIn = Boolean(getStudentToken());

  const load = async () => {
    setLoading(true);
    try {
      const [m, cats, answers] = await Promise.all([
        fetchForumMeta(),
        fetchForumCategories(),
        fetchPublicAnswers(),
      ]);
      setMeta(m);
      setCategories(cats);
      setPublicAnswers(answers);
      if (getStudentToken()) {
        const mine = await fetchMyForumSubmissions();
        setMyQuestions(mine);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load forum");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please sign in to submit a question.");
      return;
    }
    setSubmitting(true);
    try {
      await submitForumQuestion({
        categoryId,
        body,
        subject: subject || undefined,
        suggestedQuestionId: suggestedQuestionId || undefined,
      });
      toast.success("Your question has been submitted to University Management.");
      setBody("");
      setSubject("");
      setSuggestedQuestionId("");
      const mine = await fetchMyForumSubmissions();
      setMyQuestions(mine);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const prefillFromSuggested = (qId: string, qBody: string, catId: string) => {
    setCategoryId(catId);
    setSuggestedQuestionId(qId);
    setBody(qBody);
    document.getElementById("ask-question")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <StudentPageShell>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#082952] via-[#0b2c55] to-[#219ebc] text-white">
        <div className="container relative z-10 mx-auto px-4 py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#8ecae6]">
            SINU · Student Voice
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            Student–Management Forum
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/90">
            {meta?.theme ||
              "Building a Stronger University Community Through Dialogue and Partnership"}
          </p>
          {meta?.eventLabel && (
            <p className="mt-3 flex items-center gap-2 text-sm text-[#8ecae6]">
              <Calendar className="h-4 w-4 shrink-0" />
              {meta.eventLabel}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="bg-white text-[#082952] hover:bg-white/90">
              <a href="#ask-question">Ask a question</a>
            </Button>
            {!isLoggedIn && (
              <Button
                asChild
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10"
              >
                <Link to="/student-login">Student sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {meta?.objectives && (
        <section className="border-b border-gray-100 bg-gray-50 py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-xl font-bold text-[#082952]">
              Forum objectives
            </h2>
            <ul className="mx-auto mt-6 grid max-w-4xl gap-3 md:grid-cols-2">
              {meta.objectives.map((obj, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#219ebc]" />
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-[#219ebc]" />
          </div>
        ) : (
          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="mb-8 flex h-auto w-full flex-wrap justify-start gap-1 bg-gray-100 p-1">
              <TabsTrigger value="categories" className="gap-2">
                <Users className="h-4 w-4" />
                SINUSA questions (9 areas)
              </TabsTrigger>
              <TabsTrigger value="answers" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Management responses
              </TabsTrigger>
              {isLoggedIn && (
                <TabsTrigger value="mine" className="gap-2">
                  <Clock className="h-4 w-4" />
                  My questions
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="categories">
              <p className="mb-6 max-w-3xl text-gray-600">
                These are the structured questions submitted by SINUSA for the
                Vice-Chancellor Student Forum. You may use them as a reference or
                submit your own related question in the same category.
              </p>
              <Accordion type="single" collapsible className="space-y-2">
                {categories.map((cat, idx) => (
                  <AccordionItem
                    key={cat.id}
                    value={cat.slug}
                    className="rounded-lg border border-gray-200 bg-white px-4 shadow-sm"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="flex items-start gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#082952] text-sm font-bold text-white">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-[#082952]">{cat.title}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ol className="ml-11 list-none space-y-4 border-l-2 border-[#8ecae6]/50 pl-4">
                        {cat.suggestedQuestions.map((q) => (
                          <li key={q.id} className="text-sm text-gray-700">
                            <span className="font-semibold text-[#219ebc]">
                              {q.label}.
                            </span>{" "}
                            {q.body}
                            {isLoggedIn && (
                              <Button
                                type="button"
                                variant="link"
                                className="ml-1 h-auto p-0 text-[#082952]"
                                onClick={() =>
                                  prefillFromSuggested(q.id, q.body, cat.id)
                                }
                              >
                                Ask this
                              </Button>
                            )}
                          </li>
                        ))}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="answers">
              {publicAnswers.length === 0 ? (
                <Card>
                  <CardContent className="py-10 text-center text-gray-500">
                    No published management responses yet. Responses will appear here
                    once staff have answered and published them.
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {publicAnswers.map((s) => (
                    <Card key={s.id}>
                      <CardHeader className="pb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary">{s.categoryTitle}</Badge>
                          <Badge className="bg-emerald-600">Answered</Badge>
                        </div>
                        <CardTitle className="text-base font-medium text-gray-900">
                          {s.subject || "Student question"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4 text-sm">
                        <p className="whitespace-pre-wrap text-gray-700">{s.body}</p>
                        {s.replies?.map((r) => (
                          <div
                            key={r.id}
                            className="rounded-lg border-l-4 border-[#219ebc] bg-[#f0f9fc] p-4"
                          >
                            <p className="text-xs font-semibold text-[#082952]">
                              {r.authorName}
                            </p>
                            <p className="mt-2 whitespace-pre-wrap text-gray-800">
                              {r.body}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {isLoggedIn && (
              <TabsContent value="mine">
                {myQuestions.length === 0 ? (
                  <Card>
                    <CardContent className="py-10 text-center text-gray-500">
                      You have not submitted any questions yet.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {myQuestions.map((s) => (
                      <Card key={s.id}>
                        <CardHeader className="pb-2">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">{s.categoryTitle}</Badge>
                            <Badge
                              variant={
                                s.status === "answered" ? "default" : "secondary"
                              }
                            >
                              {statusLabel[s.status] || s.status}
                            </Badge>
                          </div>
                          <CardTitle className="text-base">
                            {s.subject || "Your question"}
                          </CardTitle>
                          <p className="text-xs text-gray-500">
                            Submitted {new Date(s.createdAt).toLocaleString()}
                          </p>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                          <p className="whitespace-pre-wrap text-gray-700">{s.body}</p>
                          {s.replies?.map((r) => (
                            <div
                              key={r.id}
                              className="rounded-lg border bg-gray-50 p-3"
                            >
                              <p className="text-xs font-semibold text-[#082952]">
                                {r.authorName}
                              </p>
                              <p className="mt-1 whitespace-pre-wrap">{r.body}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        )}
      </section>

      <section id="ask-question" className="border-t bg-[#f0f4f8] py-14">
        <div className="container mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-bold text-[#082952]">Submit your question</h2>
          <p className="mt-2 text-sm text-gray-600">
            Questions are routed to the relevant University Management offices.
            Be constructive, specific, and respectful.
          </p>

          {!isLoggedIn ? (
            <Card className="mt-6">
              <CardContent className="py-8 text-center">
                <p className="mb-4 text-gray-600">
                  Sign in with your SINU student portal account to submit a question.
                </p>
                <Button asChild className="bg-[#082952]">
                  <Link to="/student-login">Student sign in</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger id="category" className="mt-1">
                    <SelectValue placeholder="Select a forum area" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory && selectedCategory.suggestedQuestions.length > 0 && (
                <div>
                  <Label htmlFor="suggested">Related SINUSA question (optional)</Label>
                  <Select
                    value={suggestedQuestionId}
                    onValueChange={(v) => {
                      setSuggestedQuestionId(v);
                      const q = selectedCategory.suggestedQuestions.find(
                        (x) => x.id === v
                      );
                      if (q) setBody(q.body);
                    }}
                  >
                    <SelectTrigger id="suggested" className="mt-1">
                      <SelectValue placeholder="Link to an official forum question" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory.suggestedQuestions.map((q) => (
                        <SelectItem key={q.id} value={q.id}>
                          {q.label}. {q.body.slice(0, 60)}…
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="subject">Subject (optional)</Label>
                <Input
                  id="subject"
                  className="mt-1"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary"
                />
              </div>

              <div>
                <Label htmlFor="body">Your question</Label>
                <Textarea
                  id="body"
                  className="mt-1 min-h-[140px]"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  minLength={20}
                  placeholder="Describe your concern or question clearly…"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting || !categoryId}
                className="w-full bg-[#082952] sm:w-auto"
              >
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Submit to Management
              </Button>
            </form>
          )}
        </div>
      </section>
    </StudentPageShell>
  );
};

export default StudentManagementForum;
