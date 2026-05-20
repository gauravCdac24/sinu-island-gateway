import { getApiUrl } from "@/lib/apiBase";
import { authHeaders, getAdminToken, getStudentToken } from "@/lib/authStorage";

export type ForumSuggestedQuestion = {
  id: string;
  label: string;
  body: string;
  sortOrder: number;
};

export type ForumCategory = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  suggestedQuestions: ForumSuggestedQuestion[];
};

export type ForumReply = {
  id: string;
  authorRole: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type ForumSubmission = {
  id: string;
  categoryId: string;
  categoryTitle?: string;
  categorySlug?: string;
  studentName: string;
  studentEmail: string;
  subject: string | null;
  body: string;
  status: string;
  isPublic: boolean;
  suggestedQuestionId: string | null;
  createdAt: string;
  updatedAt: string;
  replies?: ForumReply[];
  replyCount?: number;
};

export type ForumMeta = {
  theme: string;
  eventLabel: string;
  objectives: string[];
};

async function parseJson(res: Response) {
  return res.json().catch(() => ({}));
}

export async function fetchForumMeta(): Promise<ForumMeta> {
  const res = await fetch(getApiUrl("/forum/meta"));
  const data = await parseJson(res);
  if (!res.ok) throw new Error((data as { error?: string }).error || "Failed to load forum");
  return data as ForumMeta;
}

export async function fetchForumCategories(): Promise<ForumCategory[]> {
  const res = await fetch(getApiUrl("/forum/categories"));
  const data = (await parseJson(res)) as { categories?: ForumCategory[]; error?: string };
  if (!res.ok) throw new Error(data.error || "Failed to load categories");
  return data.categories || [];
}

export async function fetchPublicAnswers(categorySlug?: string): Promise<ForumSubmission[]> {
  const q = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : "";
  const res = await fetch(getApiUrl(`/forum/public-answers${q}`));
  const data = (await parseJson(res)) as { submissions?: ForumSubmission[]; error?: string };
  if (!res.ok) throw new Error(data.error || "Failed to load answers");
  return data.submissions || [];
}

export async function fetchMyForumSubmissions(): Promise<ForumSubmission[]> {
  const res = await fetch(getApiUrl("/student/forum/submissions"), {
    headers: authHeaders(getStudentToken()),
  });
  const data = (await parseJson(res)) as { submissions?: ForumSubmission[]; error?: string };
  if (!res.ok) throw new Error(data.error || "Failed to load your questions");
  return data.submissions || [];
}

export async function submitForumQuestion(payload: {
  categoryId: string;
  body: string;
  subject?: string;
  suggestedQuestionId?: string;
}): Promise<ForumSubmission> {
  const res = await fetch(getApiUrl("/student/forum/submissions"), {
    method: "POST",
    headers: {
      ...authHeaders(getStudentToken()),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = (await parseJson(res)) as { submission?: ForumSubmission; error?: string };
  if (!res.ok) throw new Error(data.error || "Failed to submit question");
  return data.submission!;
}

export async function adminForumFetch(path: string, init?: RequestInit) {
  const res = await fetch(getApiUrl(path), {
    ...init,
    headers: {
      ...authHeaders(getAdminToken()),
      ...(init?.headers || {}),
    },
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error((data as { error?: string }).error || "Request failed");
  return data;
}
