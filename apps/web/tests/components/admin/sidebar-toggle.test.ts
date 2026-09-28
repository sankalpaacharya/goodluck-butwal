import { test, expect } from "vitest";
import { readFileSync } from "node:fs";

const sidebar = readFileSync("src/components/layout/admin/sidebar.tsx", "utf8");
const topbar = readFileSync("src/components/layout/admin/topbar.tsx", "utf8");

const trigger = /<SidebarTrigger className="([^"]*)"/.exec(sidebar)?.[1];
const mark = /<img\s+src="\/brand\/mark\.png"\s+alt="Goodluck"\s+className="([^"]*)"/.exec(sidebar)?.[1];

test("there is exactly one trigger in the sidebar", () => {
  expect(sidebar.match(/<SidebarTrigger/g)).toHaveLength(1);
});

test("the trigger is pinned against the inside of the border and does not move", () => {
  expect(trigger, "no trigger in the sidebar").toBeDefined();
  expect(trigger).toContain("absolute");
  expect(trigger).toContain("top-1/2");
  expect(trigger).toContain("right-1");
  expect(trigger).toContain("-translate-y-1/2");
  expect(trigger).not.toMatch(/\binset-0\b/);
  expect(trigger).not.toMatch(/left-/);
});

test("a wrapped rail hides the trigger until the pointer arrives", () => {
  expect(trigger).toContain("group-data-[collapsible=icon]:opacity-0");
  expect(trigger).toContain("group-hover/header:opacity-100");
  expect(trigger).toContain("focus-visible:opacity-100");
});

test("the mark and the trigger share one slot, so the logo gives way on hover", () => {
  expect(mark, "no mark in the sidebar").toBeDefined();
  expect(mark).toContain("absolute");
  expect(mark).toContain("right-1");
  expect(mark).toContain("top-1/2");
  expect(mark).toContain("-translate-y-1/2");
  expect(mark).toContain("size-7");
  expect(mark).toContain("group-hover/header:opacity-0");
});

test("the mark cannot swallow the click meant for the trigger", () => {
  expect(mark).toContain("pointer-events-none");
});

test("an open rail shows the full logo instead of the mark", () => {
  expect(sidebar).toMatch(/<img src="\/brand\/logo\.png" alt="Goodluck"/);
  expect(sidebar).toContain('{wrapped ? (');
});

test("a phone keeps its trigger in the topbar, because the rail is a sheet there", () => {
  expect(sidebar).toContain("{!isMobile && (");
  expect(topbar).toMatch(/<SidebarTrigger className="[^"]*md:hidden/);
});
