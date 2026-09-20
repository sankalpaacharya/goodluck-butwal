import { expect, test } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import * as icons from "@/components/ui/icons";

const all = Object.entries(icons);

// The source files carry a width and a height and no viewBox. Inline, that means a CSS height
// crops the icon instead of scaling it, which is invisible until a class changes the size.
test("every icon scales with its box", () => {
  for (const [name, Icon] of all) {
    const html = renderToStaticMarkup(<Icon className="h-2 w-3" />);
    expect(html, name).toMatch(/viewBox="0 0 \d+ \d+"/);
    expect(html, name).toContain('class="h-2 w-3"');
  }
});

test("an icon keeps its own colours, so a dark tile can invert it", () => {
  expect(renderToStaticMarkup(<icons.Arrow />)).toContain('fill="#1D1D1D"');
  expect(renderToStaticMarkup(<icons.Stars5 />)).toContain('fill="#FB0"');
});

test("a decorative icon is hidden from a screen reader unless it is given a label", () => {
  expect(renderToStaticMarkup(<icons.Arrow />)).toContain('aria-hidden="true"');
  const labelled = renderToStaticMarkup(<icons.Stars5 role="img" aria-label="Five stars" />);
  expect(labelled).toContain('aria-label="Five stars"');
  expect(labelled).not.toContain("aria-hidden");
});
