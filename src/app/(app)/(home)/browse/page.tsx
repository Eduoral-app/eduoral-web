"use client";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import CustomPagination from "@/features/browse/components/pagination";
import ResourceCard from "@/features/browse/components/resource-card";
import type { ResourceType } from "@/generated/prisma/enums";
import { useGetResources } from "@/hooks/use-getResources";
import {
  BOARDS,
  mapResourcesToCards,
  RESOURCE_TYPES,
  SUBJECTS,
  YEARS,
} from "@/lib/data";
import { CheckCircle, ChevronDown, Filter, Search } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [q, setQ] = useState("");
  const [sortBy, setSortBy] = useState<
    "downloads" | "views" | "date" | "likes"
  >("downloads");
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>([]);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  function toggle<T>(arr: T[], setArr: (a: T[]) => void, val: T) {
    setArr(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }

  const activeCount =
    selectedTypes.length +
    selectedBoards.length +
    selectedSubjects.length +
    selectedYears.length;

  const { data, isError, isLoading } = useGetResources({
    page: page,
    limit: 12,
    search: q,
    type: selectedTypes[0],
    board: selectedBoards[0],
    subject: selectedSubjects[0],
    year: selectedYears[0],
    // sort: sortBy === "date" ? "latest" : sortBy,
  });

  const filtered = mapResourcesToCards(
    data ? (data.resources ? data.resources : []) : [],
  );

  console.log(data);

  return (
    <div className="flex gap-6 mt-3">
      {showFilters && (
        <aside className="w-56 shrink-0 space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
              Filters
            </p>
            {activeCount > 0 && (
              <button
                onClick={() => {
                  setSelectedTypes([]);
                  setSelectedBoards([]);
                  setSelectedSubjects([]);
                  setSelectedYears([]);
                }}
                className="text-[10px] font-mono text-primary hover:underline"
              >
                Clear ({activeCount})
              </button>
            )}
          </div>
          <FilterGroup title="Resource Type">
            {RESOURCE_TYPES.map((t: any) => (
              <FilterChip
                key={t}
                label={t}
                active={selectedTypes.includes(t)}
                onClick={() => toggle(selectedTypes, setSelectedTypes, t)}
              />
            ))}
          </FilterGroup>
          <FilterGroup title="Board / Institution">
            {BOARDS.map((b) => (
              <FilterChip
                key={b}
                label={b}
                active={selectedBoards.includes(b)}
                onClick={() => toggle(selectedBoards, setSelectedBoards, b)}
              />
            ))}
          </FilterGroup>
          <FilterGroup title="Subject">
            {SUBJECTS.map((s) => (
              <FilterChip
                key={s}
                label={s}
                active={selectedSubjects.includes(s)}
                onClick={() => toggle(selectedSubjects, setSelectedSubjects, s)}
              />
            ))}
          </FilterGroup>
          <FilterGroup title="Year">
            {YEARS.map((y) => (
              <FilterChip
                key={y}
                label={String(y)}
                active={selectedYears.includes(y)}
                onClick={() => toggle(selectedYears, setSelectedYears, y)}
              />
            ))}
          </FilterGroup>
        </aside>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search resources…"
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors ${showFilters ? "border-primary/40 text-primary bg-primary/10" : "border-border text-muted-foreground bg-card hover:text-foreground"}`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
            {activeCount > 0 && (
              <span className="bg-primary text-primary-foreground text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
          >
            <option value="downloads">Most Downloaded</option>
            <option value="views">Most Viewed</option>
            <option value="likes">Most Liked</option>
            <option value="date">Newest</option>
          </select>
        </div>

        {!isLoading && (
          <p className="text-[11px] font-mono text-muted-foreground mb-4">
            {filtered.length} resource{filtered.length !== 1 ? "s" : ""} found
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {isLoading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="w-full h-60" />
            ))
          ) : isError ? (
            <div className="text-center py-20 border border-dashed border-border rounded-xl">
              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-sm text-muted-foreground">
                No resources match your filters.
              </p>
            </div>
          ) : (
            filtered.map((r) => <ResourceCard key={r.id} r={r} />)
          )}
        </div>
        <CustomPagination
          page={page}
          totalPages={isLoading || isError ? 1 : (data?.pagination.pages ?? 1)}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-t border-border pt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-2.5"
      >
        <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
        <ChevronDown
          className={`w-3 h-3 text-muted-foreground transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && <div className="flex flex-col gap-1">{children}</div>}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-left px-2 py-1.5 rounded text-[11px] font-mono transition-colors ${active ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}
    >
      <span
        className={`w-3 h-3 rounded border shrink-0 flex items-center justify-center transition-colors ${active ? "border-primary bg-primary" : "border-border"}`}
      >
        {active && (
          <CheckCircle className="w-2.5 h-2.5 text-primary-foreground" />
        )}
      </span>
      {label}
    </button>
  );
}
