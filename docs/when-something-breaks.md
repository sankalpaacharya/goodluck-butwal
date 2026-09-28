# When something breaks

In order:

1. **Change not showing?** Wait 5 minutes, reload. Check you pressed Save and the status is Published, not Draft.
2. **Can't see a menu?** Your role doesn't include it. Ask an admin.
3. **Won't publish?** Read the message. It names what's missing, usually alt text on an image.
4. **Won't delete a picture?** Something still uses it. The message says what. Remove it there first.
5. **Deleted one thing by mistake?** Check Archived first. Most deletes are just archiving.
6. **Site down or data wrong?** Do NOT fix the live database by hand. Restore into a new Neon branch, check it, then point the site at it (bucket login details are the R2 keys in `backups.md`):
   - Download the latest backup from the `gem-backups` bucket (`db/{year}/{month}/`).
   - Restore it into a new branch named for the date.
   - Check row counts, then change `DATABASE_URL` in Vercel to the branch and redeploy.
   - After a calm day, make that branch the main one.
7. **One image missing?** Weekly copies sit in the same bucket under `media/`. Download it, re-upload in Cloudinary with the same name. Pages work again with no other change.

Keep a copy of all secrets somewhere safe and offline. They are not in the database or the backups.
