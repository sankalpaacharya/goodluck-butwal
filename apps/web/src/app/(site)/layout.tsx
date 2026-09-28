import type { Metadata } from "next";
import "@/styles/globals.css";
import { bricolage, interDisplay } from "@/styles/fonts";
import { company, seo } from "@/config/site";
import { FALLBACK_IMAGE, absoluteUrl, getSeoDefaults } from "@/lib/seo";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { MotionProvider } from "@/components/layout/motion-provider";
import { SlowConnectionProvider } from "@/components/ui/link";
import { OfficeProvider } from "@/features/offices/components/office";
import { Analytics } from "@/components/shared/analytics";
import { MediaOriginHint } from "@/components/shared/media-origin-hint";
import { listOffices } from "@/features/offices/queries";
import { getFooterColumns, getSocialLinks } from "@/features/settings/queries";
import { allSettings } from "@/db/settings";
import { loadText } from "@/features/site-text/queries";

export async function generateMetadata(): Promise<Metadata> {
  const [verification, defaults] = await Promise.all([allSettings(), getSeoDefaults()]);
  const google = String(verification.get("google_site_verification") ?? "").trim();

  return {
    metadataBase: new URL(company.url),
    title: { default: company.name, template: `%s – ${company.short}` },
    description: defaults.description,
    applicationName: company.name,
    authors: [{ name: company.name, url: company.url }],
    creator: company.name,
    publisher: company.name,
    category: "education",
    keywords: seo.keywords,
    icons: { icon: "/brand/icon.png" },
    openGraph: {
      type: "website",
      siteName: company.name,
      locale: seo.locale,
      url: company.url,
      title: defaults.title,
      description: defaults.description,
      images: [{ url: absoluteUrl(FALLBACK_IMAGE), width: 1200, height: 630, alt: company.name }],
    },
    twitter: { card: "summary_large_image", images: [absoluteUrl(FALLBACK_IMAGE)] },
    ...(google ? { verification: { google } } : {}),
  };
}

export const revalidate = 300;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [offices, columns, socials, t] = await Promise.all([
    listOffices(),
    getFooterColumns(),
    getSocialLinks(),
    loadText(),
  ]);

  return (
    <html lang="en" className={`${interDisplay.variable} ${bricolage.variable}`}>
      <body className="overflow-x-clip">
        <MediaOriginHint />
        <MotionProvider>
          <SlowConnectionProvider>
            <OfficeProvider offices={offices}>
              <SmoothScroll />
              <Nav
                text={{
                  bookCta: t("nav.book_cta", "Book a consultation"),
                  menuOpen: t("nav.menu_open", "Open menu"),
                  menuClose: t("nav.menu_close", "Close menu"),
                }}
              />
              <main className="flex flex-col items-start">{children}</main>
              <Footer
                columns={columns}
                socials={socials}
                text={{
                  tagline: t("footer.tagline", "Ready to create your luck?"),
                  officesHeading: t("footer.offices.title", "Offices"),
                  copyright: t("footer.copyright", "© {year} {name}. All rights reserved."),
                }}
              />
            </OfficeProvider>
          </SlowConnectionProvider>
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
