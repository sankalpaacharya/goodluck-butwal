import { test, expect } from "vitest";
import { readFileSync } from "node:fs";

// The sidebar logo block and the topbar meet at the top left corner. They were sized by their
// own padding and landed three pixels apart, so the separator under the logo and the topbar
// border drew two offset lines. Both are now a fixed height and have to stay the same one, and
// the height has to sit on the element that carries the border, or the border adds a pixel.
test("the sidebar logo block and the topbar are the same height", () => {
  const sidebar = readFileSync("src/components/layout/admin/sidebar.tsx", "utf8");
  const topbar = readFileSync("src/components/layout/admin/topbar.tsx", "utf8");

  const logoBlock = /<SidebarHeader className="([^"]*)"/.exec(sidebar)?.[1];
  const topbarHeader = /<header className="([^"]*)"/.exec(topbar)?.[1];

  expect(logoBlock, "no sidebar header").toBeDefined();
  expect(topbarHeader, "no topbar header").toBeDefined();

  expect(logoBlock).toContain("h-16");
  expect(logoBlock).toContain("border-b");
  expect(topbarHeader).toContain("h-16");
  expect(topbarHeader).toContain("border-b");
});
