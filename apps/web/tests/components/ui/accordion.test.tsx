import { expect, test } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Accordion } from "@/components/shared/faqs";

const items = [
  { q: "What types of university programmes do we assist with?", a: "Undergraduate and postgraduate." },
  { q: "Are there scholarships available?", a: "Some, and they depend on the university." },
];

test("every panel starts closed", () => {
  const html = renderToStaticMarkup(<Accordion items={items} />);
  expect(html).not.toContain('aria-expanded="true"');
  expect(html.match(/aria-expanded="false"/g)).toHaveLength(2);
});

test("a closed panel does not render its answer, so nothing below it moves", () => {
  const html = renderToStaticMarkup(<Accordion items={items} />);
  expect(html).toContain("Are there scholarships available?");
  expect(html).not.toContain("Undergraduate and postgraduate.");
});
