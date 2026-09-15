import { MessageSquareQuote } from "lucide-react";
import { requireActor } from "@/lib/auth/session";
import { allow } from "@/lib/auth/guard";
import { can } from "@/lib/auth/rbac";
import { formatMonth } from "@/lib/utils/datetime";
import { PageHeader, ViewOnSiteButton } from "@/components/shared/admin/page-header";
import { FilterBar } from "@/components/shared/admin/filter-bar";
import { EmptyState } from "@/components/shared/admin/states";
import {
  DataCard,
  EditLink,
  FlatBadge,
  NewButton,
  Pager,
  ResultCount,
  RowAvatar,
  StatusBadge,
} from "@/components/shared/admin/list-ui";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/admin/table";
import { listAdminReviews } from "@/features/testimonials/admin-queries";
import { PAGE_SIZE, type AdminFilters } from "@/lib/utils/admin-query";

export const dynamic = "force-dynamic";

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const actor = await requireActor();
  allow(actor, "reviews", "read");

  const params = await searchParams;
  const filters: AdminFilters = { ...params, page: Number(params.page ?? 1) };
  const { rows, total, page } = await listAdminReviews(filters);
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const narrowed = Boolean(params.q || params.status);
  const canCreate = can(actor, "reviews", "create");

  return (
    <>
      <PageHeader
        title="Client reviews"
        description="The Google reviews quoted on the home page and on /success-stories. Priority reviews come first, then the most recent."
        actions={
          <>
            <ViewOnSiteButton href="/success-stories" label="View the page" />
            {canCreate ? <NewButton href="/admin/reviews/new">Add review</NewButton> : null}
          </>
        }
      />

      <FilterBar
        searchPlaceholder="Search by reviewer"
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
            icon={MessageSquareQuote}
            title="No reviews match those filters"
            description="Clear the search or the filters to see them all again."
          />
        ) : (
          <EmptyState
            icon={MessageSquareQuote}
            title="No reviews yet"
            description="Copy one off the Google listing to show it on the website."
            action={canCreate ? <NewButton href="/admin/reviews/new">Add review</NewButton> : null}
          />
        )
      ) : (
        <DataCard>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <span className="sr-only">Photo</span>
                </TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead className="hidden lg:table-cell">Review</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden whitespace-nowrap md:table-cell">Dated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <RowAvatar name={row.name} src={row.avatar || null} />
                  </TableCell>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="hidden max-w-96 truncate lg:table-cell">{row.quote}</TableCell>
                  <TableCell>
                    <span className="flex flex-wrap items-center gap-1.5">
                      <StatusBadge status={row.status} />
                      {row.isFeatured ? <FlatBadge variant="default">Priority</FlatBadge> : null}
                    </span>
                  </TableCell>
                  <TableCell className="hidden whitespace-nowrap md:table-cell">{formatMonth(row.reviewedOn)}</TableCell>
                  <TableCell>
                    <span className="flex items-center justify-end gap-1">
                      <EditLink href={`/admin/reviews/${row.id}`} />
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DataCard>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <ResultCount shown={rows.length} total={total} noun="reviews" />
        <Pager page={page} pages={pages} params={params} />
      </div>
    </>
  );
}
