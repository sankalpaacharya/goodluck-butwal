"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateGoogleRating } from "@/features/settings/actions";
import { EditorActionBar, SectionCard } from "@/components/shared/admin/editor-shell";
import { UnsavedGuard } from "@/components/shared/admin/unsaved-guard";
import { focusFirstError, useAction } from "@/components/shared/admin/use-action";
import { TextField } from "@/components/shared/admin/fields";

export function GoogleRatingEditor({ score, count }: { score: string; count: number }) {
  const router = useRouter();
  const { busy, errors, run } = useAction();
  const [form, setForm] = useState({ score, count: String(count) });
  const [dirty, setDirty] = useState(false);

  const set = (key: "score" | "count", value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  useEffect(() => focusFirstError(errors), [errors]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const saved = await run(() => updateGoogleRating(form), {
      success: "Google rating saved",
      failure: "Couldn't save the Google rating.",
    });
    if (!saved) return;

    setDirty(false);
    router.refresh();
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <UnsavedGuard dirty={dirty} />

      <div className="w-full max-w-2xl space-y-6">
        <SectionCard
          title="Google rating"
          description="Shown on the home page, the about page and the success stories page. Copy the two numbers from the Google listing."
        >
          <TextField
            name="score"
            label="Rating"
            required
            help="Out of 5, as Google shows it."
            value={form.score}
            onChange={(value) => set("score", value)}
            error={errors.score?.[0]}
          />
          <TextField
            name="count"
            label="Number of reviews"
            required
            value={form.count}
            onChange={(value) => set("count", value)}
            error={errors.count?.[0]}
          />
        </SectionCard>
      </div>

      <EditorActionBar dirty={dirty} busy={busy} />
    </form>
  );
}
