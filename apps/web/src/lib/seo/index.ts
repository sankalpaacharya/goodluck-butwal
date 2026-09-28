import type { Metadata } from "next";
import { cache } from "react";
import { allSettings } from "@/db/settings";
import { company, seo } from "@/config/site";

export const TITLE_SUFFIX = ` – ${company.short}`;

export const FALLBACK_IMAGE = "/brand/og.png";

// Google shows about the first 60 characters of a title.
const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 155;

export type SeoDefaults = { title: string; description: string };

export type SeoInput = {
  path: string;
  title?: string | null;
  description?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  keywords?: string[];
  noindex?: boolean;
};

export function absoluteUrl(value: string) {
  if (/^https?:\/\//.test(value)) return value;
  return `${company.url}${value.startsWith("/") ? value : `/${value}`}`;
}

const trimmed = (value: string | null | undefined) => value?.trim() || "";

const cut = (value: string, limit: number) => {
  if (value.length <= limit) return value;
  const cutAt = value.lastIndexOf(" ", limit);
  return `${value.slice(0, cutAt > limit * 0.6 ? cutAt : limit).trim()}`;
};

// The copy behind a description is often rich text, and a tag left in it is shown to the reader.
function toPlainText(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:nbsp|#160|#xA0);/gi, " ")
    .replace(/&(?:amp|#38|#x26);/gi, "&")
    .replace(/&(?:lt|#60|#x3C);/gi, "<")
    .replace(/&(?:gt|#62|#x3E);/gi, ">")
    .replace(/&(?:quot|#34|#x22);/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&(?:apos|rsquo|#8217|#x2019);/gi, "'")
    .replace(/&(?:ldquo|rdquo|#8220|#8221|#x201C|#x201D);/gi, '"')
    .replace(/\s+/g, " ")
    .trim()
    // A tag between a word and its full stop leaves the space behind.
    .replace(/\s+([.,;:!?])/g, "$1");
}

export function buildMetadataFrom(input: SeoInput, defaults: SeoDefaults): Metadata {
  const title = cut(trimmed(input.title) || defaults.title, TITLE_LIMIT);
  const description = cut(toPlainText(trimmed(input.description) || defaults.description), DESCRIPTION_LIMIT);
  const canonical = absoluteUrl(input.path);
  const own = trimmed(input.image);
  const image = own || FALLBACK_IMAGE;
  const imageAlt = trimmed(input.imageAlt) || title;
  const isArticle = input.type === "article" || Boolean(input.publishedTime);
  const keywords = input.keywords?.map(trimmed).filter(Boolean);
  const tags = input.tags?.map(trimmed).filter(Boolean);
  const authors = input.authors?.map(trimmed).filter(Boolean);

  // Next replaces the layout's openGraph object rather than merging into it.
  const openGraph: NonNullable<Metadata["openGraph"]> = {
    type: isArticle ? "article" : "website",
    siteName: company.name,
    locale: seo.locale,
    url: canonical,
    title,
    description,
    images: [own ? { url: absoluteUrl(image), alt: imageAlt } : { url: absoluteUrl(image), width: 1200, height: 630, alt: company.name }],
    ...(isArticle && input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    ...(isArticle && input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
    ...(isArticle && authors?.length ? { authors } : {}),
    ...(isArticle && input.section ? { section: input.section } : {}),
    ...(isArticle && tags?.length ? { tags } : {}),
  };

  return {
    // Otherwise the layout template appends the site name a second time.
    title: title.endsWith(TITLE_SUFFIX) ? { absolute: title } : title,
    description: description || undefined,
    alternates: { canonical },
    ...(keywords?.length ? { keywords } : {}),
    ...(input.noindex ? { robots: { index: false, follow: false } } : {}),
    ...(authors?.length ? { authors: authors.map((name) => ({ name })) } : {}),
    ...(isArticle && input.section ? { category: input.section } : {}),
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)],
    },
  };
}

export const getSeoDefaults = cache(async (): Promise<SeoDefaults> => {
  const byKey = await allSettings();
  return {
    title: String(byKey.get("default_seo_title") ?? "").trim() || seo.title,
    description: String(byKey.get("default_seo_description") ?? "").trim() || seo.description,
  };
});

export async function buildMetadata(input: SeoInput): Promise<Metadata> {
  return buildMetadataFrom(input, await getSeoDefaults());
}
