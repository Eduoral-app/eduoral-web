"use client";
import Logo from "@/components/logo";
import { LoginForm } from "@/features/auth/forms/signin.form";
import { APP_NAME } from "@/lib/env";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(201,168,108,0.07),transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center gap-2.5 mb-16">
            <Logo />
            <span className="font-mono text-base text-foreground tracking-tight">
              {APP_NAME}
            </span>
          </div>
          <blockquote className="space-y-4">
            <p
              className="text-3xl text-foreground leading-snug"
              style={{ fontFamily: "'EB Garamond', serif" }}
            >
              "Every exam passed starts with a paper studied."
            </p>
            <p className="text-sm text-muted-foreground font-mono">
              — A student who prepared
            </p>
          </blockquote>
        </div>

        {/* Floating resource cards */}
        <div className="relative space-y-3">
          {[
            {
              type: "Past Paper",
              title: "Mathematics Annual 2023",
              inst: "FBISE",
              dl: "4.8k",
            },
            {
              type: "Notes",
              title: "Physics — Mechanics & Waves",
              inst: "Punjab University",
              dl: "3.2k",
            },
            {
              type: "MCQs",
              title: "NTS GK Complete 2024",
              inst: "NTS",
              dl: "8.9k",
            },
          ].map((c, i) => (
            <div
              key={i}
              className={`bg-background/60 border border-border rounded-lg px-4 py-3 flex items-center gap-3 transition-all ${i === 1 ? "translate-x-4" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground truncate">{c.title}</p>
                <p className="text-[10px] font-mono text-muted-foreground">
                  {c.inst}
                </p>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border  `}
              >
                {c.type}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                <Download className="w-2.5 h-2.5" />
                {c.dl}
              </span>
            </div>
          ))}
        </div>

        <p className="relative text-[11px] font-mono text-muted-foreground">
          4,310 resources · 28k students · 182k downloads
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Logo />
            <span className="font-mono text-sm text-foreground">
              {APP_NAME}
            </span>
          </div>

          <div className="mb-8">
            <h1
              className="text-3xl text-foreground mb-1"
              style={{ fontFamily: "'EB Garamond', serif" }}
            >
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access your resources and uploads.
            </p>
          </div>

          <LoginForm />

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[11px] font-mono text-muted-foreground">
              or
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {"Don't have an account? "}
            <button
              onClick={() => {
                router.push("/signup");
              }}
              className="text-primary hover:underline font-medium"
            >
              Sign up free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
