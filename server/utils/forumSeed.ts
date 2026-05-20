import { prisma } from "../lib/prisma.ts";
import { FORUM_SEED_CATEGORIES } from "./forumSeedData.ts";

let seedPromise: Promise<void> | null = null;

/** Idempotent seed of official forum categories and SINUSA questions. */
export function ensureForumSeed(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runForumSeed().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}

async function runForumSeed(): Promise<void> {
  for (const cat of FORUM_SEED_CATEGORIES) {
    const category = await prisma.forumCategory.upsert({
      where: { slug: cat.slug },
      create: {
        title: cat.title,
        slug: cat.slug,
        description: cat.description ?? null,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
      update: {
        title: cat.title,
        description: cat.description ?? null,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });

    const existing = await prisma.forumSuggestedQuestion.findMany({
      where: { categoryId: category.id },
      select: { id: true, sortOrder: true, body: true },
    });

    if (existing.length === 0) {
      await prisma.forumSuggestedQuestion.createMany({
        data: cat.questions.map((q, i) => ({
          categoryId: category.id,
          label: q.label,
          body: q.body,
          sortOrder: i + 1,
        })),
      });
    }
  }
}
