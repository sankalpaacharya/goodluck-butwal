CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" text,
	"updated_by" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"name" text NOT NULL,
	"avatar_id" uuid,
	"reviewed_on" date NOT NULL,
	"quote" text NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_avatar_id_media_assets_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media_assets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reviews_status_featured_idx" ON "reviews" USING btree ("status","is_featured","reviewed_on");--> statement-breakpoint
INSERT INTO "reviews" ("name", "avatar_id", "reviewed_on", "quote", "status", "published_at")
SELECT seed.name, m.id, seed.reviewed_on::date, seed.quote, 'published', now()
FROM (VALUES
	('Boby Gurung', '/images/reviewers/boby-gurung.webp', '2024-11-01', 'The services provided were clear, helpful, and made the process seamless. I appreciate your professionalism and effort in assisting students.'),
	('Aasha Khasu', '/images/reviewers/aasha-khasu.webp', '2024-08-01', 'Goodluck Education & Migration is highly recommended for expert guidance and support in achieving education and career goals, with their dedicated staff making the process easy and comfortable.'),
	('Kimnova Setiabudhi', '/images/reviewers/kimnova-setiabudhi.webp', '2024-08-01', 'I''m genuinely happy with their service. I went here after a friend recommended me, and the consultation was incredibly helpful. I got to know all the options in details. They''re knowledgeable and super friendly, so I highly recommend them!!'),
	('Reshma Shrestha', '/images/reviewers/reshma-shrestha.webp', '2024-08-01', 'The service was exceptional in guiding me through the process of obtaining my TR(485) visa. Their expertise and support made the entire journey smooth and stress-free. I highly recommend their services to anyone in need of visa assistance.'),
	('Mark Neil Sto Tomas', '/images/reviewers/mark-neil-sto-tomas.webp', '2024-08-01', 'It was an easy and smooth transaction with Goodluck Education & Migration. Very accommodating. Super satisfied with how Olivia handled and processed my concern. Thank you'),
	('Manish Dahal', '/images/reviewers/manish-dahal.webp', '2024-08-01', 'They guided me through every step of my visa process with great expertise and patience. Their team is friendly, professional, and always ready to help. Thanks to them, I got my visa without any stress.')
) AS seed(name, path, reviewed_on, quote)
JOIN "media_assets" m ON m.static_path = seed.path;
