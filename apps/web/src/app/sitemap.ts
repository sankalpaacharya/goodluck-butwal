import type { MetadataRoute } from "next";
import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@goodluck/db";
import {
  courses,
  destinations,
  events,
  institutions,
  offices,
  pages,
  postCategories,
  posts,
  services,
  tags,
  teamMembers,
  testPrepCourses,
} from "@goodluck/db/schema";
import { company } from "@/config/site";
import { OFFICES_WITH_A_PAGE } from "@/features/offices/queries";

type Frequency = "weekly" | "monthly" | "yearly";

const url = (path: string) => `${company.url}${path}`;

const fixed: { path: string; priority: number; frequency: Frequency }[] = [
  { path: "", priority: 1, frequency: "weekly" },
  { path: "/destinations", priority: 0.9, frequency: "monthly" },
  { path: "/services", priority: 0.9, frequency: "monthly" },
  { path: "/courses", priority: 0.9, frequency: "weekly" },
  { path: "/institutions", priority: 0.8, frequency: "monthly" },
  { path: "/test-preparation", priority: 0.8, frequency: "monthly" },
  { path: "/contact", priority: 0.8, frequency: "monthly" },
  { path: "/contact/book-consultation", priority: 0.8, frequency: "monthly" },
  { path: "/news", priority: 0.8, frequency: "weekly" },
  { path: "/events", priority: 0.7, frequency: "weekly" },
  { path: "/test-preparation/batches", priority: 0.6, frequency: "weekly" },
  { path: "/success-stories", priority: 0.6, frequency: "monthly" },
  { path: "/faq", priority: 0.6, frequency: "monthly" },
  { path: "/about", priority: 0.6, frequency: "yearly" },
  { path: "/about/team", priority: 0.5, frequency: "monthly" },
  { path: "/about/offices", priority: 0.5, frequency: "monthly" },
  { path: "/about/message-from-co-founders", priority: 0.4, frequency: "yearly" },
  { path: "/about/corporate-social-responsibility", priority: 0.4, frequency: "yearly" },
  { path: "/about/careers", priority: 0.4, frequency: "monthly" },
  { path: "/company-profile", priority: 0.4, frequency: "yearly" },
];

const sources = [
  { table: destinations, prefix: "/destinations", frequency: "monthly" as Frequency, priority: 0.8, extra: eq(destinations.hasPage, true) },
  { table: services, prefix: "/services", frequency: "monthly" as Frequency, priority: 0.8, extra: undefined },
  { table: posts, prefix: "/news", frequency: "monthly" as Frequency, priority: 0.7, extra: undefined },
  { table: institutions, prefix: "/institutions", frequency: "monthly" as Frequency, priority: 0.7, extra: undefined },
  { table: courses, prefix: "/courses", frequency: "monthly" as Frequency, priority: 0.7, extra: undefined },
  { table: testPrepCourses, prefix: "/test-preparation", frequency: "monthly" as Frequency, priority: 0.7, extra: undefined },
  { table: events, prefix: "/events", frequency: "weekly" as Frequency, priority: 0.6, extra: undefined },
  { table: pages, prefix: "/legal", frequency: "yearly" as Frequency, priority: 0.3, extra: eq(pages.parent, "legal") },
  { table: offices, prefix: "/offices", frequency: "monthly" as Frequency, priority: 0.6, extra: inArray(offices.code, OFFICES_WITH_A_PAGE) },
  { table: teamMembers, prefix: "/team", frequency: "monthly" as Frequency, priority: 0.5, extra: undefined },
];

// Without this a metadata route is generated once and frozen until the next deployment.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [records, categories, tagRows] = await Promise.all([
    Promise.all(
      sources.map(async ({ table, prefix, frequency, priority, extra }) => {
        const rows = await db
          .select({ slug: table.slug, updatedAt: table.updatedAt })
          .from(table)
          .where(and(eq(table.status, "published"), extra));
        return rows.map((row) => ({
          url: url(`${prefix}/${row.slug}`),
          lastModified: row.updatedAt,
          changeFrequency: frequency,
          priority,
        }));
      }),
    ),
    db
      .select({ slug: postCategories.slug, updatedAt: postCategories.updatedAt })
      .from(postCategories)
      .orderBy(asc(postCategories.sortOrder)),
    db.select({ slug: tags.slug, updatedAt: tags.updatedAt }).from(tags),
  ]);

  return [
    ...fixed.map((entry) => ({
      url: url(entry.path),
      changeFrequency: entry.frequency,
      priority: entry.priority,
    })),
    ...records.flat(),
    ...categories.map((row) => ({
      url: url(`/news/category/${row.slug}`),
      lastModified: row.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...tagRows.map((row) => ({
      url: url(`/news/tag/${row.slug}`),
      lastModified: row.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
