import { test, expect } from "vitest";
import { companyProfileSchema } from "@/features/pages/validators";

const profile = {
  registered_name: "Goodluck Education And Migration Services Pvt Ltd",
  type: "Private limited company",
  registration_authority: "",
  registration_no: "296407/079/080",
  pan_no: "610340536",
  bank: "Nabil Bank Ltd",
  associations: "",
  business: "Education Counselling, IELTS Coaching, PTE Classes",
  operated_by: "Bimal Gurung and Rajeev Kunwar.",
};

test("the particulars the client sent parse", () => {
  expect(companyProfileSchema.parse(profile)).toEqual(profile);
});

test("padding is trimmed off a field", () => {
  const parsed = companyProfileSchema.parse({ ...profile, bank: "  Nabil Bank Ltd  " });
  expect(parsed.bank).toBe("Nabil Bank Ltd");
});

test("the authority and the associations may be left empty", () => {
  expect(companyProfileSchema.safeParse({ ...profile, registration_authority: "", associations: "" }).success).toBe(true);
});

test("a blank registration number is an error", () => {
  const parsed = companyProfileSchema.safeParse({ ...profile, registration_no: "   " });
  expect(parsed.success).toBe(false);
  expect(parsed.error?.flatten().fieldErrors.registration_no?.[0]).toBe("Type the company registration number.");
});

test("a registered name over the limit is an error", () => {
  expect(companyProfileSchema.safeParse({ ...profile, registered_name: "a".repeat(161) }).success).toBe(false);
});
