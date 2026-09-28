import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbs, itemList } from "@/lib/seo/schema";
import { InnerHero, SectionHead } from "@/components/shared/inner";
import { SitemapColumns } from "@/features/sitemap/components/sitemap";
import { listSitemapGroups } from "@/features/sitemap/queries";
import { loadText } from "@/features/site-text/queries";
import { Appear } from "@/components/ui/appear";
import { PillButton } from "@/components/ui/button";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/sitemap",
    title: "Sitemap",
    description:
      "Every page on the Goodluck Education & Migration website: study abroad destinations, institutions, courses, services, news and offices.",
    keywords: ["sitemap", "Goodluck website pages", "study abroad sitemap"],
  });
}

export default async function SitemapPage() {
  const [groups, t] = await Promise.all([listSitemapGroups(), loadText()]);
  const total = groups.reduce((sum, group) => sum + group.links.length, 0);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([{ name: "Home", path: "/" }, { name: "Sitemap", path: "/sitemap" }]),
          itemList({
            path: "/sitemap",
            name: "Sitemap",
            items: groups.flatMap((group) => group.links.map((link) => ({ path: link.href, name: link.label }))),
          }),
        ]}
      />
      <InnerHero
        badge={t("sitemap.hero.badge", "Sitemap")}
        badgeTone="chip"
        size="md"
        title={t("sitemap.hero.title", "Every page on this site")}
        lead={t("sitemap.hero.lead", "{count} pages covering study abroad, visas, migration and our offices. Pick where you want to go.").replace("{count}", String(total))}
        clouds={false}
      />

      <section className="flex w-full flex-col items-center pb-[30px] md:pb-20 lg:pb-[100px]">
        <div className="container-x">
          <div className="flex w-full flex-col gap-[30px] md:gap-10 lg:gap-[50px]">
            <SectionHead
              align="left"
              title={t("sitemap.jump.title", "Jump to a section")}
              lead={t("sitemap.jump.lead", "Or scroll down for the full list.")}
            />
            <Appear delay={0.1} className="flex flex-wrap gap-[10px]">
              {groups.map((group) => (
                <a
                  key={group.id}
                  href={`#${group.id}`}
                  className="t-base inline-flex items-center gap-2 scroll-mt-[100px] rounded-full bg-surface px-5 py-[10px] font-medium text-ink transition-colors duration-200 hover:bg-hairline"
                >
                  {group.title}
                  <span className="text-muted">{group.links.length}</span>
                </a>
              ))}
            </Appear>

            <SitemapColumns groups={groups} />

            <Appear className="flex w-full flex-col items-start gap-5 rounded-[10px] bg-surface p-5 md:flex-row md:items-center md:justify-between md:gap-10 md:rounded-[30px] md:p-[30px]">
              <div className="flex flex-col items-start gap-[6px]">
                <h2 className="t-h4">{t("sitemap.help.title", "Cannot find what you were after?")}</h2>
                <p className="t-base text-muted">
                  {t("sitemap.help.lead", "Tell a counsellor what you are looking for and we will point you to the right page.")}
                </p>
              </div>
              <PillButton href="/contact/book-consultation" tone="dark">
                {t("sitemap.help.cta", "Ask a counsellor")}
              </PillButton>
            </Appear>
          </div>
        </div>
      </section>
    </>
  );
}
