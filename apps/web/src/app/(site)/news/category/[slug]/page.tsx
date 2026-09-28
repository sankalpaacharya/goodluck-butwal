import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { breadcrumbs, itemList } from "@/lib/seo/schema";
import { notFound } from "next/navigation";
import { listArticlesByCategory, listCategories } from "@/features/posts/queries";
import { InnerHero } from "@/components/shared/inner";
import { NewsList } from "@/features/posts/components/news-list";
import { loadText } from "@/features/site-text/queries";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = async () =>
  (await listCategories()).map((category) => ({ slug: category.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [category, articles] = await Promise.all([listCategories(), listArticlesByCategory(slug)]);
  const found = category.find((c) => c.slug === slug);
  return found
    ? buildMetadata({
        path: `/news/category/${slug}`,
        title: `${found.name} articles`,
        description: `${articles.length} ${found.name.toLowerCase()} articles on study abroad, visas and migration from the Goodluck team.`,
      })
    : buildMetadata({ path: "/news", title: "News", noindex: true });
}

export default async function CategoryPage({ params }: Props) {
  const t = await loadText();
  const { slug } = await params;
  const [category, articles] = await Promise.all([
    listCategories().then((all) => all.find((c) => c.slug === slug)),
    listArticlesByCategory(slug),
  ]);
  if (!category) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbs([{ name: "Home", path: "/" }, { name: "News", path: "/news" }, { name: category.name, path: `/news/category/${category.slug}` }]),
          itemList({
            path: `/news/category/${category.slug}`,
            name: category.name,
            items: articles.map((a) => ({ path: `/news/${a.slug}`, name: a.title })),
          }),
        ]}
      />
      <InnerHero badge={t("news.hero.badge", "News and updates")} badgeTone="chip" title={category.name} lead={`${articles.length} ${articles.length === 1 ? "article" : "articles"} in this category.`} clouds={false} />
      <section className="flex w-full flex-col items-center pb-[30px] md:pb-20 lg:pb-[100px]">
        <div className="container-x">
          <NewsList articles={articles} />
        </div>
      </section>
    </>
  );
}
