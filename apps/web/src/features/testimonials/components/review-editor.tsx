"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createReview, deleteReview, updateReview } from "@/features/testimonials/actions";
import { MediaPicker, type PickedMedia } from "@/features/media/components/media-picker";
import { EditorActionBar, SectionCard } from "@/components/shared/admin/editor-shell";
import { ConfirmDialog } from "@/components/shared/admin/confirm-dialog";
import { UnsavedGuard } from "@/components/shared/admin/unsaved-guard";
import { focusFirstError, useAction } from "@/components/shared/admin/use-action";
import { FieldShell, SelectField, SwitchField, TextAreaField, TextField } from "@/components/shared/admin/fields";
import { StatusBadge } from "@/components/shared/admin/list-ui";
import { Button } from "@/components/ui/admin/button";

export type ReviewValues = {
  id: string;
  name: string;
  avatarId: string;
  reviewedOn: string;
  quote: string;
  isFeatured: boolean;
  status: string;
};

const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
];

export function ReviewEditor({
  values,
  avatar,
  canPublish,
  canDelete,
}: {
  values: ReviewValues;
  avatar: PickedMedia | null;
  canPublish: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const { busy, errors, run } = useAction();
  const [form, setForm] = useState(values);
  const [dirty, setDirty] = useState(false);
  const isNew = values.id === "";

  const set = <K extends keyof ReviewValues>(key: K, value: ReviewValues[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  useEffect(() => focusFirstError(errors), [errors]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      name: form.name,
      avatarId: form.avatarId,
      reviewedOn: form.reviewedOn,
      quote: form.quote,
      isFeatured: form.isFeatured,
      status: canPublish ? form.status : values.status || "draft",
    };

    const saved = await run(
      () => (isNew ? createReview(payload) : updateReview({ ...payload, id: values.id })),
      {
        success: isNew ? "Review added" : "Review saved",
        failure: isNew ? "Couldn't add this review." : "Couldn't save this review.",
      },
    );
    if (!saved) return;

    setDirty(false);
    if (isNew) router.push(`/admin/reviews/${saved.id}`);
    else router.refresh();
  };

  const remove = async () => {
    const done = await run(() => deleteReview({ id: values.id }), {
      success: "Review deleted",
      failure: "Couldn't delete this review.",
    });
    if (!done) return;
    setDirty(false);
    router.push("/admin/reviews");
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <UnsavedGuard dirty={dirty} />

      <div className="w-full max-w-2xl space-y-6">
        <SectionCard title="Review">
          <TextField
            name="name"
            label="Reviewer"
            required
            value={form.name}
            onChange={(value) => set("name", value)}
            error={errors.name?.[0]}
          />
          <TextField
            name="reviewedOn"
            label="Date on Google"
            type="date"
            required
            help="Only the month and year are shown, so any day in that month will do."
            value={form.reviewedOn}
            onChange={(value) => set("reviewedOn", value)}
            error={errors.reviewedOn?.[0]}
          />
          <TextAreaField
            name="quote"
            label="What they wrote"
            required
            rows={6}
            value={form.quote}
            onChange={(value) => set("quote", value)}
            error={errors.quote?.[0]}
          />
          <MediaPicker
            label="Photo"
            name="avatarId"
            value={avatar}
            type="image"
            help="Optional. Without one the card shows the first letter of the name, the way Google does."
            onChange={(id) => set("avatarId", id ?? "")}
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
                  Your role can save this review but not publish it.
                </p>
              </div>
            </FieldShell>
          )}

          <SwitchField
            label="Priority"
            help="Priority reviews come first. The rest follow with the most recent at the front."
            checked={form.isFeatured}
            onChange={(checked) => set("isFeatured", checked)}
          />
        </SectionCard>
      </div>

      <EditorActionBar
        dirty={dirty}
        busy={busy}
        saveLabel={isNew ? "Add review" : "Save"}
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
              title={`Remove the review from ${values.name}?`}
              description="It will no longer appear on the website. This cannot be undone."
              confirmLabel="Delete review"
              onConfirm={remove}
            />
          ) : null
        }
      />
    </form>
  );
}
