"use client";

import { Lock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  getRedirectResult,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";

import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { auth } from "@/lib/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "../schema/login.schema";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

import { useState } from "react";
import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState<"email" | "google" | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setLoading("email");
    signInWithEmailAndPassword(auth, data.email, data.password)
      .then((userCredential) => {
        setLoading(undefined);
        reset();
        return router.push("/");
      })
      .catch((error) => {
        setLoading(undefined);
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        switch (errorCode) {
          case "auth/invalid-credential":
            return toast.error("Invalid email or password.");
        }
        toast.error(errorCode || "Login Failed");
      });
  };

  const handelSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    setLoading("google");
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential: any = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        const user = result.user;

        setLoading(undefined);
        console.log(user);
        toast.success("login Sucesfull.");
        router.push("/");
      })
      .catch((error) => {
        setLoading(undefined);
        // Handle Errors here.

        const errorCode = error.code;
        const errorMessage = error.message;
        toast.success(errorMessage);
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label className="block text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-1.5">
            Email
          </Label>

          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type="email"
              placeholder="name@example.com"
              {...register("email")}
              className={`w-full pr-4 py-3 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors   pl-10 ${errors.email ? "border-red-500" : ""}`}
            />
          </div>

          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              type="password"
              placeholder="Enter password"
              {...register("password")}
              className={`w-full pr-4 py-3 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors   pl-10 ${errors.password ? "border-red-500" : ""}`}
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading === "email"}>
          {loading === "email" ? <Spinner /> : "Sign in"}
        </Button>
      </form>

      <button
        onClick={() => handelSignInWithGoogle()}
        className="w-full py-3 bg-muted/40 border border-border rounded-lg text-sm text-foreground hover:bg-muted/60 transition-colors flex items-center justify-center gap-2.5"
      >
        {loading == "google" ? (
          <Spinner />
        ) : (
          <>
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
            Continue with Google
          </>
        )}
      </button>
    </div>
  );
}
