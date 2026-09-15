import { notFound } from "next/navigation";
import { requireActor } from "@/lib/auth/session";
import { allow } from "@/lib/auth/guard";
import { can } from "@/lib/auth/rbac";
import { EditorHeader } from "@/components/shared/admin/page-header";
import { StatusBadge } from "@/components/shared/admin/list-ui";
import { getAdminSuccessStory } from "@/features/testimonials/admin-queries";
import { pickedMedia } from "@/features/media/admin-queries";
import { SuccessStoryEditor } from "@/features/testimonials/components/success-story-editor";

export const dynamic = "force-dynamic";

export default async function SuccessStoryPage({ params }: { params: Promise<{ id: string }> }) {
  const actor = await requireActor();
  allow(actor, "successStories", "update");

  const row = await getAdminSuccessStory((await params).id);
  if (!row) notFound();

  const media = await pickedMedia([row.imageId]);

  return (
    <>
      <EditorHeader
        backHref="/admin/success-stories"
        backLabel="Success stories"
        title={row.title}
        meta={<StatusBadge status={row.status} />}
      />

      <SuccessStoryEditor
        values={{
          id: row.id,
          title: row.title,
          imageId: row.imageId ?? "",
          isFeatured: row.isFeatured,
          status: row.status,
        }}
        image={media[row.imageId ?? ""] ?? null}
        canPublish={can(actor, "successStories", "publish")}
        canDelete={can(actor, "successStories", "delete")}
      />
    </>
  );
}
