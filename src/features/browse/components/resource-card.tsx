import { fmt, Resource, typeColor } from "@/lib/data";
import { BrowseStore } from "@/store/browse.store";
import {
  Bookmark,
  Building,
  Download,
  Eye,
  FileText,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResourceCard({ r }: { r: Resource }) {
  const router = useRouter;
  const { setResource } = BrowseStore();

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div
      id={r.id}
      onClick={() => {
        setResource(r);
      }}
      className="group bg-card border border-border rounded-lg p-5 cursor-pointer hover:border-primary/30 hover:bg-card/80 transition-all duration-200 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${typeColor(r.type)}`}
          >
            {r.type}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded">
            {r.fileType}
          </span>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground shrink-0">
          {r.year}
        </span>
      </div>

      <h3
        className="text-sm font-medium leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2"
        style={{ fontFamily: "'EB Garamond', serif" }}
      >
        {r.title}
      </h3>

      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono flex-wrap">
        <Building className="w-3 h-3 shrink-0" />
        <span>{r.institution}</span>
        {r.subject && (
          <>
            <span className="opacity-40">·</span>
            <span>{r.subject}</span>
          </>
        )}
      </div>

      {r.tags.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {r.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="text-[10px] font-mono text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-mono">
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            {fmt(r.downloads)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {fmt(r.views)}
          </span>
          {r.pages && (
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {r.pages}p
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className={`flex items-center gap-1 text-[11px] font-mono transition-colors ${liked ? "text-rose-400" : "text-muted-foreground hover:text-rose-400"}`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? "fill-rose-400" : ""}`} />
            {fmt(r.likes + (liked ? 1 : 0))}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setBookmarked(!bookmarked);
            }}
            className={`transition-colors ${bookmarked ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            <Bookmark
              className={`w-3.5 h-3.5 ${bookmarked ? "fill-primary" : ""}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
