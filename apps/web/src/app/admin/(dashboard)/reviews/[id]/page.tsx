import { notFound } from "next/navigation";
import { requireActor } from "@/lib/auth/session";
import { allow } from "@/lib/auth/guard";
import { can } from "@/lib/auth/rbac";
import { EditorHeader } from "@/components/shared/admin/page-header";
import { StatusBadge } from "@/components/shared/admin/list-ui";
import { getAdminReview } from "@/features/testimonials/admin-queries";
import { pickedMedia } from "@/features/media/admin-queries";
import { ReviewEditor } from "@/features/testimonials/components/review-editor";

export const dynamic = "force-dynamic";

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireActor();
  allow(actor, "reviews", "update");

  const row = await getAdminReview((await params).id);
  if (!row) notFound();

  const media = await pickedMedia([row.avatarId]);

  return (
    <>
      <EditorHeader
        backHref="/admin/reviews"
        backLabel="Client reviews"
        title={row.name}
        meta={<StatusBadge status={row.status} />}
      />

      <ReviewEditor
        values={{
          id: row.id,
          name: row.name,
          avatarId: row.avatarId ?? "",
          reviewedOn: row.reviewedOn,
          quote: row.quote,
          isFeatured: row.isFeatured,
          status: row.status,
        }}
        avatar={media[row.avatarId ?? ""] ?? null}
        canPublish={can(actor, "reviews", "publish")}
        canDelete={can(actor, "reviews", "delete")}
      />
    </>
  );
}
