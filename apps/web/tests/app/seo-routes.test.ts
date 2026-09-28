import { test, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { buildMetadataFrom } from "@/lib/seo";

const SITE = "src/app/(site)";

const defaults = {
  title: "Study Abroad & Foreign Education Advice | Goodluck",
  description: "Study abroad consultancy.",
};

type Page = { route: string; source: string };

function walk(dir: string, prefix = ""): Page[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      const segment = name.startsWith("[") ? "*" : name;
      return walk(full, `${prefix}/${segment}`);
    }
    if (name !== "page.tsx") return [];
    const source = readFileSync(full, "utf8");
    const route = prefix === "" ? "/" : prefix;
    return [{ route, source }];
  });
}

function hasPage(href: string) {
  let dir = SITE;
  for (const segment of href.split("/").filter(Boolean)) {
    const fixed = `${dir}/${segment}`;
    if (existsSync(fixed)) {
      dir = fixed;
      continue;
    }
    const dynamic = readdirSync(dir).find((name) => name.startsWith("["));
    if (!dynamic) return false;
    dir = `${dir}/${dynamic}`;
  }
  return existsSync(`${dir}/page.tsx`);
}

const pages = walk(SITE);

// The catch-all only renders the 404, and the preview routes answer to a login.
const PUBLIC = pages.filter(
  (page) => !/\/(\*|admin|preview|404)/.test(page.route) && !/notFound\(\);\s*\}\s*$/.test(page.source),
);

const generates = (page: Page) => /export (async function|const) (generateMetadata|metadata)/.test(page.source);

test("every public page has a route to read", () => {
  expect(PUBLIC.length).toBeGreaterThan(20);
});

test("no public page falls back to the layout's metadata", () => {
  const missing = PUBLIC.filter((page) => !generates(page)).map((page) => page.route);
  expect(missing).toEqual([]);
});

test("every public page goes through buildMetadata, which sets its canonical", () => {
  const bare = PUBLIC.filter(
    (page) => !/buildMetadata\(|previewMetadata/.test(page.source) && !/noindex/.test(page.source),
  ).map((page) => page.route);
  expect(bare).toEqual([]);
});

test("a page with no picture of its own still gets the site's share image", () => {
  const meta = buildMetadataFrom({ path: "/about", title: "About us" }, defaults);
  expect(meta.openGraph?.images).toEqual([
    { url: "https://goodluck.services/brand/og.png", width: 1200, height: 630, alt: "Goodluck Education & Migration" },
  ]);
  expect(meta.twitter).toMatchObject({ card: "summary_large_image", images: ["https://goodluck.services/brand/og.png"] });
});

test("a page's own picture wins over the site's share image", () => {
  const meta = buildMetadataFrom({ path: "/news/x", title: "X", image: "/images/news/x.webp" }, defaults);
  expect(meta.openGraph?.images).toEqual([{ url: "https://goodluck.services/images/news/x.webp", alt: "X" }]);
});

test("every page the sitemap lists as fixed actually has a page file behind it", () => {
  const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
  const paths = [...sitemap.matchAll(/path: "([^"]*)"/g)].map((match) => match[1]);
  const missing = paths.filter((path) => path !== "" && !hasPage(path));
  expect(missing).toEqual([]);
});

test("the sitemap leaves out offices that have no page of their own", () => {
  const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
  const officesLine = sitemap.split("\n").find((line) => line.includes("table: offices"))!;
  expect(officesLine).toContain("OFFICES_WITH_A_PAGE");
});

test("the sitemap ranks the money pages above the quiet ones", () => {
  const sitemap = readFileSync("src/app/sitemap.ts", "utf8");
  const priority = (path: string) => {
    const found = new RegExp(`path: "${path}", priority: ([\\d.]+)`).exec(sitemap);
    return found ? Number(found[1]) : undefined;
  };
  expect(priority("")).toBe(1);
  expect(priority("/services")).toBeGreaterThan(priority("/about")!);
  expect(priority("/careers")).toBeUndefined();
});

test("the home page states the services it sells in its structured data", () => {
  const home = pages.find((page) => page.route === "/");
  expect(home?.source).toContain("organization({");
  expect(home?.source).toContain("webSite()");
});

test("every news article carries the markup a blog post needs", () => {
  const article = pages.find((page) => page.route === "/news/*");
  expect(article?.source).toContain("article({");
  expect(article?.source).toContain("publishedTime: a.date");
  expect(article?.source).toContain("modifiedTime: a.updatedAt");
  expect(article?.source).toContain("breadcrumbs([");
});

test("the news index is marked up as a blog", () => {
  expect(pages.find((page) => page.route === "/news")?.source).toContain("blog({");
});
