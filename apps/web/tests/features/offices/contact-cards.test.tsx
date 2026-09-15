import { expect, test } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { OfficeContactCards } from "@/features/offices/components/contact-cards";
import type { PublicOffice } from "@/features/offices/queries";

const office = (id: PublicOffice["id"], city: string, country: string): PublicOffice => ({
  id,
  label: `${country} Office`,
  city,
  country,
  address: `1 ${city} Street`,
  phone: "000",
  tel: "tel:000",
  timezone: "Australia/Melbourne",
  flag: `/images/flags/${country.toLowerCase()}.svg`,
});

const offices = [office("au", "Melbourne", "Australia"), office("np", "Butwal", "Nepal"), office("ph", "Cebu", "Philippines")];
const html = renderToStaticMarkup(<OfficeContactCards offices={offices} whatsappLabel="Chat on WhatsApp" />);
const cities = [...html.matchAll(/>([A-Z][a-z]+), (?:Australia|Nepal|Philippines)</g)].map((m) => m[1]);

// The block is the whole contact list, so it is the same for a visitor in Butwal as in Melbourne.
test("the offices keep the order they were given, whoever is looking", () => {
  expect(cities).toEqual(["Melbourne", "Butwal", "Cebu"]);
});

test("the first card is the dark one", () => {
  expect(html.indexOf("bg-ink")).toBeLessThan(html.indexOf("Melbourne"));
  expect(html.match(/bg-ink/g)).toHaveLength(1);
});
