import { test, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { socialPlatforms } from "@/config/site";

vi.mock("next/navigation", () => ({ useRouter: () => ({ prefetch: () => {} }) }));

const { SocialLinks } = await import("@/components/ui/bits");

const PROFILES = {
  facebook: "https://www.facebook.com/rita.shrestha",
  instagram: "https://www.instagram.com/ritashrestha",
  tiktok: "https://www.tiktok.com/@ritashrestha",
  linkedin: "https://www.linkedin.com/in/rita-shrestha",
} as Record<string, string>;

const only = (set: string[]) => socialPlatforms.filter((p) => set.includes(p.key));

function hrefs(markedUp: string) {
  return [...markedUp.matchAll(/aria-label="([^"]*)"/g)].map((m) => m[1]);
}

test("the four platforms are offered, in a fixed order", () => {
  expect(socialPlatforms.map((p) => p.key)).toEqual(["facebook", "instagram", "tiktok", "linkedin"]);
});

test("every platform has its own label and icon", () => {
  for (const platform of socialPlatforms) {
    expect(platform.label).toBeTruthy();
    expect(platform.icon).toMatch(/^\/images\/social\//);
  }
});

test("a member with nothing set shows no icons at all", () => {
  const socials = only([]).map((p) => ({ label: p.label, icon: p.icon, href: PROFILES[p.key] ?? "" })).filter((l) => l.href);
  expect(socials).toEqual([]);
});

test("only the platforms that were filled in come through", () => {
  const socials = only(["instagram", "linkedin"]).map((p) => ({ label: p.label, icon: p.icon, href: PROFILES[p.key] }));
  expect(hrefs(renderToStaticMarkup(<SocialLinks links={socials} />))).toEqual(["Instagram", "LinkedIn"]);
});

test("a filled in platform points at the address the admin typed", () => {
  const socials = only(["facebook"]).map((p) => ({ label: p.label, icon: p.icon, href: PROFILES[p.key] }));
  const markup = renderToStaticMarkup(<SocialLinks links={socials} />);
  expect(markup).toContain(PROFILES.facebook);
});

test("all four show when all four are set", () => {
  const socials = socialPlatforms.map((p) => ({ label: p.label, icon: p.icon, href: PROFILES[p.key] }));
  expect(hrefs(renderToStaticMarkup(<SocialLinks links={socials} />))).toEqual(["Facebook", "Instagram", "TikTok", "LinkedIn"]);
});
