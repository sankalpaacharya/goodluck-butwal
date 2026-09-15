"use server";

import { revalidatePath } from "next/cache";
import { TAGS, invalidate } from "@/lib/cache";
import { eq } from "drizzle-orm";
import { db } from "@goodluck/db";
import { reviews, successStories } from "@goodluck/db/schema";
import { requireActor } from "@/lib/auth/session";
import { can, requirePermission } from "@/lib/auth/rbac";
import {
  createReviewSchema,
  createSuccessStorySchema,
  successStoryPublishProblems,
  updateReviewSchema,
  updateSuccessStorySchema,
  type ReviewInput,
  type SuccessStoryInput,
} from "@/features/testimonials/validators";

type Result<T = { id: string }> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

const blank = (value: string) => (value === "" ? null : value);

function publishRefusal(data: SuccessStoryInput) {
  if (data.status !== "published") return null;
  const problems = successStoryPublishProblems(data);
  return problems.length > 0 ? `Not ready to publish. Add: ${problems.join(", ")}.` : null;
}

function columns(data: SuccessStoryInput) {
  return {
    title: data.title,
    imageId: blank(data.imageId),
    isFeatured: data.isFeatured,
    status: data.status,
  };
}

function refresh() {
  invalidate(TAGS.successStories);
  revalidatePath("/admin/success-stories");
  revalidatePath("/");
  revalidatePath("/success-stories");
}

function refreshReviews() {
  invalidate(TAGS.reviews);
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  revalidatePath("/success-stories");
}

function reviewColumns(data: ReviewInput) {
  return {
    name: data.name,
    avatarId: blank(data.avatarId),
    reviewedOn: data.reviewedOn,
    quote: data.quote,
    isFeatured: data.isFeatured,
    status: data.status,
  };
}

export async function createSuccessStory(input: unknown): Promise<Result> {
  const actor = await requireActor();
  requirePermission(actor, "successStories", "create");

  const parsed = createSuccessStorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Check the fields below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  if (data.status === "published" && !can(actor, "successStories", "publish")) {
    return { ok: false, error: "Your role can save this story but not publish it." };
  }
  const refusal = publishRefusal(data);
  if (refusal) return { ok: false, error: refusal };

  const [created] = await db
    .insert(successStories)
    .values({
      ...columns(data),
      publishedAt: data.status === "published" ? new Date() : null,
      createdBy: actor.id,
      updatedBy: actor.id,
    })
    .returning({ id: successStories.id });

  refresh();
  return { ok: true, data: { id: created.id } };
}

export async function updateSuccessStory(input: unknown): Promise<Result> {
  const actor = await requireActor();
  requirePermission(actor, "successStories", "update");

  const parsed = updateSuccessStorySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Check the fields below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  const [existing] = await db
    .select({ id: successStories.id, status: successStories.status, publishedAt: successStories.publishedAt })
    .from(successStories)
    .where(eq(successStories.id, data.id));
  if (!existing) return { ok: false, error: "That story no longer exists." };

  if (data.status !== existing.status && !can(actor, "successStories", "publish")) {
    return { ok: false, error: "Your role can save this story but not change whether it is published." };
  }
  const refusal = publishRefusal(data);
  if (refusal) return { ok: false, error: refusal };

  await db
    .update(successStories)
    .set({
      ...columns(data),
      publishedAt: data.status === "published" ? (existing.publishedAt ?? new Date()) : null,
      updatedBy: actor.id,
      updatedAt: new Date(),
    })
    .where(eq(successStories.id, data.id));

  refresh();
  return { ok: true, data: { id: data.id } };
}

export async function deleteSuccessStory(input: unknown): Promise<Result> {
  const actor = await requireActor();
  requirePermission(actor, "successStories", "delete");

  const parsed = updateSuccessStorySchema.pick({ id: true }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "That story could not be found." };

  const [existing] = await db
    .select({ id: successStories.id })
    .from(successStories)
    .where(eq(successStories.id, parsed.data.id));
  if (!existing) return { ok: false, error: "That story no longer exists." };

  await db.delete(successStories).where(eq(successStories.id, existing.id));

  refresh();
  return { ok: true, data: { id: existing.id } };
}

export async function createReview(input: unknown): Promise<Result> {
  const actor = await requireActor();
  requirePermission(actor, "reviews", "create");

  const parsed = createReviewSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Check the fields below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  if (data.status === "published" && !can(actor, "reviews", "publish")) {
    return { ok: false, error: "Your role can save this review but not publish it." };
  }

  const [created] = await db
    .insert(reviews)
    .values({
      ...reviewColumns(data),
      publishedAt: data.status === "published" ? new Date() : null,
      createdBy: actor.id,
      updatedBy: actor.id,
    })
    .returning({ id: reviews.id });

  refreshReviews();
  return { ok: true, data: { id: created.id } };
}

export async function updateReview(input: unknown): Promise<Result> {
  const actor = await requireActor();
  requirePermission(actor, "reviews", "update");

  const parsed = updateReviewSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Check the fields below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  const [existing] = await db
    .select({ id: reviews.id, status: reviews.status, publishedAt: reviews.publishedAt })
    .from(reviews)
    .where(eq(reviews.id, data.id));
  if (!existing) return { ok: false, error: "That review no longer exists." };

  if (data.status !== existing.status && !can(actor, "reviews", "publish")) {
    return { ok: false, error: "Your role can save this review but not change whether it is published." };
  }

  await db
    .update(reviews)
    .set({
      ...reviewColumns(data),
      publishedAt: data.status === "published" ? (existing.publishedAt ?? new Date()) : null,
      updatedBy: actor.id,
      updatedAt: new Date(),
    })
    .where(eq(reviews.id, data.id));

  refreshReviews();
  return { ok: true, data: { id: data.id } };
}

export async function deleteReview(input: unknown): Promise<Result> {
  const actor = await requireActor();
  requirePermission(actor, "reviews", "delete");

  const parsed = updateReviewSchema.pick({ id: true }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "That review could not be found." };

  const [existing] = await db.select({ id: reviews.id }).from(reviews).where(eq(reviews.id, parsed.data.id));
  if (!existing) return { ok: false, error: "That review no longer exists." };

  await db.delete(reviews).where(eq(reviews.id, existing.id));

  refreshReviews();
  return { ok: true, data: { id: existing.id } };
}
