import { test, expect } from "vitest";
import robots from "@/app/robots";

const rule = () => {
  const rules = robots().rules;
  return Array.isArray(rules) ? rules[0] : rules;
};

test("crawlers are let into the public site", () => {
  expect(rule().allow).toBe("/");
});

test("the admin, the previews and the search results stay out of the index", () => {
  expect(rule().disallow).toEqual(["/admin", "/api", "/preview", "/search"]);
});

test("crawlers are pointed at the sitemap", () => {
  expect(robots().sitemap).toBe("https://goodluck.services/sitemap.xml");
});
