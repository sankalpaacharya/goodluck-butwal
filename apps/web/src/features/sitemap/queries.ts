import { cache } from "react";
import { TAGS, cached } from "@/lib/cache";
import { and, asc, eq } from "drizzle-orm";
import { db } from "@goodluck/db";
import { courses, institutions } from "@goodluck/db/schema";
import { listServices } from "@/features/services/queries";
import { listDestinations } from "@/features/destinations/queries";
import { listInstitutions } from "@/features/institutions/queries";
import { listTestPrepCourses } from "@/features/test-prep/queries";
import { listEventCards } from "@/features/events/queries";
import { listArticles, listCategories } from "@/features/posts/queries";
import { listTeam } from "@/features/team/queries";
import { listOfficeProfiles } from "@/features/offices/queries";

// "index" is a section's own page, "page" is a record inside it.
export type SitemapLink = { href: string; label: string; kind: "index" | "page" };
export type SitemapGroup = { id: string; title: string; links: SitemapLink[] };

// listCourses pages its results, so the whole list needs its own read.
const listCourseLinksUncached = cached(
  async (): Promise<{ name: string; slug: string }[]> => {
    const rows = await db
      .select({ name: courses.name, slug: courses.slug })
      .from(courses)
      .innerJoin(institutions, eq(courses.institutionId, institutions.id))
      .where(and(eq(courses.status, "published"), eq(institutions.status, "published")))
      .orderBy(asc(courses.name));
    return rows;
  },
  ["sitemap-courses"],
  [TAGS.courses],
);

const index = (href: string, label: string): SitemapLink => ({ href, label, kind: "index" });

const under = <T>(
  prefix: string,
  rows: T[],
  slug: (row: T) => string,
  label: (row: T) => string,
): SitemapLink[] => rows.map((row) => ({ href: `${prefix}/${slug(row)}`, label: label(row), kind: "page" }));

export const listSitemapGroups = cache(async (): Promise<SitemapGroup[]> => {
  const [destinations, institutions, courses, services, testPrep, events, articles, categories, team, offices] =
    await Promise.all([
      listDestinations(),
      listInstitutions(),
      listCourseLinksUncached(),
      listServices(),
      listTestPrepCourses(),
      listEventCards(),
      listArticles(),
      listCategories(),
      listTeam(),
      listOfficeProfiles(),
    ]);

  return [
    {
      id: "study-abroad",
      title: "Study abroad",
      links: [
        index("/destinations", "Destinations"),
        ...under("/destinations", destinations.filter((d) => d.hasPage), (d) => d.slug, (d) => d.name),
        index("/institutions", "Institutions"),
        ...under("/institutions", institutions, (i) => i.slug, (i) => i.name),
        index("/courses", "Courses"),
        ...under("/courses", courses, (c) => c.slug, (c) => c.name),
      ],
    },
    {
      id: "services",
      title: "Services",
      links: [
        index("/services", "All services"),
        ...under("/services", services, (s) => s.slug, (s) => s.title),
        index("/test-preparation", "Test preparation"),
        ...under("/test-preparation", testPrep, (c) => c.slug, (c) => c.name),
        index("/test-preparation/batches", "Upcoming batches"),
        index("/events", "Events"),
        ...under("/events", events, (e) => e.article.slug, (e) => e.article.title),
      ],
    },
    {
      id: "news",
      title: "News and updates",
      links: [
        index("/news", "All articles"),
        ...under("/news", articles, (a) => a.slug, (a) => a.title),
        ...under("/news/category", categories, (c) => c.slug, (c) => c.name),
      ],
    },
    {
      id: "about",
      title: "About Goodluck",
      links: [
        index("/about", "About us"),
        index("/about/team", "Our team"),
        ...under("/team", team, (m) => m.slug, (m) => m.name),
        index("/about/offices", "Our offices"),
        ...under("/offices", offices, (o) => o.slug, (o) => `${o.city}, ${o.country}`),
        index("/about/message-from-co-founders", "Message from co-founders"),
        index("/about/corporate-social-responsibility", "Social responsibility"),
        index("/about/careers", "Careers"),
        index("/company-profile", "Company profile"),
      ],
    },
    {
      id: "support",
      title: "Support",
      links: [
        index("/contact", "Contact"),
        index("/contact/book-consultation", "Book a consultation"),
        index("/faq", "Frequently asked questions"),
        index("/success-stories", "Success stories"),
        index("/legal/privacy-policy", "Privacy policy"),
        index("/legal/terms", "Terms and conditions"),
      ],
    },
  ];
});


