ALTER TABLE "offices" ADD COLUMN "social_links" jsonb;--> statement-breakpoint
UPDATE "offices" SET "social_links" = '[
	{"label": "Facebook", "href": "#", "icon": "/images/social/facebook.webp"},
	{"label": "Instagram", "href": "#", "icon": "/images/social/instagram.webp"},
	{"label": "TikTok", "href": "#", "icon": "/images/social/tiktok.webp"}
]'::jsonb;--> statement-breakpoint
UPDATE "settings" SET "value" = '[
	{"label": "Facebook", "href": "#", "icon": "/images/social/facebook.webp"},
	{"label": "Instagram", "href": "#", "icon": "/images/social/instagram.webp"},
	{"label": "TikTok", "href": "#", "icon": "/images/social/tiktok.webp"}
]'::jsonb, "updated_at" = now() WHERE "key" = 'social_links';
