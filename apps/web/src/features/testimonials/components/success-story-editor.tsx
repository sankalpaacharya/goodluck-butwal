"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createSuccessStory,
  deleteSuccessStory,
  updateSuccessStory,
} from "@/features/testimonials/actions";
import { MediaPicker, type PickedMedia } from "@/features/media/components/media-picker";
import { EditorActionBar, SectionCard } from "@/components/shared/admin/editor-shell";
import { ConfirmDialog } from "@/components/shared/admin/confirm-dialog";
import { UnsavedGuard } from "@/components/shared/admin/unsaved-guard";
import { focusFirstError, useAction } from "@/components/shared/admin/use-action";
import { FieldShell, SelectField, SwitchField, TextField } from "@/components/shared/admin/fields";
import { StatusBadge } from "@/components/shared/admin/list-ui";
import { Button } from "@/components/ui/admin/button";

export type SuccessStoryValues = {
  id: string;
  title: string;
  imageId: string;
  isFeatured: boolean;
  status: string;
};

const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export function SuccessStoryEditor({
  values,
  image,
  canPublish,
  canDelete,
}: {
  values: SuccessStoryValues;
  image: PickedMedia | null;
  canPublish: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const { busy, errors, run } = useAction();
  const [form, setForm] = useState(values);
  const [dirty, setDirty] = useState(false);
  const isNew = values.id === "";

  const set = <K extends keyof SuccessStoryValues>(key: K, value: SuccessStoryValues[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  useEffect(() => focusFirstError(errors), [errors]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      title: form.title,
      imageId: form.imageId,
      isFeatured: form.isFeatured,
      status: canPublish ? form.status : values.status || "draft",
    };

    const saved = await run(
      () => (isNew ? createSuccessStory(payload) : updateSuccessStory({ ...payload, id: values.id })),
      {
        success: isNew ? "Story added" : "Story saved",
        failure: isNew ? "Couldn't add this story." : "Couldn't save this story.",
      },
    );
    if (!saved) return;

    setDirty(false);
    if (isNew) router.push(`/admin/success-stories/${saved.id}`);
    else router.refresh();
  };

  const remove = async () => {
    const done = await run(() => deleteSuccessStory({ id: values.id }), {
      success: "Story deleted",
      failure: "Couldn't delete this story.",
    });
    if (!done) return;
    setDirty(false);
    router.push("/admin/success-stories");
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <UnsavedGuard dirty={dirty} />

      <div className="w-full max-w-2xl space-y-6">
        <SectionCard title="Story">
          <TextField
            name="title"
            label="Description"
            required
            help="Names this story in the list, and describes the graphic to a screen reader."
            value={form.title}
            onChange={(value) => set("title", value)}
            error={errors.title?.[0]}
          />
          <MediaPicker
            label="Image"
            name="imageId"
            value={image}
            type="image"
            required
            onChange={(id) => set("imageId", id ?? "")}
          />
        </SectionCard>

        <SectionCard title="Visibility">
          {canPublish ? (
            <SelectField
              name="status"
              label="Status"
              value={form.status || "draft"}
              onChange={(value) => set("status", value)}
              options={STATUSES}
              error={errors.status?.[0]}
            />
          ) : (
            <FieldShell label="Status">
              <div className="space-y-2">
                <StatusBadge status={form.status || "draft"} />
                <p className="text-xs text-muted-foreground">
                  Your role can save this story but not publish it.
                </p>
              </div>
            </FieldShell>
          )}

          <SwitchField
            label="Priority"
            help="Priority stories come first. The rest follow with the most recently published at the front."
            checked={form.isFeatured}
            onChange={(checked) => set("isFeatured", checked)}
          />
        </SectionCard>
      </div>

      <EditorActionBar
        dirty={dirty}
        busy={busy}
        saveLabel={isNew ? "Add story" : "Save"}
        destructive={
          !isNew && canDelete ? (
            <ConfirmDialog
              trigger={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  Delete
                </Button>
              }
              title="Remove this success story?"
              description="It will no longer appear on the website. This cannot be undone."
              confirmLabel="Delete story"
              onConfirm={remove}
            />
          ) : null
        }
      />
    </form>
  );
}
