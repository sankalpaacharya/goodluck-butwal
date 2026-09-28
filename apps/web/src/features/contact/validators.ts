import { z } from "zod";

const optionalUrl = (message: string) =>
  z
    .string()
    .trim()
    .max(500, "That link is too long.")
    .refine((value) => value === "" || value === "#" || /^https?:\/\/.+\..+/.test(value), { message });

const optionalPhone = z.string().trim().max(40, "That number is too long.");

const optionalEmail = z
  .string()
  .trim()
  .max(254, "That email is too long.")
  .refine((value) => value === "" || z.string().email().safeParse(value).success, {
    message: "That email does not look right.",
  });

const officeSchema = z.object({
  id: z.string().uuid("That office is missing."),
  phone: optionalPhone,
  phoneDisplay: optionalPhone,
  whatsapp: optionalPhone,
  email: optionalEmail,
  facebookUrl: optionalUrl("Use a full link starting with https://."),
  instagramUrl: optionalUrl("Use a full link starting with https://."),
  tiktokUrl: optionalUrl("Use a full link starting with https://."),
  linkedinUrl: optionalUrl("Use a full link starting with https://."),
});

export const contactSchema = z.object({
  footerEmail: z
    .string()
    .trim()
    .max(254, "That email is too long.")
    .refine((value) => z.string().email().safeParse(value).success, {
      message: "Type the email the footer shows.",
    }),
  facebookUrl: optionalUrl("Use a full link starting with https://."),
  instagramUrl: optionalUrl("Use a full link starting with https://."),
  tiktokUrl: optionalUrl("Use a full link starting with https://."),
  linkedinUrl: optionalUrl("Use a full link starting with https://."),
  offices: z.array(officeSchema).min(1, "There is at least one office."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export function toFieldErrors(error: z.ZodError): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".");
    if (!key) continue;
    (out[key] ??= []).push(issue.message);
  }
  return out;
}
