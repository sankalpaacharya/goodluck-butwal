import { test, expect } from "vitest";
import { readFileSync } from "node:fs";
import {
  createTeamMemberSchema,
  teamPublishProblems,
  updateTeamMemberSchema,
} from "@/features/team/validators";

const office = "11111111-1111-4111-8111-111111111111";
const photo = "22222222-2222-4222-8222-222222222222";

const member = {
  officeId: office,
  fullName: "Sam Rai",
  position: "Migration Agent",
  photoId: photo,
  status: "published" as const,
};

test("qualifications and expertise come back as the list that went in", () => {
  const parsed = createTeamMemberSchema.parse({
    ...member,
    qualifications: ["MARA 1234567", "MBA"],
    expertise: ["Student visas"],
  });
  expect(parsed.qualifications).toEqual(["MARA 1234567", "MBA"]);
  expect(parsed.expertise).toEqual(["Student visas"]);
});

test("blank and padded tags are dropped", () => {
  const parsed = createTeamMemberSchema.parse({
    ...member,
    qualifications: ["  MARA 1234567  ", "", "   "],
  });
  expect(parsed.qualifications).toEqual(["MARA 1234567"]);
});

test("a member with no tags at all is fine", () => {
  expect(createTeamMemberSchema.parse(member).qualifications).toEqual([]);
});

test("a slug with spaces is refused", () => {
  expect(createTeamMemberSchema.safeParse({ ...member, slug: "Sam Rai" }).success).toBe(false);
});

test("a LinkedIn address that is not https is refused", () => {
  expect(createTeamMemberSchema.safeParse({ ...member, linkedinUrl: "linkedin.com/in/sam" }).success).toBe(false);
});

test("an update needs an id", () => {
  expect(updateTeamMemberSchema.safeParse(member).success).toBe(false);
});

test("a complete member has nothing blocking publication", () => {
  const parsed = createTeamMemberSchema.parse(member);
  expect(teamPublishProblems(parsed, { photo: "Sam Rai" })).toEqual([]);
});

test("publishing names every missing field", () => {
  const parsed = createTeamMemberSchema.parse({
    fullName: "Sam Rai",
    officeId: "",
    status: "published" as const,
  });
  expect(teamPublishProblems(parsed, {})).toEqual(["Position", "Office", "Photo"]);
});

test("a photo with no alt text blocks publication", () => {
  const parsed = createTeamMemberSchema.parse(member);
  expect(teamPublishProblems(parsed, { photo: null })).toEqual(["Alt text on the photo"]);
});

test("a payload cannot set a co-founder or featured flag", () => {
  const parsed = createTeamMemberSchema.parse({ ...member, isCoFounder: true, isFeatured: true });
  expect(parsed).not.toHaveProperty("isCoFounder");
  expect(parsed).not.toHaveProperty("isFeatured");
});

test("the editor offers no switch for either flag", () => {
  const editor = readFileSync("src/features/team/components/team-editor.tsx", "utf8");
  expect(editor).not.toMatch(/isCoFounder|isFeatured|SwitchField/);
});

test("a social address that is not https is refused", () => {
  for (const field of ["facebookUrl", "instagramUrl", "tiktokUrl", "linkedinUrl"]) {
    expect(createTeamMemberSchema.safeParse({ ...member, [field]: "facebook.com/rita" }).success).toBe(false);
  }
});

test("a social address left empty is fine, since a blank one is not shown", () => {
  const parsed = createTeamMemberSchema.parse({ ...member, facebookUrl: "", instagramUrl: "", tiktokUrl: "" });
  expect(parsed.facebookUrl).toBe("");
  expect(parsed.instagramUrl).toBe("");
  expect(parsed.tiktokUrl).toBe("");
});

test("the editor asks for all four platforms", () => {
  const editor = readFileSync("src/features/team/components/team-editor.tsx", "utf8");
  for (const field of ["facebookUrl", "instagramUrl", "tiktokUrl", "linkedinUrl"]) {
    expect(editor).toContain(field);
  }
});
