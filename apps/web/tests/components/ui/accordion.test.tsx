import { expect, test } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Accordion } from "@/components/shared/faqs";

const items = [
  { q: "What types of university programmes do we assist with?", a: "Undergraduate and postgraduate." },
  { q: "Are there scholarships available?", a: "Some, and they depend on the university." },
];

const html = () => renderToStaticMarkup(<Accordion items={items} />);

test("every panel starts closed", () => {
  expect(html()).not.toContain('aria-expanded="true"');
  expect(html().match(/aria-expanded="false"/g)).toHaveLength(2);
});

// The answers have to be in the markup from the start, closed to a height of zero: that is what
// the list measures to know how much room to keep, and it is what a crawler reads.
test("a closed answer is rendered, at no height", () => {
  expect(html()).toContain("Undergraduate and postgraduate.");
  expect(html().match(/style="height:0px;opacity:0"/g)).toHaveLength(2);
});

test("the list carries the spacer that holds the room open", () => {
  expect(html()).toContain('<div aria-hidden="true" style="height:0px"');
});
