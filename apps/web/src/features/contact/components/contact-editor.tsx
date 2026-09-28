"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateContact } from "@/features/contact/actions";
import type { ContactAdmin } from "@/features/contact/admin-queries";
import { EditorActionBar, SectionCard } from "@/components/shared/admin/editor-shell";
import { UnsavedGuard } from "@/components/shared/admin/unsaved-guard";
import { focusFirstError, useAction } from "@/components/shared/admin/use-action";
import { TextField } from "@/components/shared/admin/fields";
import { Button } from "@/components/ui/admin/button";

type OfficeForm = ContactAdmin["offices"][number];

export function ContactEditor({ initial }: { initial: ContactAdmin }) {
  const router = useRouter();
  const { busy, errors, run } = useAction();
  const [footerEmail, setFooterEmail] = useState(initial.footerEmail);
  const [socials, setSocials] = useState({
    facebookUrl: initial.facebookUrl,
    instagramUrl: initial.instagramUrl,
    tiktokUrl: initial.tiktokUrl,
    linkedinUrl: initial.linkedinUrl,
  });
  const [offices, setOffices] = useState<OfficeForm[]>(initial.offices);
  const [dirty, setDirty] = useState(false);

  useEffect(() => focusFirstError(errors), [errors]);

  const setOffice = (id: string, key: keyof OfficeForm, value: string) => {
    setOffices((current) => current.map((office) => (office.id === id ? { ...office, [key]: value } : office)));
    setDirty(true);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    const saved = await run(
      () => updateContact({ footerEmail, ...socials, offices }),
      { success: "Contact details saved", failure: "Couldn't save the contact details." },
    );
    if (!saved) return;
    setDirty(false);
    router.refresh();
  };

  return (
    <form onSubmit={save} className="space-y-6">
      <UnsavedGuard dirty={dirty} />
      <div className="w-full max-w-2xl space-y-6">
        <SectionCard
          title="Footer email"
          description="The email the footer prints under the logo. Pick one of the office emails or type another."
        >
          <TextField
            name="footerEmail"
            label="Email shown in the footer"
            required
            type="email"
            autoComplete="email"
            value={footerEmail}
            onChange={(value) => {
              setFooterEmail(value);
              setDirty(true);
            }}
            error={errors.footerEmail?.[0]}
          />
          <div className="flex flex-wrap gap-2">
            {offices.map((office) => (
              <Button
                key={office.id}
                type="button"
                variant={footerEmail.trim().toLowerCase() === office.email.trim().toLowerCase() && office.email.trim() !== "" ? "default" : "outline"}
                size="sm"
                disabled={office.email.trim() === ""}
                onClick={() => {
                  setFooterEmail(office.email.trim());
                  setDirty(true);
                }}
              >
                {footerEmail.trim().toLowerCase() === office.email.trim().toLowerCase() && office.email.trim() !== ""
                  ? `Showing ${office.city || office.name}`
                  : `Show ${office.city || office.name}`}
              </Button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Social media" description="Empty stays hidden on the site. Use full links starting with https://.">
          <TextField
            name="facebookUrl"
            label="Facebook"
            placeholder="https://www.facebook.com/"
            value={socials.facebookUrl}
            onChange={(value) => {
              setSocials((current) => ({ ...current, facebookUrl: value }));
              setDirty(true);
            }}
            error={errors.facebookUrl?.[0]}
          />
          <TextField
            name="instagramUrl"
            label="Instagram"
            placeholder="https://www.instagram.com/"
            value={socials.instagramUrl}
            onChange={(value) => {
              setSocials((current) => ({ ...current, instagramUrl: value }));
              setDirty(true);
            }}
            error={errors.instagramUrl?.[0]}
          />
          <TextField
            name="tiktokUrl"
            label="TikTok"
            placeholder="https://www.tiktok.com/@"
            value={socials.tiktokUrl}
            onChange={(value) => {
              setSocials((current) => ({ ...current, tiktokUrl: value }));
              setDirty(true);
            }}
            error={errors.tiktokUrl?.[0]}
          />
          <TextField
            name="linkedinUrl"
            label="LinkedIn"
            placeholder="https://www.linkedin.com/in/"
            value={socials.linkedinUrl}
            onChange={(value) => {
              setSocials((current) => ({ ...current, linkedinUrl: value }));
              setDirty(true);
            }}
            error={errors.linkedinUrl?.[0]}
          />
        </SectionCard>

        {offices.map((office, index) => (
          <SectionCard key={office.id} title={`${office.city || office.name}, ${office.country}`}>
            <TextField
              name={`offices.${index}.phoneDisplay`}
              label="Phone number shown on the site"
              placeholder="(03) 9466 4783"
              value={office.phoneDisplay}
              onChange={(value) => setOffice(office.id, "phoneDisplay", value)}
              error={errors[`offices.${index}.phoneDisplay`]?.[0]}
            />
            <TextField
              name={`offices.${index}.phone`}
              label="Dial number"
              placeholder="+61394664783"
              value={office.phone}
              onChange={(value) => setOffice(office.id, "phone", value)}
              error={errors[`offices.${index}.phone`]?.[0]}
            />
            <TextField
              name={`offices.${index}.whatsapp`}
              label="WhatsApp number"
              placeholder="+9779850000000"
              value={office.whatsapp}
              onChange={(value) => setOffice(office.id, "whatsapp", value)}
              error={errors[`offices.${index}.whatsapp`]?.[0]}
            />
            <TextField
              name={`offices.${index}.email`}
              label="Email"
              type="email"
              placeholder="office@example.com"
              value={office.email}
              onChange={(value) => setOffice(office.id, "email", value)}
              error={errors[`offices.${index}.email`]?.[0]}
            />
            <TextField
              name={`offices.${index}.facebookUrl`}
              label="Facebook"
              placeholder="https://www.facebook.com/"
              value={office.facebookUrl}
              onChange={(value) => setOffice(office.id, "facebookUrl", value)}
              error={errors[`offices.${index}.facebookUrl`]?.[0]}
            />
            <TextField
              name={`offices.${index}.instagramUrl`}
              label="Instagram"
              placeholder="https://www.instagram.com/"
              value={office.instagramUrl}
              onChange={(value) => setOffice(office.id, "instagramUrl", value)}
              error={errors[`offices.${index}.instagramUrl`]?.[0]}
            />
            <TextField
              name={`offices.${index}.tiktokUrl`}
              label="TikTok"
              placeholder="https://www.tiktok.com/@"
              value={office.tiktokUrl}
              onChange={(value) => setOffice(office.id, "tiktokUrl", value)}
              error={errors[`offices.${index}.tiktokUrl`]?.[0]}
            />
            <TextField
              name={`offices.${index}.linkedinUrl`}
              label="LinkedIn"
              placeholder="https://www.linkedin.com/in/"
              value={office.linkedinUrl}
              onChange={(value) => setOffice(office.id, "linkedinUrl", value)}
              error={errors[`offices.${index}.linkedinUrl`]?.[0]}
            />
          </SectionCard>
        ))}
      </div>
      <EditorActionBar dirty={dirty} busy={busy} />
    </form>
  );
}
