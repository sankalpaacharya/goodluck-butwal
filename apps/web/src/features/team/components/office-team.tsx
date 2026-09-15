"use client";

import type { OfficeId } from "@/config/site";
import type { PublicMember } from "@/features/team/queries";
import { TeamCard } from "@/components/shared/inner";
import { useOffice } from "@/features/offices/components/office";

// The visitor sees the office their timezone puts them in, Australia for anywhere else. An
// office with nobody published falls back to everyone rather than an empty block.
function forVisitor(team: PublicMember[], office: OfficeId) {
  const local = team.filter((m) => m.office === office);
  return local.length ? local : team;
}

export function OfficeTeam({ team }: { team: PublicMember[] }) {
  const { office } = useOffice();
  const shown = forVisitor(team, office);
  return (
    <div className="grid w-full grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-[30px] md:gap-y-10 lg:grid-cols-4">
      {shown.map((m, i) => (
        <TeamCard key={m.slug} name={m.name} role={m.role} photo={m.photo} delay={Math.min(i * 0.04, 0.4)} href={`/team/${m.slug}`} />
      ))}
    </div>
  );
}

// The five on the about page, same rule.
export function AboutTeam({ team }: { team: PublicMember[] }) {
  const { office } = useOffice();
  const shown = forVisitor(team, office).slice(0, 5);
  return (
    <div className="grid w-full grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-[30px] md:gap-y-10 lg:grid-cols-5">
      {shown.map((m, i) => (
        <div key={m.slug} className={shown.length === 5 && i === 4 ? "col-span-2 md:col-span-1" : ""}>
          <TeamCard name={m.name} role={m.role} photo={m.photo} delay={0.08 * i} href={`/team/${m.slug}`} />
        </div>
      ))}
    </div>
  );
}
