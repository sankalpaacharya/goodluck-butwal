import { Mail, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import type { PublicOffice } from "@/features/offices/queries";
import { SocialLinks } from "@/components/ui/bits";

// The icon row the company profile already uses: 16px at 1.8, nudged to the text baseline.
function Detail({ icon: I, className, children }: { icon: LucideIcon; className?: string; children: React.ReactNode }) {
  return (
    <span className={`flex items-start gap-2 ${className ?? ""}`}>
      <I size={16} strokeWidth={1.8} aria-hidden className="mt-[3px] shrink-0 opacity-70" />
      <span className="min-w-0">{children}</span>
    </span>
  );
}

// Fixed order, head office first and dark. Deliberately not the visitor's own office: this block
// is the whole contact list, so everyone sees the same three in the same order.
export function OfficeContactCards({ offices, whatsappLabel }: { offices: PublicOffice[]; whatsappLabel: string }) {
  return (
    <div className="grid w-full gap-[10px]">
      {offices.map((o, i) => {
        const dark = i === 0;
        const quiet = dark ? "text-gray-text" : "text-muted";
        const link = `t-base font-medium transition-colors ${dark ? "text-white hover:text-gray-text" : "text-ink hover:text-muted"}`;
        return (
          <div
            key={o.id}
            className={`flex flex-col items-center gap-3 rounded-[10px] p-4 text-center ring-1 ring-inset md:gap-4 md:rounded-[20px] md:p-5 ${dark ? "bg-ink text-white ring-ink" : "bg-white ring-hairline"}`}
          >
            <div className="flex flex-col gap-[2px]">
              <p className={`t-small ${quiet}`}>{o.label}</p>
              <p className="text-[18px] font-semibold leading-[23.4px]">{o.city}, {o.country}</p>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Detail icon={MapPin} className={`t-base ${quiet}`}>{o.address}</Detail>
              <div className="flex flex-col items-center gap-2 md:flex-row md:flex-wrap md:justify-center md:gap-x-6">
                <Detail icon={Phone} className={link}>
                  <a href={o.tel}>{o.phone}</a>
                </Detail>
                {o.whatsapp && (
                  <Detail icon={MessageCircle} className={link}>
                    <a href={o.whatsapp} target="_blank" rel="noopener">{whatsappLabel}</a>
                  </Detail>
                )}
                {o.email && (
                  <Detail icon={Mail} className={link}>
                    <a href={`mailto:${o.email}`} className="break-all">{o.email}</a>
                  </Detail>
                )}
              </div>
            </div>

            {o.socials.length > 0 && <SocialLinks links={o.socials} tone={dark ? "dark" : "light"} />}
          </div>
        );
      })}
    </div>
  );
}
