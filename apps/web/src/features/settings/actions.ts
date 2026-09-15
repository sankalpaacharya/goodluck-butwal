"use server";

import { revalidatePath } from "next/cache";
import { TAGS, invalidate } from "@/lib/cache";
import { sql } from "drizzle-orm";
import { db } from "@goodluck/db";
import { settings } from "@goodluck/db/schema";
import { requireActor } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";
import { googleRatingSchema } from "@/features/settings/validators";

type Result = { ok: true; data: { score: number } } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function updateGoogleRating(input: unknown): Promise<Result> {
  const actor = await requireActor();
  requirePermission(actor, "settings", "update");

  const parsed = googleRatingSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Check the fields below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { score, count } = parsed.data;

  await db
    .insert(settings)
    .values([
      { key: "google_rating", value: score, updatedBy: actor.id },
      { key: "google_review_count", value: count, updatedBy: actor.id },
    ])
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: sql`excluded.value`, updatedBy: actor.id, updatedAt: new Date() },
    });

  invalidate(TAGS.settings);
  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/success-stories");
  return { ok: true, data: { score } };
}
