import { test, expect } from "vitest";
import { existsSync } from "node:fs";
import { reviews } from "@/features/testimonials/testimonials";

test("every reviewer avatar has a file behind it", () => {
  const missing = reviews.map((r) => r.avatar).filter((path) => !existsSync(`public${path}`));

  expect(missing).toEqual([]);
});
