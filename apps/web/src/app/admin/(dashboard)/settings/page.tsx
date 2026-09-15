import { requireActor } from "@/lib/auth/session";
import { allow } from "@/lib/auth/guard";
import { PageHeader, ViewOnSiteButton } from "@/components/shared/admin/page-header";
import { getGoogleRating } from "@/features/settings/queries";
import { GoogleRatingEditor } from "@/features/settings/components/google-rating-editor";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const actor = await requireActor();
  allow(actor, "settings", "update");

  const rating = await getGoogleRating();

  return (
    <>
      <PageHeader
        title="Settings"
        description="Numbers the website prints that are kept somewhere else."
        actions={<ViewOnSiteButton href="/" label="View the home page" />}
      />

      <GoogleRatingEditor score={rating.score} count={rating.count} />
    </>
  );
}
