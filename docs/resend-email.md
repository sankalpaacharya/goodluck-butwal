# Email (Resend)

The site emails each office when a form comes in, and emails password resets. If email breaks, forms still save. The visitor never sees an error.

Setup:

1. Create a Resend account, verify your domain (add the DNS records Resend shows you, in your domain's DNS page).
2. Create an API key → `RESEND_API_KEY`.
3. Pick the sender, e.g. `noreply@goodluck.edu.au`. It must be on the verified domain → `RESEND_FROM_EMAIL`.
4. Save and redeploy (live) or restart `pnpm dev` (local).

Limits on the free plan: 3,000 emails a month, 100 a day. Past that, sends fail quietly and are logged.

If office mail stops arriving: check the domain is still verified in Resend, and check spam.
