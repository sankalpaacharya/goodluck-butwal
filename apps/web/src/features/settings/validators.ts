import { z } from "zod";

// The form sends strings. Trimming before the number keeps an empty box an error rather than a
// zero, which is what a plain coercion would save.
const typedNumber = (blank: string) =>
  z.coerce.string().trim().min(1, blank).pipe(z.coerce.number("That is not a number."));

export const googleRatingSchema = z.object({
  score: typedNumber("Type the rating Google shows.").pipe(
    z.number().min(1, "A Google rating is between 1 and 5.").max(5, "A Google rating is between 1 and 5."),
  ),
  count: typedNumber("Type the number of reviews.").pipe(
    z.number().int("A review count is a whole number.").min(0, "A review count cannot be negative."),
  ),
});

export type GoogleRatingInput = z.infer<typeof googleRatingSchema>;
