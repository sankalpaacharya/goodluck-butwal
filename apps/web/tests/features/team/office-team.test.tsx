import { expect, test, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { PublicMember } from "@/features/team/queries";

vi.mock("next/navigation", () => ({ useRouter: () => ({ prefetch: () => {} }) }));

const { AboutTeam, OfficeTeam } = await import("@/features/team/components/office-team");

// Nothing sets a cookie or a timezone here, so the visitor is the Australian default.
const member = (name: string, office: PublicMember["office"]): PublicMember => ({
  slug: name.toLowerCase(),
  name,
  role: "Marketing Officer",
  office,
  photo: "/images/team/photo.webp",
});

const team = [
  member("Ari", "au"),
  member("Bibas", "np"),
  member("Gerwin", "ph"),
  member("Jeremy", "au"),
  member("Santosh", null),
];

const names = (html: string) => [...html.matchAll(/aria-label="([^"]*)"/g)].map((m) => m[1]);

test("a visitor sees the team of the office their timezone puts them in", () => {
  expect(names(renderToStaticMarkup(<OfficeTeam team={team} />))).toEqual(["Ari", "Jeremy"]);
});

test("an office with nobody published shows the whole team instead of an empty block", () => {
  const abroad = [member("Bibas", "np"), member("Gerwin", "ph")];
  expect(names(renderToStaticMarkup(<OfficeTeam team={abroad} />))).toEqual(["Bibas", "Gerwin"]);
});

test("the about page shows five of them at most", () => {
  const eight = Array.from({ length: 8 }, (_, i) => member(`Member ${i}`, "au"));
  expect(names(renderToStaticMarkup(<AboutTeam team={eight} />))).toHaveLength(5);
});

test("the about page follows the same office rule", () => {
  expect(names(renderToStaticMarkup(<AboutTeam team={team} />))).toEqual(["Ari", "Jeremy"]);
});
