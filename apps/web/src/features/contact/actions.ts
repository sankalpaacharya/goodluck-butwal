"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db } from "@goodluck/db";
import { offices, settings } from "@goodluck/db/schema";
import { requireActor } from "@/lib/auth/session";
import { requirePermission } from "@/lib/auth/rbac";
import { TAGS, invalidate } from "@/lib/cache";
import { contactSchema, toFieldErrors } from "@/features/contact/validators";

type Result = { ok: true; data: Record<string, never> } | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

const ICONS: Record<string, string> = {
  facebook: "/images/social/facebook.webp",
  instagram: "/images/social/instagram.webp",
  tiktok: "/images/social/tiktok.webp",
  linkedin: "/images/social/linkedin.svg",
};

const LABELS: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  linkedin: "LinkedIn",
};

function linksOf(input: { facebookUrl: string; instagramUrl: string; tiktokUrl: string; linkedinUrl: string }) {
  return (["facebook", "instagram", "tiktok", "linkedin"] as const)
    .map((key) => ({ label: LABELS[key], href: input[`${key}Url`].trim(), icon: ICONS[key] }))
    .filter((link) => link.href !== "" && link.href !== "#");
}

export async function updateContact(input: unknown): Promise<Result> {
  const actor = await requireActor();
  requirePermission(actor, "settings", "update");

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Check the fields below.", fieldErrors: toFieldErrors(parsed.error) };
  }
  const data = parsed.data;

  for (const office of data.offices) {
    const [row] = await db.select({ id: offices.id }).from(offices).where(eq(offices.id, office.id));
    if (!row) return { ok: false, error: "One of the offices no longer exists. Reload and try again." };
    await db
      .update(offices)
      .set({
        phone: office.phone.trim() === "" ? null : office.phone.trim(),
        phoneDisplay: office.phoneDisplay.trim() === "" ? null : office.phoneDisplay.trim(),
        whatsapp: office.whatsapp.trim() === "" ? null : office.whatsapp.trim(),
        email: office.email.trim() === "" ? null : office.email.trim(),
        socialLinks: linksOf(office),
        updatedBy: actor.id,
        updatedAt: new Date(),
      })
      .where(eq(offices.id, office.id));
  }

  await db
    .insert(settings)
    .values([
      { key: "footer_email", value: data.footerEmail.trim(), updatedBy: actor.id },
      { key: "social_links", value: linksOf(data), updatedBy: actor.id },
    ])
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: sql`excluded.value`, updatedBy: actor.id, updatedAt: new Date() },
    });

  invalidate(TAGS.settings, TAGS.offices);
  revalidatePath("/admin/contact");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/company-profile");
  revalidatePath("/about/careers");
  return { ok: true, data: {} };
}
