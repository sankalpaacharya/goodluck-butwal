import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { listEventCards } from "@/features/events/queries";
import { InnerHero } from "@/components/shared/inner";
import { EventTabs } from "@/features/events/components/event-tabs";
import { loadText } from "@/features/site-text/queries";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const upcoming = (await listEventCards()).filter((card) => !card.past).length;
  return buildMetadata({
    path: "/events",
    title: "Study abroad events and seminars",
    description: `${upcoming} upcoming study abroad seminars, fairs and information sessions in Melbourne, Butwal and Cebu.`,
    keywords: ["study abroad events", "study abroad seminar", "study in Australia information session"],
  });
}

export default async function EventsPage() {
  const [cards, t] = await Promise.all([listEventCards(), loadText()]);
  const upcoming = cards.filter((card) => !card.past).length;

  return (
    <>
      <InnerHero
        badge={t("events.hero.badge", "Events")}
        badgeTone="chip"
        title={t("events.hero.title", "Seminars, fairs and information sessions")}
        lead={`${upcoming} coming up. Times are shown in the time zone of the office running the event.`}
        clouds={false}
      />
      <section className="flex w-full flex-col items-center pb-[30px] md:pb-20 lg:pb-[100px]">
        <div className="container-x">
          <EventTabs
            events={cards}
            empty={{
              upcoming: t("empty.events.upcoming", "Nothing is coming up just now. Check back soon."),
              past: t("empty.events.past", "No past events yet."),
            }}
          />
        </div>
      </section>
    </>
  );
}
