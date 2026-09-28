import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { blog } from "@/lib/seo/schema";
import { listArticles } from "@/features/posts/queries";
import { InnerHero } from "@/components/shared/inner";
import { NewsList } from "@/features/posts/components/news-list";
import { loadText } from "@/features/site-text/queries";

const TITLE = "Study abroad and visa news";
const DESCRIPTION =
  "Study abroad advice, student visa updates, scholarship news and migration guidance from the Goodluck team in Melbourne, Butwal and Cebu.";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ path: "/news", title: TITLE, description: DESCRIPTION });
}

export default async function NewsPage() {
  const t = await loadText();
  const articles = await listArticles();

  return (
    <>
      <JsonLd data={blog({ name: TITLE, description: DESCRIPTION, path: "/news", posts: articles })} />
      <InnerHero badge={t("news.hero.badge", "News and updates")} badgeTone="chip" title={t("news.hero.title", "Study abroad insights and visa tips")} lead={DESCRIPTION} clouds={false} />
      <section className="flex w-full flex-col items-center pb-[30px] md:pb-20 lg:pb-[100px]">
        <div className="container-x">
          <NewsList articles={articles} />
        </div>
      </section>
    </>
  );
}
