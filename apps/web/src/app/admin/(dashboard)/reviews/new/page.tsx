import { requireActor } from "@/lib/auth/session";
import { allow } from "@/lib/auth/guard";
import { can } from "@/lib/auth/rbac";
import { EditorHeader } from "@/components/shared/admin/page-header";
import { ReviewEditor } from "@/features/testimonials/components/review-editor";

export const dynamic = "force-dynamic";

export default async function NewReviewPage() {
  const actor = await requireActor();
  allow(actor, "reviews", "create");

  return (
    <>
      <EditorHeader backHref="/admin/reviews" backLabel="Client reviews" title="Add review" />

      <ReviewEditor
        values={{ id: "", name: "", avatarId: "", reviewedOn: "", quote: "", isFeatured: false, status: "draft" }}
        avatar={null}
        canPublish={can(actor, "reviews", "publish")}
        canDelete={false}
      />
    </>
  );
}
