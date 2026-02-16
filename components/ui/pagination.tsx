import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function PaginationBar({ page, limit, total, onPageChange }: PaginationProps) {
  const totalPages = Math.max(Math.ceil(total / limit), 1);
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#f5b35b] to-[#ee9b40] px-6 py-3 text-white">
      <div className="text-sm font-semibold">
        Showing {start} to {end} of {total} results
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page === 1}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border border-white/50",
            page === 1 ? "opacity-50" : "hover:bg-white/20"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-brand-600">
          {page}
        </div>
        <button
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page === totalPages}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg border border-white/50",
            page === totalPages ? "opacity-50" : "hover:bg-white/20"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
