import { test, expect } from "vitest";
import { readFileSync } from "node:fs";

const CLOUD = "https://res.cloudinary.com";

const teamProfile = readFileSync("src/app/(site)/team/[slug]/page.tsx", "utf8");
const postPreview = readFileSync("src/app/(site)/preview/post/[slug]/page.tsx", "utf8");

test.each([
  ["the team profile", teamProfile],
  ["the post preview", postPreview],
])("%s asks mediaUrl for its picture rather than reading staticPath", (_label, source) => {
  expect(source).toMatch(/mediaUrl\(/);
  expect(source).toContain("cloudinaryPublicId: mediaAssets.cloudinaryPublicId");
});

test("a picture on Cloudinary resolves to a Cloudinary url", async () => {
  const { mediaUrl } = await import("@/lib/utils/media-url");
  const url = mediaUrl({ kind: "cloudinary", staticPath: null, cloudinaryPublicId: "goodluck/team/lekhnath" }, 640);
  expect(url.startsWith(CLOUD)).toBe(true);
  expect(url).toContain("goodluck/team/lekhnath");
});

test("a picture that ships with the site still resolves", async () => {
  const { mediaUrl } = await import("@/lib/utils/media-url");
  const url = mediaUrl({ kind: "static", staticPath: "/images/team/bimal-gurung.webp", cloudinaryPublicId: null }, 640);
  expect(url).toContain("bimal-gurung");
});

test("a record with no picture at all resolves to nothing rather than a broken url", async () => {
  const { mediaUrl } = await import("@/lib/utils/media-url");
  expect(mediaUrl({ kind: "cloudinary", staticPath: null, cloudinaryPublicId: null }, 640)).toBe("");
});
