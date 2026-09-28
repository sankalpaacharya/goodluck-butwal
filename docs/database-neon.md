# Database (Neon)

Neon holds all the site content. There is no database on your computer. Your computer talks to Neon over the internet.

Two copies:

- **main branch** = the live site. Never point your computer at it.
- **a dev branch** = your playground. Make one in the Neon dashboard with "Branch from main".

Setup:

1. Create a Neon account and project (region closest to your visitors).
2. Make a dev branch from main.
3. Copy the dev branch connection string into `apps/web/.env.local` as `DATABASE_URL`.
4. Run `pnpm db:migrate:dev` once.

Day to day you do nothing. When the code changes the database shape, a developer runs `pnpm db:migrate:prod` once (see `setup-production.md`).

Safety rules:

- Never edit the live database by hand. Change content in the admin instead.
- Never paste a connection string into chat, email, or code.
- If the live data breaks, do not fix it in place. Restore into a new branch first (see `when-something-breaks.md`).
