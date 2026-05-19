import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminForumFetch } from "@/lib/forumApi";
import type { ForumSubmission } from "@/lib/forumApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const AdminForumDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<ForumSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyBody, setReplyBody] = useState("");
  const [authorName, setAuthorName] = useState("University Management");
  const [isPublic, setIsPublic] = useState(false);
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
      setIsPublic(data.submission.isPublic);
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

  const postReply = async () => {
    if (!id || replyBody.trim().length < 10) {
      toast.error("Response must be at least 10 characters.");
      return;
    }
    setSaving(true);
    try {
      await adminForumFetch(`/admin/forum/submissions/${id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: replyBody,
          authorName,
          markAnswered: true,
        }),
      });
      toast.success("Response posted");
      setReplyBody("");
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to post");
    } finally {
      setSaving(false);
    }
  };

  const saveMeta = async () => {
    if (!id) return;
    setSaving(true);
    try {
      const data = (await adminForumFetch(`/admin/forum/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, isPublic }),
      })) as { submission: ForumSubmission };
      setSubmission(data.submission);
      toast.success("Updated");
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
        Back to forum
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{submission.categoryTitle}</Badge>
            <Badge>{submission.status}</Badge>
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
          <CardTitle className="text-lg">Post management response</CardTitle>
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
          <Button
            onClick={postReply}
            disabled={saving}
            className="bg-[#082952]"
          >
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Publish response
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Visibility & status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Status</Label>
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
          <div className="flex items-center gap-3">
            <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
            <Label htmlFor="public">
              Publish on public forum (students can see this Q&A)
            </Label>
          </div>
          <Button variant="outline" onClick={saveMeta} disabled={saving}>
            Save settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminForumDetail;
