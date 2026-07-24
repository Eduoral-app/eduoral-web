import { Button } from "@/components/ui/button";
import { fmt, Resource, typeColor } from "@/lib/data";
import { BrowseStore } from "@/store/browse.store";
import {
  Bookmark,
  Download,
  Eye,
  FileText,
  Flag,
  Heart,
  Share2,
  View,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResourceDialog() {
  const router = useRouter();
  const { resource, setResource } = BrowseStore();

  if (!resource) {
    return <div>Select a resource.</div>;
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={() => setResource(undefined)}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-card border border-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded border ${typeColor(resource.type)}`}
              >
                {resource.type}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {resource.fileType}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {resource.year}
              </span>
            </div>
            <h2
              className="text-xl leading-snug text-foreground"
              style={{ fontFamily: "'EB Garamond', serif" }}
            >
              {resource.title}
            </h2>
          </div>
          <button
            onClick={() => {
              setResource(undefined);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mx-6 mt-5 rounded-lg bg-muted/40 border border-border flex items-center justify-center h-48 relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent" />
          <div className="text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-60" />
            <p className="text-xs font-mono text-muted-foreground">
              PDF Preview
            </p>
            {resource.pages && (
              <p className="text-[10px] font-mono text-muted-foreground mt-1">
                {resource.pages} pages · {resource.fileSize}
              </p>
            )}
          </div>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">
          {[
            { label: "Institution", val: resource.institution },
            { label: "Subject", val: resource.subject },
            ...(resource.board
              ? [{ label: "Board", val: resource.board }]
              : []),
            { label: "Uploaded by", val: resource.uploader },
            { label: "Upload date", val: resource.uploadDate },
            { label: "File size", val: resource.fileSize },
          ].map(({ label, val }) => (
            <div key={label}>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
                {label}
              </p>
              <p className="text-sm text-foreground font-mono">{val}</p>
            </div>
          ))}
        </div>

        <div className="px-6 pb-4">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-2">
            Tags
          </p>
          <div className="flex flex-wrap gap-1.5">
            {resource.tags.map((t) => (
              <span
                key={t}
                className="text-[11px] font-mono text-muted-foreground bg-muted/40 border border-border px-2 py-0.5 rounded"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        <div className="px-6 pb-4 grid grid-cols-4 gap-3">
          {[
            {
              icon: Download,
              label: "Downloads",
              val: fmt(resource.downloads),
            },
            { icon: Eye, label: "Views", val: fmt(resource.views) },
            { icon: Heart, label: "Likes", val: fmt(resource.likes) },
            { icon: Bookmark, label: "Saves", val: fmt(resource.bookmarks) },
          ].map(({ icon: Icon, label, val }) => (
            <div
              key={label}
              className="text-center bg-muted/30 rounded-lg p-3 border border-border"
            >
              <Icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-base font-mono text-foreground">{val}</p>
              <p className="text-[10px] font-mono text-muted-foreground">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <Button
            onClick={() => {
              router.push(`/browse/${resource.id}`);
              setResource(undefined);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium transition-opacity hover:opacity-90"
          >
            <View className="w-4 h-4" />
            View
          </Button>
          <Button
            variant={"outline"}
            className="flex-1 flex items-center justify-center gap-2   rounded-lg py-2.5 text-sm font-medium "
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
          <button className="px-4 bg-muted/40 border border-border text-foreground rounded-lg py-2.5 text-sm transition-colors hover:bg-muted">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="px-4 bg-muted/40 border border-border text-muted-foreground rounded-lg py-2.5 text-sm transition-colors hover:text-foreground hover:bg-muted">
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
