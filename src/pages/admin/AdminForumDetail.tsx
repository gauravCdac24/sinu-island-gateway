import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminForumFetch } from "@/lib/forumApi";
import type { ForumSubmission } from "@/lib/forumApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Send, Globe } from "lucide-react";
import { toast } from "sonner";

const AdminForumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<ForumSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState("");
  const [authorName, setAuthorName] = useState("University Management");
  const [status, setStatus] = useState("open");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = (await adminForumFetch(`/admin/forum/submissions/${id}`)) as {
        submission: ForumSubmission;
      };
      setSubmission(data.submission);
      setStatus(data.submission.status);
    } catch {
      toast.error("Question not found");
      setSubmission(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const postReply = async (delivery: "student" | "public") => {
    if (!id || replyBody.trim().length < 10) {
      toast.error("Response must be at least 10 characters.");
      return;
    }
    setSaving(true);
    try {
      const data = (await adminForumFetch(`/admin/forum/submissions/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: replyBody,
          authorName,
          delivery,
          markAnswered: true,
        }),
      })) as { message?: string };
      toast.success(
        data.message ||
          (delivery === "public"
            ? "Published on student forum"
            : "Sent to student")
      );
      setReplyBody("");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to post");
    } finally {
      setSaving(false);
    }
  };

  const saveStatus = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const data = (await adminForumFetch(`/admin/forum/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })) as { submission: ForumSubmission };
      setSubmission(data.submission);
      toast.success("Status updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#219ebc]" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div>
        <Button variant="ghost" onClick={() => navigate("/admin/forum")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <p className="mt-4 text-gray-600">Question not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" onClick={() => navigate("/admin/forum")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to student queries
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{submission.categoryTitle}</Badge>
            <Badge>{submission.status}</Badge>
            {submission.isPublic && <Badge className="bg-[#219ebc]">On public forum</Badge>}
          </div>
          <CardTitle>{submission.subject || "Student question"}</CardTitle>
          <p className="text-sm text-gray-500">
            {submission.studentName} · {submission.studentEmail} ·{" "}
            {new Date(submission.createdAt).toLocaleString()}
          </p>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-gray-800">{submission.body}</p>
        </CardContent>
      </Card>

      {submission.replies && submission.replies.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-[#0b2c55]">Responses</h3>
          {submission.replies.map((r) => (
            <Card key={r.id} className="border-l-4 border-[#219ebc]">
              <CardContent className="pt-4">
                <p className="text-xs font-semibold text-[#082952]">{r.authorName}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm">{r.body}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Answer this query</CardTitle>
          <p className="text-sm text-gray-600">
            Choose whether the response is visible only to the student who asked, or published on
            the public Student–Management Forum page.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="author">Respondent name</Label>
            <Input
              id="author"
              className="mt-1"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="reply">Response</Label>
            <Textarea
              id="reply"
              className="mt-1 min-h-[160px]"
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              placeholder="Provide a clear, respectful, and constructive response…"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              onClick={() => void postReply("student")}
              disabled={saving}
              className="bg-[#082952] hover:bg-[#0d4080]"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send to student only
            </Button>
            <Button
              onClick={() => void postReply("public")}
              disabled={saving}
              variant="outline"
              className="border-[#219ebc] text-[#082952] hover:bg-[#219ebc]/10"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Globe className="mr-2 h-4 w-4" />
              )}
              Publish on student forum
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            <strong>Send to student:</strong> answer appears in the student&apos;s portal under My
            questions. <strong>Publish on forum:</strong> Q&amp;A appears on{" "}
            <a href="/student-management-forum" className="text-[#219ebc] underline" target="_blank" rel="noreferrer">
              Management responses
            </a>
            .
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div>
            <Label>Workflow status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mt-1 w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_review">In review</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={saveStatus} disabled={saving}>
            Save status
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminForumDetail;
