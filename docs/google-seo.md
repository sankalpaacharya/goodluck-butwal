# Google: search and stats

Three separate things. Do them in order.

**1. Prove you own the site (Search Console).**

1. Open Google Search Console, add your address.
2. Google gives you a verification code.
3. A developer puts it in the `google_site_verification` row in Settings and deploys.
4. Click Verify in Search Console.

**2. Sitemap (automatic).**

The site builds its own sitemap at `/sitemap.xml`. Nothing to upload. In Search Console, submit that address once under Sitemaps. New pages appear in it when you publish them (unpublish one and it drops out).

**3. Visitor stats (optional, Tag Manager).**

1. Create a Google Tag Manager account, copy the ID (looks like `GTM-XXXXXXX`).
2. A developer puts it in the `gtm_id` row in Settings, or you set `NEXT_PUBLIC_GTM_ID` in Vercel.
3. Stats show in Tag Manager / Analytics after a day.

**Google rating on the site:** the stars and review count are typed by hand in the admin under Settings (`google_rating`, `google_review_count`). Copy them off your Google listing when they change. There is no automatic feed.
