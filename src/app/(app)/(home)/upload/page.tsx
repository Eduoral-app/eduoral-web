"use client";

import { ResourceType } from "@/generated/prisma/enums";
import { RESOURCE_TYPES, YEARS } from "@/lib/data";
import { AuthStore } from "@/store/auth.store";
import { CheckCircle, FileText, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function UploadView() {
  const { user } = AuthStore();
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const currentYear = new Date().getFullYear();
  const [yearError, setYearError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subject: "",
    institution: "",
    board: "",
    year: "2024",
    type: "PAST_PAPER",
    examType: "",
    tags: "",
    description: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f.name);
  }

  if (submitted) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h2
          className="text-2xl text-foreground mb-2"
          style={{ fontFamily: "'EB Garamond', serif" }}
        >
          Upload received
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Your resource has been submitted and will be visible shortly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFile(null);
          }}
          className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Upload another
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedFile = fileRef.current?.files?.[0];

    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {
      setUploading(true);

      const extension = selectedFile.name.split(".").pop()?.toLowerCase();

      if (!extension || !["pdf", "png", "jpg", "jpeg"].includes(extension)) {
        throw new Error("Invalid file type");
      }

      console.log({
        browserType: selectedFile.type,
        extension,
      });

      const uploaderId = user?.uid;

      const uploadUrlRes = await fetch("/api/resources/upload-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          type: form.type,
          extension,
        }),
      });

      if (!uploadUrlRes.ok) {
        throw new Error("Could not generate upload URL");
      }

      const { uploadUrl, key } = await uploadUrlRes.json();

      console.log("uploadUrl:", uploadUrl);
      console.log("key:", key);
      console.log("full:", uploadUrl, key);

      // 2. Upload file to S3
      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": selectedFile.type,
        },
        body: selectedFile,
      });

      console.log("S3 upload status:", uploadRes.status);

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        console.log("S3 error:", errorText);

        throw new Error("S3 upload failed");
      }

      // 3. Save resource in database
      const dbRes = await fetch("/api/resources", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,

          fileKey: key,

          fileType: selectedFile.type.startsWith("image/") ? "IMAGE" : "PDF",

          fileSize: Math.round(selectedFile.size / 1024),

          uploaderId,
        }),
      });

      if (!dbRes.ok) {
        const error = await dbRes.json();

        console.log("Database error:", error);

        throw new Error("Database save failed");
      }

      // Everything completed successfully
      setSubmitted(true);
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-4">
      <div className="mb-8">
        <h1
          className="text-3xl text-foreground mb-1"
          style={{ fontFamily: "'EB Garamond', serif" }}
        >
          Upload a Resource
        </h1>
        <p className="text-sm text-muted-foreground">
          Share past papers, notes, and study materials with students.
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!file) return;
          handleSubmit(e);
        }}
        className="space-y-5"
      >
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed py-12 flex flex-col items-center justify-center transition-colors ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/20"}`}
        >
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)}
          />
          {file ? (
            <>
              <FileText className="w-8 h-8 text-primary mb-2" />
              <p className="text-sm text-foreground font-mono">{file}</p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Click to change
              </p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-foreground">
                Drag & drop or click to select
              </p>
              <p className="text-[11px] font-mono text-muted-foreground mt-1">
                PDF · JPG · PNG — max 50 MB
              </p>
            </>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
              Title
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Mathematics Annual 2023 — FBISE"
              required
              className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
              Subject | Course
            </label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Mathematics"
              required
              className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
              Institution
            </label>

            <input
              list="institutions"
              value={form.institution}
              onChange={(e) =>
                setForm({ ...form, institution: e.target.value })
              }
              placeholder="Select or type an institution"
              required
              className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />

            <datalist id="institutions">
              <option value="FAST-NUCES Peshawar" />
              <option value="FAST-NUCES Islamabad" />
              <option value="FAST-NUCES Islamabad" />
              <option value="FAST-NUCES Karachi" />
              <option value="FAST-NUCES Faisalabad" />
              <option value="FAST-NUCES Lahore" />
              <option value="other" />
            </datalist>
          </div>
          <div>
            <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
              Resource Type
            </label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as ResourceType })
              }
              className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
              Year
            </label>

            <input
              type="number"
              min={2000}
              max={currentYear}
              value={form.year}
              placeholder="e.g. 2025"
              required
              onChange={(e) => {
                const value = e.target.value;

                setForm({ ...form, year: value });

                if (!value) {
                  setYearError("Year is required.");
                  return;
                }

                const year = Number(value);

                if (year < 2000 || year > currentYear) {
                  setYearError(`Year must be between 2000 and ${currentYear}.`);
                } else {
                  setYearError("");
                }
              }}
              className={`w-full px-3 py-2.5 bg-muted/50 border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none ${
                yearError
                  ? "border-red-500 focus:border-red-500"
                  : "border-border focus:border-primary/50"
              }`}
            />

            {yearError && (
              <p className="mt-1 text-xs text-red-500">{yearError}</p>
            )}
          </div>
          <div>
            <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
              Board (optional)
            </label>
            <input
              value={form.board}
              onChange={(e) => setForm({ ...form, board: e.target.value })}
              placeholder="BISE Lahore / A-Level / NTS"
              className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
              Exam Type
            </label>

            <input
              list="exam-types"
              value={form.examType}
              onChange={(e) => setForm({ ...form, examType: e.target.value })}
              placeholder="Select or type an exam type"
              className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />

            <datalist id="exam-types">
              <option value="Mid" />
              <option value="Sessional-I" />
              <option value="Sessional-II" />
              <option value="Final" />
            </datalist>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
              Tags (comma separated)
            </label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="math, fbise, 2023, federal"
              className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
              Description (optional)
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              placeholder="Brief description of this resource…"
              className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />

          {uploading ? "Uploading resource..." : "Submit Resource"}
        </button>
      </form>
    </div>
  );
}
