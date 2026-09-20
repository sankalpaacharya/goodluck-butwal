"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateCompanyProfile } from "@/features/pages/actions";
import type { CompanyProfileInput } from "@/features/pages/validators";
import { EditorActionBar, SectionCard } from "@/components/shared/admin/editor-shell";
import { UnsavedGuard } from "@/components/shared/admin/unsaved-guard";
import { focusFirstError, useAction } from "@/components/shared/admin/use-action";
import { TextAreaField, TextField } from "@/components/shared/admin/fields";

type Field = keyof CompanyProfileInput;

export function CompanyProfileEditor({ profile }: { profile: CompanyProfileInput }) {
  const router = useRouter();
  const { busy, errors, run } = useAction();
  const [form, setForm] = useState(profile);
  const [dirty, setDirty] = useState(false);

  const set = (key: Field, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  useEffect(() => focusFirstError(errors), [errors]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const saved = await run(() => updateCompanyProfile(form), {
      success: "Company profile saved",
      failure: "Couldn't save the company profile.",
    });
    if (!saved) return;

    setDirty(false);
    router.refresh();
  };

  const field = (key: Field, label: string, help?: string, required?: boolean) => (
    <TextField
      name={key}
      label={label}
      help={help}
      required={required}
      value={form[key]}
      onChange={(value) => set(key, value)}
      error={errors[key]?.[0]}
    />
  );

  return (
    <form onSubmit={save} className="space-y-6">
      <UnsavedGuard dirty={dirty} />

      <div className="w-full max-w-2xl space-y-6">
        <SectionCard
          title="Registration"
          description="The registered particulars, as they appear on the company papers. A field left empty is left off the page."
        >
          {field("registered_name", "Registered name", "The full legal name, not the brand name.", true)}
          {field("type", "Type")}
          {field("registration_authority", "Registration authority")}
          {field("registration_no", "Company registration no.", undefined, true)}
          {field("pan_no", "PAN no.", undefined, true)}
          {field("bank", "Official bank")}
          {field("associations", "Associated with")}
        </SectionCard>

        <SectionCard title="Business" description="What the company does and who runs it.">
          <TextAreaField
            name="business"
            label="Nature of business"
            help="One line, separated by commas."
            required
            rows={2}
            value={form.business}
            onChange={(value) => set("business", value)}
            error={errors.business?.[0]}
          />
          <TextAreaField
            name="operated_by"
            label="Operated and promoted by"
            rows={3}
            value={form.operated_by}
            onChange={(value) => set("operated_by", value)}
            error={errors.operated_by?.[0]}
          />
        </SectionCard>
      </div>

      <EditorActionBar dirty={dirty} busy={busy} />
    </form>
  );
}
