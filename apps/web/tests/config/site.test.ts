import { test, expect } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { nav, offices, seo } from "@/config/site";

const SITE = "src/app/(site)";

// Walks the route folders, letting a [param] folder stand in for any segment.
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

test("every nav link and dropdown child has a page behind it", () => {
  const hrefs = nav.flatMap((item) => ("children" in item ? item.children.map((c) => c.href) : [item.href]));
  const missing = hrefs.filter((href) => !hasPage(href));
  expect(missing).toEqual([]);
});

test("the default title fits in a search result", () => {
  expect(seo.title.length).toBeLessThanOrEqual(60);
});

test("the default description fits in a search result", () => {
  expect(seo.description.length).toBeLessThanOrEqual(160);
});

test("the default description says what the business does and where", () => {
  expect(seo.description).toMatch(/study abroad/i);
  expect(seo.description).toMatch(/visa/i);
});

test("the keyword list covers what the site is searched for", () => {
  expect(seo.keywords).toContain("study abroad consultant");
  expect(seo.keywords).toContain("foreign education advice");
  expect(seo.keywords).toContain("student visa guidance");
});

test("every office city is named in the search config", () => {
  expect(seo.cities).toEqual(offices.map((office) => office.city));
});
