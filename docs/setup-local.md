# Run the site on your computer

You need: Node 22 and pnpm 11. Check with `node -v` and `pnpm -v`.

1. Install packages (once):
   ```bash
   pnpm install
   ```
2. Copy the settings file and fill it in:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```
   Every blank needs a value. See `accounts-checklist.md` for where each one comes from. `DATABASE_URL` must be a Neon **dev branch**, not the live one (see `database-neon.md`).
3. Set up the dev database (once):
   ```bash
   pnpm db:migrate:dev
   ```
4. Start the site:
   ```bash
   pnpm dev
   ```
   Open http://localhost:3000. Admin is at http://localhost:3000/admin/login.

Useful commands (all from the top folder):

- `pnpm test` — run the checks
- `pnpm typecheck` — check for code errors
- `pnpm build` — same build the live site uses

Never commit `.env.local`. It is already ignored.
