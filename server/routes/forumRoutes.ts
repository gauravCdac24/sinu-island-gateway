import { Router, Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.ts";
import { verifyAdminToken, verifyStudentToken } from "../utils/adminToken.ts";
import { ensureForumSeed } from "../utils/forumSeed.ts";
import { FORUM_EVENT_LABEL, FORUM_THEME } from "../utils/forumSeedData.ts";

const router = Router();

function paramString(p: string | string[] | undefined): string {
  if (p == null) return "";
  return Array.isArray(p) ? (p[0] ?? "") : p;
}

function queryParamString(q: unknown): string {
  if (q == null) return "";
  if (Array.isArray(q)) return String(q[0] ?? "");
  if (typeof q === "string") return q;
  return "";
}

function adminAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

function studentAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
  const verified = verifyStudentToken(token);
  if (!verified.ok || !verified.applicationId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  (req as Request & { studentApplicationId: string }).studentApplicationId =
    verified.applicationId;
  next();
}

function mapCategory(c: {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  suggestedQuestions?: { id: string; label: string; body: string; sortOrder: number }[];
}) {
  return {
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description,
    sortOrder: c.sortOrder,
    suggestedQuestions: (c.suggestedQuestions || [])
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((q) => ({
        id: q.id,
        label: q.label,
        body: q.body,
        sortOrder: q.sortOrder,
      })),
  };
}

function mapSubmission(
  s: {
    id: string;
    categoryId: string;
    studentName: string;
    studentEmail: string;
    subject: string | null;
    body: string;
    status: string;
    isPublic: boolean;
    suggestedQuestionId: string | null;
    createdAt: Date;
    updatedAt: Date;
    category?: { title: string; slug: string };
    replies?: {
      id: string;
      authorRole: string;
      authorName: string;
      body: string;
      createdAt: Date;
    }[];
  },
  includeReplies = false
) {
  return {
    id: s.id,
    categoryId: s.categoryId,
    categoryTitle: s.category?.title,
    categorySlug: s.category?.slug,
    studentName: s.studentName,
    studentEmail: s.studentEmail,
    subject: s.subject,
    body: s.body,
    status: s.status,
    isPublic: s.isPublic,
    suggestedQuestionId: s.suggestedQuestionId,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    replies: includeReplies
      ? (s.replies || [])
          .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
          .map((r) => ({
            id: r.id,
            authorRole: r.authorRole,
            authorName: r.authorName,
            body: r.body,
            createdAt: r.createdAt.toISOString(),
          }))
      : undefined,
    replyCount: s.replies?.length,
  };
}

// ─── Public: forum metadata & categories ────────────────────────────────────

router.get("/forum/meta", async (_req, res) => {
  try {
    await ensureForumSeed();
    res.json({
      theme: FORUM_THEME,
      eventLabel: FORUM_EVENT_LABEL,
      objectives: [
        "Provide students with a structured opportunity to raise key concerns affecting their learning experience",
        "Enable Management to respond openly, factually, and constructively",
        "Strengthen communication, trust, and partnership between students and the University",
        "Identify practical actions that can be progressed within available institutional capacity",
      ],
    });
  } catch (err) {
    console.error("forum/meta", err);
    res.status(500).json({ error: "Failed to load forum information." });
  }
});

router.get("/forum/categories", async (_req, res) => {
  try {
    await ensureForumSeed();
    const categories = await prisma.forumCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        suggestedQuestions: { orderBy: { sortOrder: "asc" } },
      },
    });
    res.json({
      categories: categories.map((c) => mapCategory(c)),
    });
  } catch (err) {
    console.error("forum/categories", err);
    res.status(500).json({ error: "Failed to load categories." });
  }
});

router.get("/forum/categories/:slug", async (req, res) => {
  try {
    await ensureForumSeed();
    const slug = paramString(req.params.slug);
    const category = await prisma.forumCategory.findUnique({
      where: { slug },
      include: { suggestedQuestions: { orderBy: { sortOrder: "asc" } } },
    });
    if (!category || !category.isActive) {
      return res.status(404).json({ error: "Category not found." });
    }
    res.json({ category: mapCategory(category) });
  } catch (err) {
    console.error("forum/categories/:slug", err);
    res.status(500).json({ error: "Failed to load category." });
  }
});

// Public answered Q&A (management responses published)
router.get("/forum/public-answers", async (req, res) => {
  try {
    await ensureForumSeed();
    const categorySlug = queryParamString(req.query.category);
    const where: {
      isPublic: boolean;
      status: string;
      category?: { slug: string };
    } = {
      isPublic: true,
      status: "answered",
    };
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    const submissions = await prisma.forumSubmission.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 50,
      include: {
        category: { select: { title: true, slug: true } },
        replies: true,
      },
    });

    res.json({
      submissions: submissions.map((s) => mapSubmission(s, true)),
    });
  } catch (err) {
    console.error("forum/public-answers", err);
    res.status(500).json({ error: "Failed to load public answers." });
  }
});

// ─── Student (authenticated) ────────────────────────────────────────────────

router.get("/student/forum/submissions", studentAuth, async (req, res) => {
  try {
    const applicationId = (req as Request & { studentApplicationId: string })
      .studentApplicationId;
    const submissions = await prisma.forumSubmission.findMany({
      where: { applicationId },
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { title: true, slug: true } },
        replies: true,
      },
    });
    res.json({
      submissions: submissions.map((s) => mapSubmission(s, true)),
    });
  } catch (err) {
    console.error("student/forum/submissions GET", err);
    res.status(500).json({ error: "Failed to load your questions." });
  }
});

router.post("/student/forum/submissions", studentAuth, async (req, res) => {
  try {
    const applicationId = (req as Request & { studentApplicationId: string })
      .studentApplicationId;
    const categoryId = String(req.body?.categoryId || "").trim();
    const body = String(req.body?.body || "").trim();
    const subject = String(req.body?.subject || "").trim() || null;
    const suggestedQuestionId =
      String(req.body?.suggestedQuestionId || "").trim() || null;

    if (!categoryId || body.length < 20) {
      return res.status(400).json({
        error: "Please select a category and provide a question of at least 20 characters.",
      });
    }

    const app = await prisma.studentApplication.findUnique({
      where: { id: applicationId },
    });
    if (!app) {
      return res.status(404).json({ error: "Student profile not found." });
    }

    const category = await prisma.forumCategory.findFirst({
      where: { id: categoryId, isActive: true },
    });
    if (!category) {
      return res.status(400).json({ error: "Invalid category." });
    }

    if (suggestedQuestionId) {
      const sq = await prisma.forumSuggestedQuestion.findFirst({
        where: { id: suggestedQuestionId, categoryId },
      });
      if (!sq) {
        return res.status(400).json({ error: "Invalid suggested question." });
      }
    }

    const submission = await prisma.forumSubmission.create({
      data: {
        categoryId,
        applicationId,
        studentName: app.fullName,
        studentEmail: app.email,
        subject,
        body,
        suggestedQuestionId,
        status: "open",
        isPublic: false,
      },
      include: {
        category: { select: { title: true, slug: true } },
        replies: true,
      },
    });

    res.status(201).json({
      submission: mapSubmission(submission, true),
      message: "Your question has been submitted to University Management.",
    });
  } catch (err) {
    console.error("student/forum/submissions POST", err);
    res.status(500).json({ error: "Failed to submit question." });
  }
});

// ─── Admin / Management ─────────────────────────────────────────────────────

router.get("/admin/forum/submissions", adminAuth, async (req, res) => {
  try {
    await ensureForumSeed();
    const status = queryParamString(req.query.status);
    const categorySlug = queryParamString(req.query.category);

    const where: {
      status?: string;
      category?: { slug: string };
    } = {};
    if (status) where.status = status;
    if (categorySlug) where.category = { slug: categorySlug };

    const submissions = await prisma.forumSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 200,
      include: {
        category: { select: { title: true, slug: true } },
        replies: true,
      },
    });

    const counts = await prisma.forumSubmission.groupBy({
      by: ["status"],
      _count: { _all: true },
    });

    res.json({
      submissions: submissions.map((s) => mapSubmission(s, false)),
      statusCounts: Object.fromEntries(
        counts.map((c) => [c.status, c._count._all])
      ),
    });
  } catch (err) {
    console.error("admin/forum/submissions", err);
    res.status(500).json({ error: "Failed to load submissions." });
  }
});

router.get("/admin/forum/submissions/:id", adminAuth, async (req, res) => {
  try {
    const id = paramString(req.params.id);
    const submission = await prisma.forumSubmission.findUnique({
      where: { id },
      include: {
        category: { select: { title: true, slug: true } },
        replies: true,
      },
    });
    if (!submission) {
      return res.status(404).json({ error: "Not found." });
    }
    res.json({ submission: mapSubmission(submission, true) });
  } catch (err) {
    console.error("admin/forum/submissions/:id", err);
    res.status(500).json({ error: "Failed to load submission." });
  }
});

router.patch("/admin/forum/submissions/:id", adminAuth, async (req, res) => {
  try {
    const id = paramString(req.params.id);
    const status = req.body?.status as string | undefined;
    const isPublic = req.body?.isPublic as boolean | undefined;

    const data: { status?: string; isPublic?: boolean } = {};
    const allowed = ["open", "in_review", "answered", "closed"];
    if (status !== undefined) {
      if (!allowed.includes(status)) {
        return res.status(400).json({ error: "Invalid status." });
      }
      data.status = status;
    }
    if (typeof isPublic === "boolean") {
      data.isPublic = isPublic;
    }
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: "No updates provided." });
    }

    const submission = await prisma.forumSubmission.update({
      where: { id },
      data,
      include: {
        category: { select: { title: true, slug: true } },
        replies: true,
      },
    });

    res.json({ submission: mapSubmission(submission, true) });
  } catch (err) {
    console.error("admin/forum/submissions PATCH", err);
    res.status(500).json({ error: "Failed to update submission." });
  }
});

router.post("/admin/forum/submissions/:id/replies", adminAuth, async (req, res) => {
  try {
    const id = paramString(req.params.id);
    const body = String(req.body?.body || "").trim();
    const authorName = String(req.body?.authorName || "University Management").trim();

    if (body.length < 10) {
      return res.status(400).json({ error: "Response must be at least 10 characters." });
    }

    const existing = await prisma.forumSubmission.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Not found." });
    }

    await prisma.forumReply.create({
      data: {
        submissionId: id,
        authorRole: "admin",
        authorName,
        body,
      },
    });

    const publish = req.body?.markAnswered !== false;
    const submission = await prisma.forumSubmission.update({
      where: { id },
      data: publish
        ? { status: "answered", updatedAt: new Date() }
        : { status: "in_review", updatedAt: new Date() },
      include: {
        category: { select: { title: true, slug: true } },
        replies: true,
      },
    });

    res.status(201).json({
      submission: mapSubmission(submission, true),
      message: "Response published.",
    });
  } catch (err) {
    console.error("admin/forum/replies POST", err);
    res.status(500).json({ error: "Failed to post response." });
  }
});

export default router;
