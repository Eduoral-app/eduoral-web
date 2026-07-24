"use client";

import { Spinner } from "@/components/ui/spinner";
import { useGetResourcesStats } from "@/hooks/use-getResourcesStats";
import { CATEGORIES, RESOURCES } from "@/lib/data";
import { ArrowRight, Clock, Search, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    // if (q.trim()) { onSearch(q); onBrowse(); }
  }

  const { data, isError, isLoading, isRefetching } = useGetResourcesStats();

  console.log(isLoading || isRefetching || isError ? "-" : data ? data : "");

  return (
    <div className="space-y-12">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-linear-to-br from-card via-muted/20 to-card px-8 py-14 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,108,0.08),transparent_70%)]" />
        <div className="relative">
          <p className="text-[11px] font-mono tracking-[0.2em] text-primary uppercase mb-4">
            Past Papers Repository
          </p>
          <h1
            className="text-4xl md:text-5xl text-foreground mb-3 leading-tight"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            Every paper.
            <br className="hidden md:block" /> Every board. Every year.
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8">
            A curated archive of past papers, notes, and resources for students
            across Pakistan and beyond.
          </p>
          <form onSubmit={handleSearch} className="flex max-w-xl mx-auto gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by subject, board, institution…"
                className="w-full pl-10 pr-4 py-3 bg-muted/60 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 font-light"
              />
            </div>
            <button
              type="submit"
              className="px-5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border">
        {[
          {
            label: "Resources",
            val:
              isLoading || isRefetching || isError ? "-" : data.stats.resources,
          },
          {
            label: "Downloads",
            val:
              isLoading || isRefetching || isError ? "-" : data.stats.downloads,
          },
          {
            label: "Institutions",
            val:
              isLoading || isRefetching || isError
                ? "-"
                : data.stats.institutions,
          },
          {
            label: "Students",
            val:
              isLoading || isRefetching || isError ? "-" : data.stats.students,
          },
        ].map(({ label, val }) => (
          <div key={label} className="bg-card py-5 px-6 text-center">
            <p className="text-2xl font-mono text-primary">{val}</p>
            <p className="text-[11px] font-mono text-muted-foreground mt-0.5 uppercase tracking-wider">
              {label}
            </p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-lg text-foreground"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            Browse by Type
          </h2>
          <button
            onClick={() => {
              router.push("/browse");
            }}
            className="text-[11px] font-mono text-primary hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(isLoading || isRefetching || isError
            ? [
                {
                  type: "PAST_PAPER",
                  title: "Past Papers",
                  icon: "📄",
                  count: "-",
                },
                {
                  type: "NOTES",
                  title: "Notes",
                  icon: "📝",
                  count: "-",
                },
                {
                  type: "BOOK",
                  title: "Books",
                  icon: "📚",
                  count: "-",
                },
                {
                  type: "MCQS",
                  title: "MCQs",
                  icon: "✏️",
                  count: "-",
                },
                {
                  type: "SLIDES",
                  title: "Slides",
                  icon: "🖼️",
                  count: "-",
                },
                {
                  type: "LAB_MANUAL",
                  title: "Lab Manuals",
                  icon: "🔬",
                  count: "-",
                },
                {
                  type: "GUESS_PAPER",
                  title: "Guess Papers",
                  icon: "🎯",
                  count: "-",
                },
                {
                  type: "JOB_TEST",
                  title: "Job Tests",
                  icon: "💼",
                  count: 0,
                },
              ]
            : data.resourceTypes
          ).map((cat: any) => (
            <button
              key={cat.title}
              onClick={() => {
                router.push("/browse");
              }}
              className="group bg-card border border-border rounded-lg p-4 text-left hover:border-primary/30 transition-all"
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <p className="text-sm text-foreground font-medium group-hover:text-primary transition-colors">
                {cat.title}
              </p>
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                {cat.count.toLocaleString()} files
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* <div>
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2
            className="text-lg text-foreground"
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            Trending This Week
          </h2>
        </div> */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> */}
      {/* {trending.map(r => <ResourceCard key={r.id} r={r} onClick={() => onOpenResource(r)} />)} */}
      {/* </div> */}
      {/* </div> */}

      <div>
        {/* <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <h2
              className="text-lg text-foreground"
              style={{ fontFamily: "'EB Garamond', serif" }}
            >
              Recently Added
            </h2>
          </div>
          <button
            onClick={() => {}}
            className="text-[11px] font-mono text-primary hover:underline flex items-center gap-1"
          >
            Browse all <ArrowRight className="w-3 h-3" />
          </button>
        </div> */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">  */}
        {/* {recent.map(r => <ResourceCard key={r.id} r={r} onClick={() => onOpenResource(r)} />)} */}
        {/* </div>   */}
      </div>
    </div>
  );
}
