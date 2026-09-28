import { test, expect, vi } from "vitest";

vi.mock("@goodluck/db", () => ({ db: {} }));

const { seo } = await import("@/config/site");
const { buildMetadataFrom, absoluteUrl, TITLE_SUFFIX } = await import("@/lib/seo");

const defaults = {
  title: "Goodluck Education & Migration",
  description: "Education counselling and visa guidance.",
};

test("the route title wins over the default", () => {
  const meta = buildMetadataFrom({ path: "/news", title: "News and updates" }, defaults);
  expect(meta.title).toBe("News and updates");
});

test("a route with no title falls back to the settings default", () => {
  expect(buildMetadataFrom({ path: "/news" }, defaults).title).toBe(defaults.title);
});

test("a title that already ends in the site name is not templated a second time", () => {
  const meta = buildMetadataFrom({ path: "/news", title: `News${TITLE_SUFFIX}` }, defaults);
  expect(meta.title).toEqual({ absolute: `News${TITLE_SUFFIX}` });
});

test("a missing description falls back to the settings default", () => {
  const meta = buildMetadataFrom({ path: "/faq", title: "FAQ" }, defaults);
  expect(meta.description).toBe(defaults.description);
});

test("a route that asks for noindex produces a robots noindex", () => {
  const meta = buildMetadataFrom({ path: "/preview/course/nursing", noindex: true }, defaults);
  expect(meta.robots).toEqual({ index: false, follow: false });
});

test("an ordinary page carries no robots rule", () => {
  expect(buildMetadataFrom({ path: "/news" }, defaults).robots).toBeUndefined();
});

test("the canonical url is the route's own address, made absolute", () => {
  const meta = buildMetadataFrom({ path: "/news/visa-changes" }, defaults);
  expect(meta.alternates?.canonical).toBe("https://goodluck.services/news/visa-changes");
});

test("a path is made absolute", () => {
  expect(absoluteUrl("/contact")).toBe("https://goodluck.services/contact");
});

test("an address that is already absolute is left alone", () => {
  expect(absoluteUrl("https://example.com/original")).toBe("https://example.com/original");
});

test("a published date turns the open graph type into an article", () => {
  const meta = buildMetadataFrom(
    { path: "/news/visa-changes", title: "Visa changes", publishedTime: "2026-01-04" },
    defaults,
  );
  expect(meta.openGraph).toMatchObject({ type: "article", publishedTime: "2026-01-04" });
});

test("the site name and locale travel with every page's open graph", () => {
  const meta = buildMetadataFrom({ path: "/news", title: "News" }, defaults);
  expect(meta.openGraph).toMatchObject({
    siteName: "Goodluck Education & Migration",
    locale: "en_AU",
    url: "https://goodluck.services/news",
  });
});

test("an article states its modified time, author, section and tags", () => {
  const meta = buildMetadataFrom(
    {
      path: "/news/visa-changes",
      title: "Visa changes",
      publishedTime: "2026-01-04",
      modifiedTime: "2026-02-01",
      authors: ["Rita Shrestha"],
      section: "Visa",
      tags: ["Australia"],
    },
    defaults,
  );
  expect(meta.openGraph).toMatchObject({
    type: "article",
    publishedTime: "2026-01-04",
    modifiedTime: "2026-02-01",
    authors: ["Rita Shrestha"],
    section: "Visa",
    tags: ["Australia"],
  });
  expect(meta.authors).toEqual([{ name: "Rita Shrestha" }]);
  expect(meta.category).toBe("Visa");
});

test("an article's dates and authors stay off a page that is not one", () => {
  const meta = buildMetadataFrom(
    { path: "/about", title: "About", modifiedTime: "2026-02-01", authors: ["Rita"] },
    defaults,
  );
  expect(meta.openGraph).toMatchObject({ type: "website" });
  expect(meta.openGraph).not.toHaveProperty("modifiedTime");
});

test("an image is made absolute and alt-texted for both cards", () => {
  const meta = buildMetadataFrom(
    { path: "/news/visa-changes", title: "Visa changes", image: "/images/news/visa.webp" },
    defaults,
  );
  expect(meta.openGraph?.images).toEqual([
    { url: "https://goodluck.services/images/news/visa.webp", alt: "Visa changes" },
  ]);
  expect(meta.twitter).toMatchObject({
    card: "summary_large_image",
    images: ["https://goodluck.services/images/news/visa.webp"],
  });
});

test("a page with no image of its own falls back to the site share image", () => {
  const meta = buildMetadataFrom({ path: "/about", title: "About" }, defaults);
  expect(meta.openGraph?.images).toEqual([
    { url: "https://goodluck.services/brand/og.png", width: 1200, height: 630, alt: "Goodluck Education & Migration" },
  ]);
});

test("a description typed as rich text loses its tags before it reaches the head", () => {
  const meta = buildMetadataFrom(
    { path: "/services/visa-guidance", description: "<p>We help with <strong>visas</strong>.</p>" },
    defaults,
  );
  expect(meta.description).toBe("We help with visas.");
});

test("a description longer than the snippet is cut on a word boundary", () => {
  const long = `${"study abroad advice ".repeat(12)}end`;
  const meta = buildMetadataFrom({ path: "/x", description: long }, defaults);
  expect((meta.description as string).length).toBeLessThanOrEqual(155);
  expect(meta.description).not.toMatch(/study$/);
});

test("blank keywords are dropped rather than emitted as empty entries", () => {
  const meta = buildMetadataFrom({ path: "/x", keywords: ["IELTS", "  "] }, defaults);
  expect(meta.keywords).toEqual(["IELTS"]);
});

test("a page with no keywords carries no keywords tag", () => {
  expect(buildMetadataFrom({ path: "/x" }, defaults).keywords).toBeUndefined();
});

test("a route with no description of its own still gets a description", () => {
  const meta = buildMetadataFrom({ path: "/" }, { title: defaults.title, description: "" });
  expect(meta.description).toBeUndefined();
});

test("the site default description is set even when no admin setting exists", () => {
  expect(seo.description.length).toBeGreaterThan(50);
  expect(seo.title).toMatch(/study abroad/i);
});
