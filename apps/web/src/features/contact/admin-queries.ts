import { asc } from "drizzle-orm";
import { db } from "@goodluck/db";
import { offices } from "@goodluck/db/schema";
import { allSettings } from "@/db/settings";

export type ContactOfficeAdmin = {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
};

export type ContactAdmin = {
  offices: ContactOfficeAdmin[];
  footerEmail: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  linkedinUrl: string;
};

const urlOf = (links: { label: string; href: string }[] | null | undefined, label: string) => {
  const href = links?.find((link) => link.label.toLowerCase() === label)?.href ?? "";
  return href === "#" ? "" : href;
};

export async function getContactAdmin(): Promise<ContactAdmin> {
  const [rows, byKey] = await Promise.all([
    db
      .select({
        id: offices.id,
        code: offices.code,
        name: offices.name,
        city: offices.city,
        country: offices.country,
        phone: offices.phone,
        phoneDisplay: offices.phoneDisplay,
        whatsapp: offices.whatsapp,
        email: offices.email,
        socialLinks: offices.socialLinks,
      })
      .from(offices)
      .orderBy(asc(offices.sortOrder)),
    allSettings(),
  ]);
  const socials = (byKey.get("social_links") as { label: string; href: string }[] | undefined) ?? [];
  return {
    offices: rows.map((row) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      city: row.city ?? "",
      country: row.country,
      phone: row.phone ?? "",
      phoneDisplay: row.phoneDisplay ?? "",
      whatsapp: row.whatsapp ?? "",
      email: row.email ?? "",
      facebookUrl: urlOf(row.socialLinks, "facebook"),
      instagramUrl: urlOf(row.socialLinks, "instagram"),
      tiktokUrl: urlOf(row.socialLinks, "tiktok"),
      linkedinUrl: urlOf(row.socialLinks, "linkedin"),
    })),
    footerEmail: String(byKey.get("footer_email") ?? ""),
    facebookUrl: urlOf(socials, "facebook"),
    instagramUrl: urlOf(socials, "instagram"),
    tiktokUrl: urlOf(socials, "tiktok"),
    linkedinUrl: urlOf(socials, "linkedin"),
  };
}
