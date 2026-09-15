import { test, expect } from "vitest";
import {
  createSuccessStorySchema,
  successStoryPublishProblems,
  updateSuccessStorySchema,
} from "@/features/testimonials/validators";
import { listSuccessStories } from "@/features/testimonials/queries";

const hasDb = Boolean(process.env.DATABASE_URL);

const image = "22222222-2222-4222-8222-222222222222";
const story = { title: "Congratulations Sam Rai, student visa granted", imageId: image, status: "published" as const };

test("a story with no description is refused", () => {
  expect(createSuccessStorySchema.safeParse({ ...story, title: "  " }).success).toBe(false);
});

test("a new story is not a priority one unless it is asked for", () => {
  expect(createSuccessStorySchema.parse(story).isFeatured).toBe(false);
});

test("an update needs an id", () => {
  expect(updateSuccessStorySchema.safeParse(story).success).toBe(false);
});

test("publishing without a picture is blocked", () => {
  const parsed = createSuccessStorySchema.parse({ ...story, imageId: "" });
  expect(successStoryPublishProblems(parsed)).toEqual(["Image"]);
});

test("a story with a picture has nothing blocking publication", () => {
  expect(successStoryPublishProblems(createSuccessStorySchema.parse(story))).toEqual([]);
});

test.runIf(hasDb)("every published story comes back with a picture and a description", async () => {
  const stories = await listSuccessStories();

  expect(stories.length).toBeGreaterThan(0);
  expect(stories.every((s) => s.image.startsWith("https://res.cloudinary.com/"))).toBe(true);
  expect(stories.every((s) => s.alt.trim().length > 0)).toBe(true);
});
