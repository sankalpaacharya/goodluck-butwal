import { and, count, desc, eq, ilike, type SQL } from "drizzle-orm";
import { db } from "@goodluck/db";
import { mediaAssets, successStories } from "@goodluck/db/schema";
import { mediaUrl } from "@/lib/utils/media-url";
import { asStatus, PAGE_SIZE, type AdminFilters } from "@/lib/utils/admin-query";

function storyWhere(f: AdminFilters) {
  const parts: (SQL | undefined)[] = [];
  if (f.q) parts.push(ilike(successStories.title, `%${f.q}%`));
  const status = asStatus(f.status);
  if (status) parts.push(eq(successStories.status, status));

  const defined = parts.filter(Boolean) as SQL[];
  return defined.length ? and(...defined) : undefined;
}

export async function listAdminSuccessStories(f: AdminFilters) {
  const where = storyWhere(f);
  const page = Math.max(1, f.page ?? 1);

  const [rows, [total]] = await Promise.all([
    db
      .select({
        id: successStories.id,
        title: successStories.title,
        status: successStories.status,
        isFeatured: successStories.isFeatured,
        publishedAt: successStories.publishedAt,
        kind: mediaAssets.kind,
        staticPath: mediaAssets.staticPath,
        cloudinaryPublicId: mediaAssets.cloudinaryPublicId,
      })
      .from(successStories)
      .leftJoin(mediaAssets, eq(successStories.imageId, mediaAssets.id))
      .where(where)
      .orderBy(desc(successStories.isFeatured), desc(successStories.publishedAt), desc(successStories.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(successStories).where(where),
  ]);

  return {
    rows: rows.map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      isFeatured: row.isFeatured,
      publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
      thumb: mediaUrl(row, 160),
    })),
    total: total.n,
    page,
  };
}

export async function getAdminSuccessStory(id: string) {
  const [row] = await db.select().from(successStories).where(eq(successStories.id, id));
  return row;
}
