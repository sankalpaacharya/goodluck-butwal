import { requireActor } from "@/lib/auth/session";
import { allow } from "@/lib/auth/guard";
import { PageHeader, ViewOnSiteButton } from "@/components/shared/admin/page-header";
import { getContactAdmin } from "@/features/contact/admin-queries";
import { ContactEditor } from "@/features/contact/components/contact-editor";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const actor = await requireActor();
  allow(actor, "settings", "update");

  const contact = await getContactAdmin();

  return (
    <>
      <PageHeader
        title="Contact"
        description="Phone numbers, emails and social links the site prints."
        actions={<ViewOnSiteButton href="/contact" label="View the contact page" />}
      />
      <ContactEditor initial={contact} />
    </>
  );
}
