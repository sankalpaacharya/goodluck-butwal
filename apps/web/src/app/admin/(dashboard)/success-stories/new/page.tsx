import { requireActor } from "@/lib/auth/session";
import { allow } from "@/lib/auth/guard";
import { can } from "@/lib/auth/rbac";
import { EditorHeader } from "@/components/shared/admin/page-header";
import { SuccessStoryEditor } from "@/features/testimonials/components/success-story-editor";

export const dynamic = "force-dynamic";

export default async function NewSuccessStoryPage() {
  const actor = await requireActor();
  allow(actor, "successStories", "create");

  return (
    <>
      <EditorHeader backHref="/admin/success-stories" backLabel="Success stories" title="Add story" />

      <SuccessStoryEditor
        values={{ id: "", title: "", imageId: "", isFeatured: false, status: "draft" }}
        image={null}
        canPublish={can(actor, "successStories", "publish")}
        canDelete={false}
      />
    </>
  );
}
