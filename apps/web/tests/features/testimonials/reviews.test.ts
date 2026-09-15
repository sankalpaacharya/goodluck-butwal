import { test, expect } from "vitest";
import { createReviewSchema, updateReviewSchema } from "@/features/testimonials/validators";
import { listReviews } from "@/features/testimonials/queries";
import { formatMonth } from "@/lib/utils/datetime";

const hasDb = Boolean(process.env.DATABASE_URL);

const review = {
  name: "Sam Rai",
  avatarId: "22222222-2222-4222-8222-222222222222",
  reviewedOn: "2024-11-01",
  quote: "They walked me through every step.",
  status: "published" as const,
};

test("a review with no words in it is refused", () => {
  expect(createReviewSchema.safeParse({ ...review, quote: "   " }).success).toBe(false);
});

test("a review needs a date Google put on it", () => {
  expect(createReviewSchema.safeParse({ ...review, reviewedOn: "" }).success).toBe(false);
  expect(createReviewSchema.safeParse({ ...review, reviewedOn: "Nov 2024" }).success).toBe(false);
});

test("the photo is optional, because Google reviewers often have none", () => {
  expect(createReviewSchema.parse({ ...review, avatarId: "" }).avatarId).toBe("");
});

test("an update needs an id", () => {
  expect(updateReviewSchema.safeParse(review).success).toBe(false);
});

test("a stored date is shown the way Google dates a review", () => {
  expect(formatMonth("2024-11-01")).toBe("Nov 2024");
  expect(formatMonth("2024-08-31")).toBe("Aug 2024");
});

test.runIf(hasDb)("published reviews come back newest first, with words and a name", async () => {
  const rows = await listReviews();

  expect(rows.length).toBeGreaterThan(0);
  expect(rows.every((r) => r.name && r.quote && r.date)).toBe(true);
});
