# Accounts checklist

One row per service. If every row is filled, the site works.

| Service | You need | Where it goes |
|---|---|---|
| Neon (database) | Connection string | `DATABASE_URL` |
| Vercel (hosting) | Account + project | Env vars on the project |
| Cloudinary (images) | Cloud name, API key, API secret | `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| Resend (email) | API key, verified sender address | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` |
| Cloudflare (forms) | Turnstile site key + secret key | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` |
| Google | Search Console ownership | `google_site_verification` row in Settings |
| Google | Tag Manager ID (optional) | `gtm_id` row in Settings, or `NEXT_PUBLIC_GTM_ID` |
| GitHub | Repo access + secrets | See below |
| Domain | DNS records | `domain.md` |

Site addresses (same value twice, your real address live):

- `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` — `http://localhost:3000` on your computer, `https://…` live.

GitHub secrets (repo Settings → Secrets → Actions). Backups and tests stop without these:

| Secret | Value |
|---|---|
| `DATABASE_URL` | Neon **main** branch string (backups read the live data) |
| `TEST_DATABASE_URL` | A Neon branch with content (tests run against it) |
| `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_ACCOUNT_ID` | R2 token (see `backups.md`) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Same cloud name as the site uses |

Three values you make up yourself (random text, keep secret):

- `BETTER_AUTH_SECRET` — run `openssl rand -base64 32`
- `IP_HASH_SALT` — run `openssl rand -base64 32`
- Admin email + password — created in the admin under Users
