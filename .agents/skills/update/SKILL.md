---
name: update
description: Applies plain-English change requests to the Goodluck Education website via /update (e.g. /update change the homepage heading to "Study smarter with Goodluck"). Use when the operator asks to change, add, remove, or fix anything on the Goodluck site in everyday language without naming files, components, tables, queries, or APIs. Translates the desired outcome into the smallest safe implementation and confirms before high-risk changes.
---

# Update

You handle change requests to the Goodluck Education website from a non-technical
operator. The operator describes the outcome they want in plain English. You decide
how to implement it.

Example: `/update change the homepage heading to "Study smarter with Goodluck"`.
The operator never needs to say which component, file, table, query, or API to modify.
Finding that is your job.

## When to use this

Use this when the request is about changing the Goodluck site or admin panel and is
written in everyday language: change some wording, swap a photo, add or remove a
section, fix something that looks wrong, change a setting. If the request names exact
files or schema changes, still follow this skill, but you may skip the translation step.

## Workflow

Follow these steps in order.

1. **Understand the outcome.** Restate what the operator wants in one plain sentence.
   If the request is ambiguous (which page, which text, which photo), ask before touching
   anything. Never guess at page copy or business rules. Ask instead.

2. **Inspect before deciding.** Read the relevant code and config first. Load
   [the repo reference](references/goodluck-repo.md) to find where the thing lives and
   which existing pattern covers it. Follow `CLAUDE.md` working rules while you work.

3. **Choose the smallest safe change.** Reuse existing functionality and patterns.
   Prefer reversible changes over destructive ones. Do not add dependencies,
   infrastructure, architecture, tables, APIs, or systems unless genuinely required.
   Never choose a risky implementation when a safer existing mechanism does the job
   (for example, overriding a site-text value instead of restructuring a page, or
   editing a record instead of changing the schema).

4. **Verify.** Run `pnpm typecheck` and `pnpm lint`, run the tests for what you
   changed, and check the result renders or behaves as requested. Say so only if you
   actually ran the check. If a change has nothing meaningful to test (static content,
   config), say so and move on.

5. **Reply in plain English.** Say what changed and what the operator will see, in one
   or two short sentences. No file lists, no schema or API details, no jargon.

## Constraints

- The operator does not know React, Next.js, TypeScript, schemas, APIs, migrations,
  deployment, or project architecture. Do not ask them about any of these.
- Explain technical details only when they affect risk, a limitation, or something the
  operator must decide.
- One logical change at a time. Do not bundle unrelated improvements.
- Never commit secrets, `.env` files, or build output. Never delete production data.

## Risk handling

High-risk changes include: database schema changes, migrations, dropping or renaming
columns, changing relationships, deleting production data, authentication changes,
infrastructure changes, destructive bulk operations, and anything likely to break
existing functionality.

When a request needs one of these:

- Explain in plain English that the change is higher risk and briefly why it can
  affect existing data or functionality.
- Inspect the repo and determine the safest path.
- Ask for confirmation before executing. Do not casually perform it.

## Examples

Operator: `/update change the homepage heading to "Study smarter with Goodluck"`

1. Find the heading's site-text key or component via the repo reference.
2. Make the smallest edit (site-text override or copy change).
3. Typecheck, lint, and confirm the homepage shows the new heading.
4. Reply: `Done, the homepage heading now says "Study smarter with Goodluck".`

Operator: `/update add a phone number field to the enquiry form`

1. This touches validation, the form, the API route, and possibly the database.
   A new stored field means a schema change plus migration, which is high risk.
2. Explain: `That needs a new stored field, which changes the database and affects
   existing enquiries, so I want to be careful. Should I go ahead?`
3. Proceed only after confirmation, then verify and reply in plain English.
