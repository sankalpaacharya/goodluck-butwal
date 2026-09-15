import { expect, test } from "vitest";
import { googleRatingSchema } from "@/features/settings/validators";

const problems = (input: unknown) => googleRatingSchema.safeParse(input).error?.flatten().fieldErrors;

test("the two numbers typed into the form arrive as numbers", () => {
  expect(googleRatingSchema.parse({ score: "4.9", count: "139" })).toEqual({ score: 4.9, count: 139 });
});

test("a rating above five is refused", () => {
  expect(problems({ score: "5.4", count: "139" })?.score).toBeDefined();
});

test("a review count with a decimal in it is refused", () => {
  expect(problems({ score: "5", count: "139.5" })?.count).toBeDefined();
});

test("an empty box is an error on that box, not a zero", () => {
  expect(problems({ score: "", count: "" })).toEqual({
    score: ["Type the rating Google shows."],
    count: ["Type the number of reviews."],
  });
});

test("something that is not a number at all is refused", () => {
  expect(problems({ score: "five", count: "139" })?.score).toBeDefined();
});
