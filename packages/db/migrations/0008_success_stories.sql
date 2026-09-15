CREATE TABLE "success_stories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text,
	"updated_by" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"title" text NOT NULL,
	"image_id" uuid,
	"is_featured" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "success_stories" ADD CONSTRAINT "success_stories_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "success_stories" ADD CONSTRAINT "success_stories_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "success_stories" ADD CONSTRAINT "success_stories_image_id_media_assets_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "success_stories_status_featured_idx" ON "success_stories" USING btree ("status","is_featured","published_at");--> statement-breakpoint
INSERT INTO "success_stories" ("title", "image_id", "status", "published_at")
SELECT seed.title, m.id, 'published', now() - (seed.position * interval '1 minute')
FROM (VALUES
	(1, '/images/success-stories/story-01.webp', 'Congratulations Swornim Maharjan, student dependent visa granted'),
	(2, '/images/success-stories/story-02.webp', 'Congratulations Angelo John Villas, tourist to student visa grant'),
	(3, '/images/success-stories/story-03.webp', 'Congratulations Bianda Cathleen Marco and Edmund Caeandang, tourist to student visa grant, dependent case'),
	(4, '/images/success-stories/story-04.webp', 'Congratulations Robin Sunwar, 485 extension granted'),
	(5, '/images/success-stories/story-05.webp', 'Congratulations Shila and Bipin, dependent visa granted within 10 days'),
	(6, '/images/success-stories/story-06.webp', 'Client review: Ajoy Mahorjan'),
	(7, '/images/success-stories/story-07.webp', 'Success story: Anil Maharjan, former Nepalese national player'),
	(8, '/images/success-stories/story-08.webp', 'Success story: Asween Bhattarai, temporary activity visa approved and student visa secured'),
	(9, '/images/success-stories/story-09.webp', 'Success story: Chandan Kumar Das, subclass 408 to student visa subclass 500'),
	(10, '/images/success-stories/story-10.webp', 'Success story: Nirajan Maharjan, former Nepalese national soccer player'),
	(11, '/images/success-stories/story-11.webp', 'Success story: Rumesh Bartaula, student visa granted')
) AS seed(position, path, title)
JOIN "media_assets" m ON m.static_path = seed.path;
