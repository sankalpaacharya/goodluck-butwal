import { requireActor } from "@/lib/auth/session";
import { allow } from "@/lib/auth/guard";
import { PageHeader, ViewOnSiteButton } from "@/components/shared/admin/page-header";
import { getCompanyProfile } from "@/features/pages/queries";
import { CompanyProfileEditor } from "@/features/pages/components/company-profile-editor";

export const dynamic = "force-dynamic";

export default async function CompanyProfileSettingsPage() {
  const actor = await requireActor();
  allow(actor, "settings", "update");

  const profile = await getCompanyProfile();

  return (
    <>
      <PageHeader
        title="Company profile"
        description="The registered particulars printed on the company profile page."
        actions={<ViewOnSiteButton href="/company-profile" label="View the company profile" />}
      />

      <CompanyProfileEditor
        profile={{
          registered_name: profile?.registered_name ?? "",
          type: profile?.type ?? "",
          registration_authority: profile?.registration_authority ?? "",
          registration_no: profile?.registration_no ?? "",
          pan_no: profile?.pan_no ?? "",
          bank: profile?.bank ?? "",
          associations: profile?.associations ?? "",
          business: profile?.business ?? "",
          operated_by: profile?.operated_by ?? "",
        }}
      />
    </>
  );
}
