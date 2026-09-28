import { Link } from "@/components/ui/link";
import { Appear } from "@/components/ui/appear";
import { Badge } from "@/components/ui/bits";
import { Arrow } from "@/components/ui/icons";
import type { SitemapGroup, SitemapLink } from "@/features/sitemap/queries";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

function SitemapRow({ link }: { link: SitemapLink }) {
  return (
    <li>
      <Link
        href={link.href}
        className="group flex items-center gap-[10px] rounded-[8px] py-[7px] pr-2 text-ink/75 transition-colors duration-200 hover:text-ink"
      >
        <span className="t-base min-w-0 flex-1 transition-transform duration-300 group-hover:translate-x-1">
          {link.label}
        </span>
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Arrow className="h-[7px] w-[11px]" />
        </span>
      </Link>
    </li>
  );
}

export function SitemapColumns({ groups, className }: { groups: SitemapGroup[]; className?: string }) {
  return (
    <div className={cx("w-full gap-[30px] md:columns-2 lg:columns-3 lg:gap-[40px]", className)}>
      {groups.map((group, i) => {
        const sections = group.links.filter((link) => link.kind === "index");
        const pages = group.links.filter((link) => link.kind === "page");
        return (
          <Appear key={group.id} delay={0.06 * i} className="mb-5 break-inside-avoid md:mb-[30px] lg:mb-[40px]">
            <div className="flex w-full flex-col overflow-clip rounded-[10px] bg-surface p-5 md:rounded-[30px] md:p-[30px]">
              <div className="flex items-center gap-[10px] pb-5">
                <h2 id={group.id} className="t-h5">
                  {group.title}
                </h2>
                <Badge tone="white" className="ring-1 ring-hairline">
                  {group.links.length}
                </Badge>
              </div>

              <ul className="flex w-full flex-col">
                {sections.map((link) => (
                  <SitemapRow key={link.href} link={link} />
                ))}
              </ul>

              {pages.length > 0 && (
                <div className="mt-4 border-t border-hairline pt-4">
                  <p className="t-small pb-2 text-muted">All pages</p>
                  <ul className="flex w-full flex-col">
                    {pages.map((link) => (
                      <SitemapRow key={link.href} link={link} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Appear>
        );
      })}
    </div>
  );
}
