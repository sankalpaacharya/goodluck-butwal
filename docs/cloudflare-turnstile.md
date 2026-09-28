# Forms check (Cloudflare Turnstile)

Every form has an "I am human" check. Without it, forms show an error and nothing is saved.

Setup:

1. Log in to Cloudflare, open Turnstile, Add widget.
2. Name it after the site. Mode: Managed.
3. Add your site address to the allowed domains (plus `localhost` for testing on your computer).
4. Copy the two keys:
   - Site key → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - Secret key → `TURNSTILE_SECRET_KEY`
5. Save and redeploy (live) or restart `pnpm dev` (local).

For local testing only, you can use Cloudflare's test keys: site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`. They always pass. Never use them live.

If forms stop working live: the domain list in the widget is the first thing to check.
