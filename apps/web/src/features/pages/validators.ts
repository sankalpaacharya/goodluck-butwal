import { z } from "zod";

const line = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters.`);

// The four the page prints in bold are the ones it cannot read without. The rest are blank until
// the client sends them, and a blank row is left off the page.
export const companyProfileSchema = z.object({
  registered_name: line(160).min(1, "Type the registered name."),
  type: line(80),
  registration_authority: line(160),
  registration_no: line(60).min(1, "Type the company registration number."),
  pan_no: line(40).min(1, "Type the PAN number."),
  bank: line(120),
  associations: line(200),
  business: line(300).min(1, "Type what the company does."),
  operated_by: line(400),
});

export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
