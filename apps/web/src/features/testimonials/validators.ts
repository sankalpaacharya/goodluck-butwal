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
