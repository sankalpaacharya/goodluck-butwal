<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="apps/web/public/brand/logo-white.png" />
    <img src="apps/web/public/brand/logo.png" alt="Goodluck Education and Migration" width="300" />
  </picture>
</p>

<h1 align="center">Goodluck Education & Migration</h1>

<p align="center">
  <strong>Study abroad, simplified.</strong> Choosing a country and a course, applying to
  universities and colleges, preparing visa paperwork, and coaching for the IELTS and PTE
  English tests.
</p>

<p align="center">
  <a href="https://goodluck.services/"><img src="https://img.shields.io/badge/Live-goodluck.services-22c55e" alt="Live site" /></a>
  <a href="https://goodluck-silk.vercel.app/"><img src="https://img.shields.io/badge/Preview-vercel.app-000000?logo=vercel&logoColor=white" alt="Preview site" /></a>
</p>

## About

Goodluck runs three offices, Melbourne (head office), Butwal and Cebu. This repository is its
home on the web: destinations, services, institutions, courses, test preparation batches, news,
events, team and success stories, plus enquiry and consultation booking forms that send each
lead to the right office. Staff manage it all from a built-in admin panel at `/admin`.

![Goodluck homepage](apps/web/public/images/hero/hero_page_1.png)

![Study destinations](apps/web/public/images/hero/hero_page_2.png)

---

## What it does

- **Public site.** Study destinations, services, institutions, courses, IELTS and PTE preparation,
  news, events, team, offices and success stories. The header picks the visitor's office from a
  saved choice or their timezone, and the office drives phone numbers, team and events.
- **Enquiries and consultations.** Forms post to the API, are bot-checked with Turnstile, rate
  limited, and emailed to the right office.
- **Admin panel** at `/admin`. Staff sign in with email and password. Roles scope what each
  person can see and edit: an admin manages users, a member does everything else, and a member
  with an office only sees that office.
- **Media.** Uploads go to Cloudinary. The static images under `public/` are served through the
  same CDN with automatic format and size.

---

## Tech stack

| Layer           |                                                                                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework       | ![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) |
| Language        | ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)                                                        |
| Styling         | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)                                                     |
| Database        | ![Neon](https://img.shields.io/badge/Neon-Postgres-00E599?logo=postgresql&logoColor=white)                                                               |
| ORM             | ![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?logo=drizzle&logoColor=white)                                                                 |
| Auth            | ![Better Auth](https://img.shields.io/badge/Better_Auth-email_%2B_password-000000)                                                                       |
| Media           | ![Cloudinary](https://img.shields.io/badge/Cloudinary-images_%2B_video-3448C5?logo=cloudinary&logoColor=white)                                           |
| Email           | ![Resend](https://img.shields.io/badge/Resend-transactional-000000?logo=resend&logoColor=white)                                                          |
| Bot protection  | ![Cloudflare](https://img.shields.io/badge/Cloudflare-Turnstile-F6821F?logo=cloudflare&logoColor=white)                                                  |
| Backups         | ![Cloudflare R2](https://img.shields.io/badge/Cloudflare-R2-F6821F?logo=cloudflare&logoColor=white) <br />*Not working right now*                         |
| Hosting         | ![Vercel](https://img.shields.io/badge/Vercel-deploy-000000?logo=vercel&logoColor=white)                                                                 |
| Editor          | ![Tiptap](https://img.shields.io/badge/Tiptap-rich_text-000000)                                                                                          |
| Motion          | ![Motion](https://img.shields.io/badge/Motion-animations-FF0080) ![Lenis](https://img.shields.io/badge/Lenis-smooth_scroll-000000)                       |
| Icons           | ![Lucide](https://img.shields.io/badge/Lucide-icons-F56565?logo=lucide&logoColor=white)                                                                  |
| Tests           | ![Vitest](https://img.shields.io/badge/Vitest-tests-6E9F18?logo=vitest&logoColor=white)                                                                  |
| Package manager | ![pnpm](https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white)                                                                           |

---

## Layout

```
apps/web/        the Next.js app: routes, features, components, tests
packages/db/     @goodluck/db: schema, Neon client, migrations
```

`apps/web/src/features/` holds one folder per business area, each with its public queries,
admin queries, server actions and components. `packages/db/src/schema/` is the source of truth
for the database.

---

## Running it locally

Needs Node 22, pnpm 11 and a Neon branch for development.

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local   # then fill it in, DATABASE_URL being your dev branch
pnpm db:migrate:dev                            # apply every migration to that branch
pnpm dev
```

The app talks Neon's HTTP protocol, so there is no local Postgres. Development and production run
the same driver and the same client code against different branches of the same database.

---

## Commands

All of these run from the repository root.

| Command                  | What it does                                                              |
| ------------------------ | ------------------------------------------------------------------------- |
| `pnpm dev`             | Development server                                                        |
| `pnpm build`           | Production build, the same one Vercel runs                                |
| `pnpm typecheck`       | Types only, across both packages                                          |
| `pnpm lint`            | ESLint                                                                    |
| `pnpm test`            | Vitest. Database tests stand aside when`DATABASE_URL` is unset          |
| `pnpm db:migrate:dev`  | Apply every migration to the local database                               |
| `pnpm db:migrate:prod` | Apply pending migrations to production (by hand, with`.env.production`) |
| `pnpm assets:upload`   | Push`public/` images to Cloudinary. `--force` overwrites              |

---

## Deploying

Push to `main`. Vercel builds and releases the app from `apps/web`. Database changes are applied
by hand with `pnpm db:migrate:prod` (migrate before pushing code that needs it). CI runs
typecheck, lint, tests and a build on every pull request against the database named by the
`TEST_DATABASE_URL` secret.

---

## More

- `docs/`: setup and running notes for whoever owns the site (database, email, media,
  Google, admin use, recovery)
- `.agents/skills/update/SKILL.md`: the skill for agents working on this site. Say
  "/update" followed by the change in plain English.

---

## Credits

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/prawesh-12">
        <img src="https://avatars.githubusercontent.com/u/149902666?v=4&s=80" width="80" alt="prawesh-12" /><br />
        <b>prawesh-12</b>
      </a><br />
      <sub>Designed and developed</sub>
    </td>
    <td align="center">
      <a href="https://github.com/sankalpaacharya">
        <img src="https://avatars.githubusercontent.com/u/183142804?v=4&s=80" width="80" alt="sankalpaacharya" /><br />
        <b>sankalpaacharya</b>
      </a><br />
      <sub>Reviewed</sub>
    </td>
  </tr>
</table>
