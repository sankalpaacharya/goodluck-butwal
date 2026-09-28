# Domain (your web address)

1. In Vercel, open the project → Settings → Domains → Add your address (both `goodluck.edu.au` and `www.goodluck.edu.au`).
2. Vercel shows you DNS records. Add them where your domain lives (the registrar's DNS page).
3. Wait. Vercel shows a tick when it works, usually within an hour.

After the domain works, set `BETTER_AUTH_URL` and `NEXT_PUBLIC_SITE_URL` in Vercel to the real address (with `https://`) and redeploy. Until then, logins and links use the old address.
