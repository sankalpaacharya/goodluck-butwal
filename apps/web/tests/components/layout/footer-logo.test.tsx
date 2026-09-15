import { expect, test, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("next/navigation", () => ({ usePathname: () => "/", useRouter: () => ({ prefetch: () => {} }) }));
vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children?: React.ReactNode }) => <a href={href}>{children}</a>,
}));

const { Footer } = await import("@/components/layout/footer");

const html = renderToStaticMarkup(
  <Footer
    columns={[{ title: "Support", links: [{ label: "FAQ", href: "/faq" }] }]}
    socials={[]}
    text={{ tagline: "Ready to create your luck?", officesHeading: "Offices", copyright: "{year} {name}" }}
  />,
);

const wordmark = html.match(/<img[^>]*brand\/logo[^>]*>/g)?.at(-1) ?? "";

// With no size to reserve, the wordmark was 0px tall, which put it past the end of the page,
// which meant the lazy loader never saw it and it never loaded. It has to carry its own size.
test("the big footer wordmark declares its intrinsic size", () => {
  expect(wordmark).toContain('width="1959"');
  expect(wordmark).toContain('height="539"');
});

test("it is the white treatment the footer was designed around", () => {
  expect(wordmark).toContain("brightness-0");
  expect(wordmark).toContain("invert");
});
