import { test, expect, vi } from "vitest";

vi.mock("@goodluck/db", () => ({ db: {} }));

const { toJsonLd, organization, webSite, article, blog, person, event, localBusiness, breadcrumbs, faqPage } =
  await import("@/lib/seo/schema");

test("a < inside a value cannot close the script tag", () => {
  const json = toJsonLd({ name: "<\/script><script>alert(1)</script>" });
  expect(json).not.toContain("<");
  expect(json).toContain("\\u003c");
});

test("the organization has the fields a rich result needs", () => {
  const org = organization({ socials: ["https://facebook.com/goodluck"] });
  expect(org["@type"]).toBe("EducationalOrganization");
  expect(org.name).toBe("Goodluck Education & Migration");
  expect(org.url).toBe("https://goodluck.services");
  expect(org.logo).toBe("https://goodluck.services/brand/logo.png");
  expect(org.sameAs).toEqual(["https://facebook.com/goodluck"]);
});

test("the organization lists the services it offers", () => {
  const org = organization({
    services: [{ name: "Education counselling", slug: "education-counselling", description: "Course and university advice." }],
  });
  const offer = (org.makesOffer as { itemOffered: { url: string; name: string } }[])[0];
  expect(offer.itemOffered.name).toBe("Education counselling");
  expect(offer.itemOffered.url).toBe("https://goodluck.services/services/education-counselling");
});

test("an organization with no services leaves makesOffer out", () => {
  expect(organization()).not.toHaveProperty("makesOffer");
});

test("the website advertises the on-site search box", () => {
  const site = webSite();
  const action = site.potentialAction as { target: { urlTemplate: string }; "query-input": string };
  expect(site["@type"]).toBe("WebSite");
  expect(action.target.urlTemplate).toBe("https://goodluck.services/search?q={search_term_string}");
});

test("an article names its author, dates and section", () => {
  const schema = article({
    slug: "student-visa-changes",
    title: "Student visa changes for 2026",
    excerpt: "What changed.",
    image: "/images/news/visa.webp",
    date: "2026-01-04",
    updatedAt: "2026-02-01T00:00:00.000Z",
    author: "Rita Shrestha",
    category: "Visa",
    tags: ["Australia", "Student visa"],
  });
  expect(schema["@type"]).toBe("BlogPosting");
  expect(schema.datePublished).toBe("2026-01-04");
  expect(schema.dateModified).toBe("2026-02-01T00:00:00.000Z");
  expect(schema.articleSection).toBe("Visa");
  expect(schema.author).toEqual({
    "@type": "Person",
    name: "Rita Shrestha",
    worksFor: { "@id": "https://goodluck.services/#organization" },
  });
});

test("an article with no author falls back to the organization", () => {
  const schema = article({ slug: "news-item", title: "News", excerpt: "", image: "", date: "2026-01-04" });
  expect(schema.author).toEqual({ "@id": "https://goodluck.services/#organization" });
});

test("a headline longer than a search result keeps only its opening words", () => {
  const schema = article({ slug: "long", title: "word ".repeat(40), excerpt: "", image: "", date: "2026-01-04" });
  expect((schema.headline as string).length).toBeLessThanOrEqual(110);
});

test("a blog points at every post it lists", () => {
  const schema = blog({
    name: "News",
    description: "Updates",
    path: "/news",
    posts: [{ slug: "visa-changes", title: "Visa changes", excerpt: "", image: "", date: "2026-01-04" }],
  });
  expect(schema["@type"]).toBe("Blog");
  expect(schema.blogPost).toEqual([{ "@id": "https://goodluck.services/news/visa-changes#article" }]);
});

test("a person is tied to the organization they work for", () => {
  const schema = person({ name: "Rita Shrestha", slug: "rita-shrestha", jobTitle: "Counsellor" });
  expect(schema["@type"]).toBe("Person");
  expect(schema.worksFor).toEqual({ "@id": "https://goodluck.services/#organization" });
});

test("an office states its hours in the form a search engine reads", () => {
  const schema = localBusiness({
    name: "Head Office",
    address: "2 Queen St",
    city: "Melbourne",
    country: "Australia",
    phone: "(03) 9466 4783",
    structuredHours: [
      { day: 0, open: "", close: "", closed: true },
      { day: 1, open: "09:00", close: "17:00", closed: false },
    ],
  });
  expect(schema.openingHoursSpecification).toEqual([
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "https://schema.org/Monday",
      opens: "09:00",
      closes: "17:00",
    },
  ]);
});

test("an organization with no social profiles leaves sameAs out", () => {
  expect(organization()).not.toHaveProperty("sameAs");
});

test("a breadcrumb trail lists its ancestors in order", () => {
  const crumbs = breadcrumbs([
    { name: "Home", path: "/" },
    { name: "News", path: "/news" },
    { name: "Visa changes", path: "/news/visa-changes" },
  ]);
  expect(crumbs.itemListElement).toEqual([
    { "@type": "ListItem", position: 1, name: "Home", item: "https://goodluck.services/" },
    { "@type": "ListItem", position: 2, name: "News", item: "https://goodluck.services/news" },
    {
      "@type": "ListItem",
      position: 3,
      name: "Visa changes",
      item: "https://goodluck.services/news/visa-changes",
    },
  ]);
});

test("an event carries its start and end times in ISO form", () => {
  const schema = event({
    slug: "melbourne-fair",
    title: "Melbourne education fair",
    summary: "Meet our counsellors.",
    image: "",
    startsAt: new Date("2026-03-01T09:00:00Z"),
    endsAt: new Date("2026-03-01T15:30:00Z"),
    isOnline: false,
    onlineUrl: null,
    venueName: "Queen St",
    venueAddress: "2 Queen St, Melbourne",
    officeName: "Melbourne",
  });
  expect(schema.startDate).toBe("2026-03-01T09:00:00.000Z");
  expect(schema.endDate).toBe("2026-03-01T15:30:00.000Z");
});

test("an online event points at a virtual location", () => {
  const schema = event({
    slug: "webinar",
    title: "Study in Australia webinar",
    summary: "",
    image: "",
    startsAt: new Date("2026-03-01T09:00:00Z"),
    endsAt: null,
    isOnline: true,
    onlineUrl: "https://meet.example.com/webinar",
    venueName: null,
    venueAddress: null,
    officeName: "Butwal",
  });
  expect(schema.location).toEqual({
    "@type": "VirtualLocation",
    url: "https://meet.example.com/webinar",
  });
  expect(schema).not.toHaveProperty("endDate");
});

test("each faq question keeps its answer", () => {
  const schema = faqPage([{ q: "Do you charge a fee?", a: "<p>No.</p>" }]);
  expect(schema.mainEntity).toEqual([
    {
      "@type": "Question",
      name: "Do you charge a fee?",
      acceptedAnswer: { "@type": "Answer", text: "<p>No.</p>" },
    },
  ]);
});
