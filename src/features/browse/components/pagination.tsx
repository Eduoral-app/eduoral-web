"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CustomPagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 2) {
      pages.push(1, 2, 3, "...");
    } else if (page >= totalPages - 1) {
      pages.push("...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push("...", page - 1, page, page + 1, "...");
    }

    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="p-2 rounded-lg border border-border bg-card disabled:opacity-40 hover:bg-muted"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p, index) =>
        p === "..." ? (
          <span key={`dots-${index}`} className="px-2 text-muted-foreground">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(Number(p))}
            className={`
              min-w-8 h-8 rounded-lg text-sm font-mono
              ${
                page === p
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }
            `}
          >
            {p}
          </button>
        ),
      )}

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="p-2 rounded-lg border border-border bg-card disabled:opacity-40 hover:bg-muted"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
