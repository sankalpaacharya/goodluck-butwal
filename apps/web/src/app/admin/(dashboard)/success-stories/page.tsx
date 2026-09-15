import { Sparkles } from "lucide-react";
import { requireActor } from "@/lib/auth/session";
import { allow } from "@/lib/auth/guard";
import { can } from "@/lib/auth/rbac";
import { formatDate } from "@/lib/utils/datetime";
import { PageHeader, ViewOnSiteButton } from "@/components/shared/admin/page-header";
import { FilterBar } from "@/components/shared/admin/filter-bar";
import { EmptyState } from "@/components/shared/admin/states";
import {
  DataCard,
  EditLink,
  FlatBadge,
  Muted,
  NewButton,
  Pager,
  ResultCount,
  RowAvatar,
  StatusBadge,
} from "@/components/shared/admin/list-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/admin/table";
import { listAdminSuccessStories } from "@/features/testimonials/admin-queries";
import { PAGE_SIZE, type AdminFilters } from "@/lib/utils/admin-query";

export const dynamic = "force-dynamic";

export default async function SuccessStoriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const actor = await requireActor();
  allow(actor, "successStories", "read");

  const params = await searchParams;
  const filters: AdminFilters = { ...params, page: Number(params.page ?? 1) };
  const { rows, total, page } = await listAdminSuccessStories(filters);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const narrowed = Boolean(params.q || params.status);
  const canCreate = can(actor, "successStories", "create");

  return (
    <>
      <PageHeader
        title="Success stories"
        description="The visa grant graphics shown on the home page and on /success-stories. Priority stories come first, then the most recently published."
        actions={
          <>
            <ViewOnSiteButton href="/success-stories" label="View the page" />
            {canCreate ? <NewButton href="/admin/success-stories/new">Add story</NewButton> : null}
          </>
        }
      />

      <FilterBar
        searchPlaceholder="Search success stories"
        filters={[
          {
            name: "status",
            label: "Status",
            anyLabel: "All statuses",
            options: [
              { value: "draft", label: "Draft" },
              { value: "published", label: "Published" },
              { value: "archived", label: "Archived" },
            ],
          },
        ]}
      />

      {rows.length === 0 ? (
        narrowed ? (
          <EmptyState
            icon={Sparkles}
            title="No stories match those filters"
            description="Clear the search or the filters to see them all again."
          />
        ) : (
          <EmptyState
            icon={Sparkles}
            title="No success stories yet"
            description="Add the first story to show it on the home page."
            action={canCreate ? <NewButton href="/admin/success-stories/new">Add story</NewButton> : null}
          />
        )
      ) : (
        <DataCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Story</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden whitespace-nowrap md:table-cell">Published</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <RowAvatar name={row.title} src={row.thumb || null} />
                  </TableCell>
                  <TableCell className="max-w-96 font-medium">{row.title}</TableCell>
                  <TableCell>
                    <span className="flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={row.status} />
                      {row.isFeatured ? <FlatBadge variant="default">Priority</FlatBadge> : null}
                    </span>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap md:table-cell">
                    {row.publishedAt ? formatDate(row.publishedAt) : <Muted>Not published</Muted>}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center justify-end gap-1">
                      <EditLink href={`/admin/success-stories/${row.id}`} />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataCard>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <ResultCount shown={rows.length} total={total} noun="stories" />
        <Pager page={page} pages={pages} params={params} />
      </div>
    </>
  );
}
