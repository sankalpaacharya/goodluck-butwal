import { cache } from "react";
import { TAGS, cached } from "@/lib/cache";
import { desc, eq } from "drizzle-orm";
import { db } from "@goodluck/db";
import { mediaAssets, successStories } from "@goodluck/db/schema";
import { mediaUrl } from "@/lib/utils/media-url";

export type SuccessStory = { id: string; image: string; alt: string };

// Featured first, then newest, so a story the admin pins leads and a story added today comes
// before one added last month.
const listSuccessStoriesUncached = cached(async (): Promise<SuccessStory[]> => {
  const rows = await db
    .select({
      id: successStories.id,
      title: successStories.title,
      kind: mediaAssets.kind,
      staticPath: mediaAssets.staticPath,
      cloudinaryPublicId: mediaAssets.cloudinaryPublicId,
    })
    .from(successStories)
    .leftJoin(mediaAssets, eq(successStories.imageId, mediaAssets.id))
    .where(eq(successStories.status, "published"))
    .orderBy(desc(successStories.isFeatured), desc(successStories.publishedAt), desc(successStories.createdAt));

  return rows
    .map((row) => ({ id: row.id, image: mediaUrl(row, 640), alt: row.title }))
    .filter((story) => story.image);
}, ["success-stories"], [TAGS.successStories]);

export const listSuccessStories = cache(listSuccessStoriesUncached);
