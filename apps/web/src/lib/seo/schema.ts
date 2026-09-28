import { absoluteUrl } from "@/lib/seo";
import { company, seo } from "@/config/site";

export type Schema = Record<string, unknown>;

// A raw "<" would close the script tag the JSON is printed inside.
export function toJsonLd(data: Schema | Schema[]) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

const ORGANIZATION_ID = `${company.url}/#organization`;
const WEBSITE_ID = `${company.url}/#website`;

const asList = (value: string[] | undefined) => (value ?? []).map((item) => item.trim()).filter(Boolean);

const ALIASES = [company.name, "Goodluck", "Goodluck Education", "Goodluck Education and Migration", "Goodluck Consultancy"];

export type OrganizationInput = {
  socials?: string[];
  services?: { name: string; slug: string; description?: string }[];
};

export function organization(input: OrganizationInput = {}): Schema {
  const socials = asList(input.socials);
  const services = input.services ?? [];

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": ORGANIZATION_ID,
    name: company.name,
    alternateName: ALIASES,
    url: company.url,
    logo: absoluteUrl("/brand/logo.png"),
    image: absoluteUrl("/brand/logo.png"),
    email: company.email,
    description: company.tagline,
    slogan: company.tagline,
    foundingDate: String(company.founded),
    knowsAbout: seo.keywords,
    areaServed: [
      ...seo.countries.map((name) => ({ "@type": "Country", name })),
      ...seo.cities.map((name) => ({ "@type": "City", name })),
    ],
    availableLanguage: ["en", "ne", "fil"],
    ...(socials.length ? { sameAs: socials } : {}),
    ...(services.length
      ? {
          makesOffer: services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.name,
              ...(service.description ? { description: service.description } : {}),
              url: absoluteUrl(`/services/${service.slug}`),
              serviceType: service.name,
              provider: { "@id": ORGANIZATION_ID },
              areaServed: seo.countries.map((name) => ({ "@type": "Country", name })),
            },
          })),
        }
      : {}),
  };
}

export function webSite(): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: company.name,
    alternateName: company.short,
    url: company.url,
    inLanguage: "en",
    publisher: { "@id": ORGANIZATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${company.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export type OpeningHoursInput = { day: number; open: string; close: string; closed: boolean }[];

function openingHoursSpecification(hours: OpeningHoursInput) {
  return hours
    .filter((entry) => !entry.closed && entry.open && entry.close)
    .map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${WEEKDAYS[entry.day]}`,
      opens: entry.open,
      closes: entry.close,
    }));
}

export type OfficeSchemaInput = {
  name: string;
  slug?: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email?: string;
  hours?: string;
  structuredHours?: OpeningHoursInput;
};

export function localBusiness(office: OfficeSchemaInput): Schema {
  const url = office.slug ? absoluteUrl(`/offices/${office.slug}`) : absoluteUrl("/contact");
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}#localbusiness`,
    name: `${company.name} ${office.name}`,
    url,
    parentOrganization: { "@id": ORGANIZATION_ID },
    logo: absoluteUrl("/brand/logo.png"),
    address: {
      "@type": "PostalAddress",
      streetAddress: office.address,
      addressLocality: office.city,
      addressCountry: office.country,
    },
    ...(office.phone ? { telephone: office.phone } : {}),
    ...(office.email ? { email: office.email } : {}),
    ...(office.hours ? { openingHours: office.hours } : {}),
    ...(office.structuredHours?.length ? { openingHoursSpecification: openingHoursSpecification(office.structuredHours) } : {}),
    areaServed: seo.countries.map((name) => ({ "@type": "Country", name })),
  };
}

export type ArticleSchemaInput = {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  updatedAt?: string;
  author?: string;
  category?: string;
  tags?: string[];
};

export function article(post: ArticleSchemaInput): Schema {
  const url = absoluteUrl(`/news/${post.slug}`);
  const tags = asList(post.tags);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${url}#webpage` },
    url,
    headline: post.title.slice(0, 110),
    ...(post.excerpt ? { description: post.excerpt } : {}),
    ...(post.image ? { image: [absoluteUrl(post.image)] } : {}),
    ...(post.date ? { datePublished: post.date } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    ...(post.author
      ? { author: { "@type": "Person", name: post.author, worksFor: { "@id": ORGANIZATION_ID } } }
      : { author: { "@id": ORGANIZATION_ID } }),
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: company.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/brand/logo.png") },
    },
    ...(post.category ? { articleSection: post.category } : {}),
    ...(tags.length ? { keywords: [post.category ?? "", ...tags].filter(Boolean).join(", ") } : {}),
    inLanguage: "en",
    isAccessibleForFree: true,
  };
}

export function blog(input: { name: string; description: string; path: string; posts: ArticleSchemaInput[] }): Schema {
  const url = absoluteUrl(input.path);
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    name: input.name,
    description: input.description,
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORGANIZATION_ID },
    blogPost: input.posts.map((post) => ({ "@id": `${absoluteUrl(`/news/${post.slug}`)}#article` })),
  };
}

export function person(input: {
  name: string;
  slug: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  profiles?: string[];
}): Schema {
  const url = absoluteUrl(`/team/${input.slug}`);
  const profiles = asList(input.profiles);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#person`,
    name: input.name,
    url,
    ...(input.jobTitle ? { jobTitle: input.jobTitle } : {}),
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: input.image } : {}),
    ...(profiles.length ? { sameAs: profiles } : {}),
    worksFor: { "@id": ORGANIZATION_ID },
    worksAt: { "@id": ORGANIZATION_ID },
  };
}

export type EventSchemaInput = {
  slug: string;
  title: string;
  summary: string;
  image: string;
  startsAt: Date;
  endsAt: Date | null;
  isOnline: boolean;
  onlineUrl: string | null;
  venueName: string | null;
  venueAddress: string | null;
  officeName: string;
};

export function event(input: EventSchemaInput): Schema {
  const url = absoluteUrl(`/events/${input.slug}`);
  const location = input.isOnline
    ? { "@type": "VirtualLocation", url: input.onlineUrl ?? url }
    : {
        "@type": "Place",
        name: input.venueName ?? input.officeName,
        ...(input.venueAddress ? { address: input.venueAddress } : {}),
      };

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${url}#event`,
    url,
    name: input.title,
    description: input.summary,
    ...(input.image ? { image: absoluteUrl(input.image) } : {}),
    startDate: input.startsAt.toISOString(),
    ...(input.endsAt ? { endDate: input.endsAt.toISOString() } : {}),
    eventAttendanceMode: input.isOnline
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    isAccessibleForFree: true,
    location,
    organizer: { "@id": ORGANIZATION_ID },
  };
}

export type CourseSchemaInput = {
  path: string;
  name: string;
  description: string;
  provider: string;
};

export function course(input: CourseSchemaInput): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    url: absoluteUrl(input.path),
    inLanguage: "en",
    provider: { "@type": "Organization", name: input.provider },
  };
}

export function itemList(input: { path: string; name: string; items: { path: string; name: string }[] }): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${absoluteUrl(input.path)}#itemlist`,
    name: input.name,
    numberOfItems: input.items.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: input.items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function faqPage(items: { q: string; a: string }[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${absoluteUrl("/faq")}#faq`,
    url: absoluteUrl("/faq"),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function breadcrumbs(trail: { name: string; path: string }[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: absoluteUrl(step.path),
    })),
  };
}
