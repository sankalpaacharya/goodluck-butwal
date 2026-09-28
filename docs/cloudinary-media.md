# Images and videos (Cloudinary)

All uploads live in Cloudinary, not on the server.

Setup:

1. Create a Cloudinary account.
2. From the dashboard copy: cloud name → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, API key → `CLOUDINARY_API_KEY`, API secret → `CLOUDINARY_API_SECRET`.
3. Save and redeploy (live) or restart `pnpm dev` (local).

Static images (logos, flags, backgrounds) live in the repo under `apps/web/public/`. To push them to Cloudinary:

```bash
pnpm assets:upload
```

Free plan: 25 credits a month. Past that, uploads fail but existing images keep showing.

To replace a picture the site already shows: admin, Images, search, Replace. The address stays the same, so every page updates at once. To delete one: it must first be removed from every record that uses it. The error message names them.
