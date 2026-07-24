"use client";
import Input from "@/features/auth/components/input";
import { auth } from "@/lib/firebase/client";
import prisma from "@/lib/prisma";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  BookOpen,
  Building,
  CheckCircle,
  Globe,
  GraduationCap,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ro } from "zod/v4/locales";

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    institution: "",
    department: "",
    country: "Pakistan",
    agree: false,
  });

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) return;
    setStep(2);
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );

      const user = userCredential.user;

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: user.uid,
          email: user.email,
          emailVerified: user.emailVerified,
          displayName: user.displayName,
          institution: form.institution,
          department: form.department,
          country: form.country,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create user.");
      }

      router.push("/");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to sign up.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm text-foreground">PaperVault</span>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono transition-colors ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted border border-border text-muted-foreground"}`}
              >
                {step > s ? <CheckCircle className="w-3.5 h-3.5" /> : s}
              </div>
              <span
                className={`text-[11px] font-mono ${step === s ? "text-foreground" : "text-muted-foreground"}`}
              >
                {s === 1 ? "Account" : "Profile"}
              </span>
              {s < 2 && (
                <div
                  className={`flex-1 h-px w-12 ${step > s ? "bg-primary" : "bg-border"}`}
                />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <>
            <div className="mb-6">
              <h1
                className="text-3xl text-foreground mb-1"
                style={{ fontFamily: "'EB Garamond', serif" }}
              >
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Join 28,000+ students sharing knowledge.
              </p>
            </div>

            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <Input
                  icon={User}
                  placeholder="Ahmed Raza"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <Input
                  icon={Lock}
                  type="password"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={(e) =>
                    setForm({ ...form, confirm: e.target.value })
                  }
                  required
                />
                {form.confirm && form.password !== form.confirm && (
                  <p className="text-[11px] font-mono text-destructive mt-1">
                    Passwords do not match.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-6">
              <h1
                className="text-3xl text-foreground mb-1"
                style={{ fontFamily: "'EB Garamond', serif" }}
              >
                Your academic profile
              </h1>
              <p className="text-sm text-muted-foreground">
                Help others find resources relevant to your institution.
              </p>
            </div>

            <form onSubmit={handleStep2} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                  Institution
                </label>
                <Input
                  icon={Building}
                  placeholder="Punjab University / FBISE / LUMS…"
                  value={form.institution}
                  onChange={(e) =>
                    setForm({ ...form, institution: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                  Department (optional)
                </label>
                <Input
                  icon={GraduationCap}
                  placeholder="Computer Science / Pre-Medical…"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
                  Country
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <select
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/60"
                  >
                    {[
                      "Pakistan",
                      "India",
                      "Bangladesh",
                      "United Kingdom",
                      "United States",
                      "Canada",
                      "Other",
                    ].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer select-none pt-1">
                <div
                  onClick={() => setForm({ ...form, agree: !form.agree })}
                  className={`w-4 h-4 mt-0.5 shrink-0 rounded border flex items-center justify-center transition-colors ${form.agree ? "bg-primary border-primary" : "border-border"}`}
                >
                  {form.agree && (
                    <CheckCircle className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground leading-snug">
                  I agree to the{" "}
                  <span className="text-primary">Terms of Service</span> and{" "}
                  <span className="text-primary">Privacy Policy</span>
                </span>
              </label>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 bg-muted/40 border border-border text-foreground rounded-lg text-sm hover:bg-muted/60 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!form.agree || loading}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                  ) : null}
                  {loading ? "Creating account…" : "Create Account"}
                </button>
              </div>
            </form>
          </>
        )}

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] font-mono text-muted-foreground">
            or
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button className="w-full py-3 bg-muted/40 border border-border rounded-lg text-sm text-foreground hover:bg-muted/60 transition-colors flex items-center justify-center gap-2.5">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign up with Google
        </button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <button
            onClick={() => {
              router.push("/login");
            }}
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
