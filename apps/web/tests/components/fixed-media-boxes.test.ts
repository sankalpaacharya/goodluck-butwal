import { test, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = "src";

const aspectBoxes: { file: string; line: number; text: string }[] = [];

function walk(dir: string) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full);
      continue;
    }
    if (!name.endsWith(".tsx")) continue;
    readFileSync(full, "utf8")
      .split("\n")
      .forEach((text, i) => {
        if (/class(Name)?="[^"]*\baspect-\[/.test(text)) aspectBoxes.push({ file: full, line: i + 1, text });
      });
  }
}

walk(SRC);

function boxBody(start: { file: string; line: number }) {
  return readFileSync(start.file, "utf8").split("\n").slice(start.line - 1, start.line + 8).join("\n");
}

test("the aspect boxes this file found exist", () => {
  expect(aspectBoxes.length).toBeGreaterThan(5);
});

test("an image inside an aspect box is taken out of the flow", () => {
  const offenders = aspectBoxes
    .filter((box) => {
      const body = boxBody(box);
      if (!/size-full/.test(body)) return false;
      return !/relative/.test(box.text) || !/absolute inset-0/.test(body);
    })
    .map((box) => `${box.file}:${box.line}`);
  expect(offenders).toEqual([]);
});
