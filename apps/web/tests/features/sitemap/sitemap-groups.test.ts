import { test, expect, vi } from "vitest";

const rows = vi.hoisted(() => ({
  destinations: [] as { slug: string; name: string; hasPage: boolean }[],
  institutions: [] as { slug: string; name: string }[],
  courses: [] as { slug: string; name: string }[],
  services: [] as { slug: string; title: string }[],
  testPrep: [] as { slug: string; name: string }[],
  events: [] as { article: { slug: string; title: string } }[],
  articles: [] as { slug: string; title: string }[],
  categories: [] as { slug: string; name: string }[],
  team: [] as { slug: string; name: string }[],
  offices: [] as { slug: string; city: string; country: string }[],
}));

vi.mock("@/features/destinations/queries", () => ({ listDestinations: async () => rows.destinations }));
vi.mock("@/features/institutions/queries", () => ({ listInstitutions: async () => rows.institutions }));
vi.mock("@/features/services/queries", () => ({ listServices: async () => rows.services }));
vi.mock("@/features/test-prep/queries", () => ({ listTestPrepCourses: async () => rows.testPrep }));
vi.mock("@/features/events/queries", () => ({ listEventCards: async () => rows.events }));
vi.mock("@/features/posts/queries", () => ({ listArticles: async () => rows.articles, listCategories: async () => rows.categories }));
vi.mock("@/features/team/queries", () => ({ listTeam: async () => rows.team }));
vi.mock("@/features/offices/queries", () => ({ listOfficeProfiles: async () => rows.offices }));

const { listSitemapGroups } = await import("@/features/sitemap/queries");

const links = async () => (await listSitemapGroups()).flatMap((group) => group.links);

test("a destination with no page of its own is left out", async () => {
  rows.destinations = [
    { slug: "australia", name: "Australia", hasPage: true },
    { slug: "new-zealand", name: "New Zealand", hasPage: false },
  ];
  const hrefs = (await links()).map((link) => link.href);
  expect(hrefs).toContain("/destinations/australia");
  expect(hrefs).not.toContain("/destinations/new-zealand");
});

test("the index page for each catalogue is listed alongside its entries", async () => {
  rows.destinations = [];
  rows.services = [{ slug: "ielts-coaching", title: "IELTS Coaching" }];
  const found = await links();
  expect(found.find((l) => l.href === "/services")?.kind).toBe("index");
  expect(found.find((l) => l.href === "/services/ielts-coaching")?.kind).toBe("page");
});

test("an office is listed under its own page, named by city", async () => {
  rows.offices = [{ slug: "melbourne", city: "Melbourne", country: "Australia" }];
  const link = (await links()).find((l) => l.href === "/offices/melbourne");
  expect(link?.label).toBe("Melbourne, Australia");
});

test("every group has an id that a jump link can point at", async () => {
  for (const group of await listSitemapGroups()) {
    expect(group.id).toMatch(/^[a-z-]+$/);
    expect(group.links.length).toBeGreaterThan(0);
  }
});

test("the same page is never listed twice", async () => {
  rows.articles = [{ slug: "visa-changes", title: "Visa changes" }];
  rows.categories = [{ slug: "student-visa", name: "Student visa" }];
  const hrefs = (await links()).map((link) => link.href);
  expect(new Set(hrefs).size).toBe(hrefs.length);
});

test("every link is a site path, not an outside address", async () => {
  for (const link of await links()) {
    expect(link.href.startsWith("/")).toBe(true);
    expect(link.href).not.toContain("//");
  }
});

test("every group opens with a page of its own", async () => {
  for (const group of await listSitemapGroups()) {
    expect(group.links[0].kind).toBe("index");
  }
});
