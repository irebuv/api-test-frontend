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

    const range = (start: number, end: number) =>
        Array.from({ length: end - start + 1 }, (_, i) => start + i);

    const pages: (number | "dots")[] = [];
    const side = Math.floor((maxPagesToShow - 3) / 2);
    const left = Math.max(2, current_page - side);
    const right = Math.min(last_page - 1, current_page + side);

    pages.push(1);
    if (left > 2) pages.push("dots");
    pages.push(...range(left, right));
    if (right < last_page - 1) pages.push("dots");
    pages.push(last_page);

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
                        <span key={i} className="px-3 select-none text-sm text-muted-foreground">
            …
          </span>
                    ) : (
                        <Button
                            key={p}
                            variant={p === current_page ? "default" : "outline"}
                            onClick={() => onPageChange(p)}
                            className="cursor-pointer"
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

