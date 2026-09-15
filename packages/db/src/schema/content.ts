import { boolean, index, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { base, mediaAssets, publishing, users } from "./core";
import { contentStatus } from "./enums";

export const pages = pgTable("pages", {
  ...base,
  ...publishing,
  slug: text("slug").notNull().unique(),
  parent: varchar("parent", { length: 20 }).notNull().default("about"),
  title: text("title").notNull(),
  intro: text("intro"),
  bodyHtml: text("body_html"),
  blocks: jsonb("blocks"),
  showInNav: boolean("show_in_nav").notNull().default(false),
});

// Developers add keys, the admin only ever edits values.
export const uiStrings = pgTable(
  "ui_strings",
  {
    key: varchar("key", { length: 80 }).primaryKey(),
    value: text("value").notNull(),
    group: text("group").notNull(),
    label: text("label"),
    help: text("help"),
    updatedBy: text("updated_by").references(() => users.id),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("ui_strings_group_idx").on(t.group)],
);

// The graphic carries its own words, so the title is both the admin label and the alt text.
// Featured stories lead, then the most recently published.
export const successStories = pgTable(
  "success_stories",
  {
    ...base,
    status: contentStatus("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    title: text("title").notNull(),
    imageId: uuid("image_id").references(() => mediaAssets.id),
    isFeatured: boolean("is_featured").notNull().default(false),
  },
  (t) => [index("success_stories_status_featured_idx").on(t.status, t.isFeatured, t.publishedAt)],
);
