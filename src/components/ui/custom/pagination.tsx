// Pagination.tsx — fix unique keys and add a couple of small guards
import React from "react";
import { Button } from "@/components/ui/button";

type Paginated = {
  current_page: number;
  last_page: number;
};

type PaginationProps = {
  products?: Paginated | null;
  onPageChange: (page: number) => void;
  maxPagesToShow?: number;
};

export const Pagination: React.FC<PaginationProps> = ({
  products,
  onPageChange,
  maxPagesToShow = 7,
}) => {
  if (!products || products.last_page <= 1) return null;

  const { current_page, last_page } = products;

  // Build inclusive integer range [start, end]
  const range = (start: number, end: number) =>
    start > end ? [] : Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const pages: (number | "dots")[] = [];
  const side = Math.max(0, Math.floor((maxPagesToShow - 3) / 2));
  const left = Math.max(2, current_page - side);
  const right = Math.min(last_page - 1, current_page + side);

  pages.push(1);
  if (left > 2) pages.push("dots");
  pages.push(...range(left, right));
  if (right < last_page - 1) pages.push("dots");
  if (last_page > 1) pages.push(last_page);

  return (
    <div className="flex items-center gap-2 justify-center mt-6">
      <Button
        variant="outline"
        disabled={current_page <= 1}
        onClick={() => onPageChange(current_page - 1)}
        className="cursor-pointer"
      >
        Prev
      </Button>

      {pages.map((p, i) =>
        p === "dots" ? (
          <span
            key={`dots-${i}`} // use a namespaced key to avoid clashes
            className="px-3 select-none text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Button
            key={`page-${p}`} // namespaced key for numeric pages
            variant={p === current_page ? "default" : "outline"}
            onClick={() => onPageChange(p)}
            className="cursor-pointer"
            aria-current={p === current_page ? "page" : undefined} // a11y nicety
          >
            {p}
          </Button>
        )
      )}

      <Button
        variant="outline"
        disabled={current_page >= last_page}
        onClick={() => onPageChange(current_page + 1)}
        className="cursor-pointer"
      >
        Next
      </Button>
    </div>
  );
};
