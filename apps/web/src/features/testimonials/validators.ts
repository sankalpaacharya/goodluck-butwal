import { z } from "zod";
import { contentStatuses, mediaId } from "@/lib/validators/fields";

const fields = {
  title: z.string().trim().min(1, "Describe the story. This is also the image alt text."),
  imageId: mediaId,
  isFeatured: z.boolean().default(false),
  status: z.enum(contentStatuses),
};

export const createSuccessStorySchema = z.object(fields);
export const updateSuccessStorySchema = z.object({ id: z.uuid(), ...fields });

export type SuccessStoryInput = z.infer<typeof createSuccessStorySchema>;

export function successStoryPublishProblems(data: SuccessStoryInput): string[] {
  return data.imageId ? [] : ["Image"];
}

const reviewFields = {
  name: z.string().trim().min(1, "Give the reviewer's name."),
  avatarId: mediaId,
  reviewedOn: z.iso.date("Choose the month Google shows on the review."),
  quote: z.string().trim().min(1, "Paste what the reviewer wrote."),
  isFeatured: z.boolean().default(false),
  status: z.enum(contentStatuses),
};

export const createReviewSchema = z.object(reviewFields);
export const updateReviewSchema = z.object({ id: z.uuid(), ...reviewFields });

export type ReviewInput = z.infer<typeof createReviewSchema>;
