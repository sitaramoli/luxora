import Link from "next/link";
import { Button } from "@/components/ui/button";

function buildHref(basePath: string, params: Record<string, string | number | undefined>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "" && v !== "all") sp.set(k, String(v));
    if (v === "all") sp.set(k, String(v));
  }
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function ServerPagination({
  basePath,
  page,
  totalPages,
  pageSize,
  extraParams = {},
  pageParamName = "page",
  pageSizeParamName = "pageSize",
}: {
  basePath: string;
  page: number;
  totalPages: number;
  pageSize?: number;
  extraParams?: Record<string, string | number | undefined>;
  pageParamName?: string;
  pageSizeParamName?: string;
}) {
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  const common = { ...extraParams, [pageSizeParamName]: pageSize } as Record<string, string | number | undefined>;

  return (
    <div className="flex w-full items-center justify-between gap-2 py-3">
      <div className="text-sm text-muted-foreground">
        Page {page} of {Math.max(totalPages, 1)}
      </div>
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" disabled={prevDisabled}>
          <Link href={buildHref(basePath, { ...common, [pageParamName]: 1 })}>First</Link>
        </Button>
        <Button asChild variant="outline" size="sm" disabled={prevDisabled}>
          <Link href={buildHref(basePath, { ...common, [pageParamName]: Math.max(page - 1, 1) })}>Prev</Link>
        </Button>
        <Button asChild variant="outline" size="sm" disabled={nextDisabled}>
          <Link href={buildHref(basePath, { ...common, [pageParamName]: Math.min(page + 1, Math.max(totalPages, 1)) })}>Next</Link>
        </Button>
        <Button asChild variant="outline" size="sm" disabled={nextDisabled}>
          <Link href={buildHref(basePath, { ...common, [pageParamName]: Math.max(totalPages, 1) })}>Last</Link>
        </Button>
      </div>
    </div>
  );
}
