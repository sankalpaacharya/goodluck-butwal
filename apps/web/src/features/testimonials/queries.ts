import { cache } from "react";
import { TAGS, cached } from "@/lib/cache";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@goodluck/db";
import { mediaAssets, reviews, successStories } from "@goodluck/db/schema";
import { mediaUrl } from "@/lib/utils/media-url";
import { formatMonth } from "@/lib/utils/datetime";

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

export type Review = { id: string; name: string; avatar: string; date: string; quote: string };

// Same rule as the stories: the ones the admin pins lead, then the most recent review.
const listReviewsUncached = cached(async (): Promise<Review[]> => {
  const rows = await db
    .select({
      id: reviews.id,
      name: reviews.name,
      quote: reviews.quote,
      reviewedOn: reviews.reviewedOn,
      kind: mediaAssets.kind,
      staticPath: mediaAssets.staticPath,
      cloudinaryPublicId: mediaAssets.cloudinaryPublicId,
    })
    .from(reviews)
    .leftJoin(mediaAssets, eq(reviews.avatarId, mediaAssets.id))
    .where(eq(reviews.status, "published"))
    .orderBy(desc(reviews.isFeatured), desc(reviews.reviewedOn), asc(reviews.name));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    avatar: mediaUrl(row, 112),
    date: formatMonth(row.reviewedOn),
    quote: row.quote,
  }));
}, ["reviews"], [TAGS.reviews]);

export const listReviews = cache(listReviewsUncached);
