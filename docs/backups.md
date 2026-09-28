# Backups (R2 + GitHub)

Backups run themselves, but only after a one-time setup. Do the setup once, then ignore it.

**Setup (once):**

1. In Cloudflare, create an R2 bucket named `gem-backups`.
2. In R2, create an API token with read/write on that bucket. Save the access key, secret key, and your account ID.
3. In GitHub, open the repo Settings → Secrets → Actions. Add:
   - `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` (from step 2)
   - `CLOUDFLARE_ACCOUNT_ID` (from step 2)
   - `DATABASE_URL` (Neon **main** branch string)
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `TEST_DATABASE_URL` (a Neon branch with content, used by tests)
4. In GitHub, open Actions → Backup → Run workflow once, to prove it works.

**What runs on its own:**

- Daily: database dump to `db/{year}/{month}/`. Kept 30 days.
- Sundays: copy of every uploaded image to `media/`. Kept forever.
- Mondays: freshness check. If a backup is missing, it opens a GitHub issue labeled `backup-failure`.

If a `backup-failure` issue appears, that is the one alert you must not ignore. Fix the secret or the bucket it names, then re-run the workflow by hand.
