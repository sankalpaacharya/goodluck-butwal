"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@goodluck/db";
import { pages } from "@goodluck/db/schema";
import { requireActor } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";
import { companyProfileSchema } from "@/features/pages/validators";

type Result = { ok: true; data: { slug: string } } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function updateCompanyProfile(input: unknown): Promise<Result> {
  const actor = await requireActor();
  requirePermission(actor, "settings", "update");

  const parsed = companyProfileSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Check the fields below.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const [row] = await db
    .update(pages)
    .set({ blocks: parsed.data, updatedBy: actor.id, updatedAt: new Date() })
    .where(eq(pages.slug, "company-profile"))
    .returning({ slug: pages.slug });

  if (!row) return { ok: false, error: "The company profile page is missing from the database." };

  revalidatePath("/admin/company-profile");
  revalidatePath("/company-profile");
  return { ok: true, data: { slug: row.slug } };
}
