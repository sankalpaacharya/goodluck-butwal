# Put the site live (Vercel)

1. In Vercel, import the GitHub repo. Root folder is `apps/web`.
2. Add every variable from `apps/web/.env.example` to the Vercel project settings, under Environment Variables. Use **live** values here:
   - `DATABASE_URL` = Neon main branch string
   - `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` = your real address, e.g. `https://www.goodluck.edu.au`
   - the rest = the same keys you use locally
3. Push to the `main` branch. Vercel builds and publishes by itself.
4. Update the live database by hand (this part is NOT automatic):
   ```bash
   # put the LIVE database string in apps/web/.env.production as DATABASE_URL, then:
   pnpm db:migrate:prod
   ```
   If the code needs a database change first, run step 4 before pushing the code.

To go back to the last good version: Vercel dashboard, Deployments, find the last working one, Promote.
