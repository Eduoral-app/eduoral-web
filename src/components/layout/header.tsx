import { View } from "@/lib/data";
import { User } from "firebase/auth";
import { Bell, BookOpen, Grid, Home, Menu, Upload, User2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { AuthStore } from "@/store/auth.store";
import { UiStore } from "@/store/ui.store";
import Logo from "../logo";

export default function Header() {
  const { user, isLogedIn } = AuthStore();
  const { toogleSideMenu, view, setView } = UiStore();

  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (path) {
      if (path == "/") {
        setView("home");
      } else if (path.includes("browse")) {
        setView("browse");
      }
    }
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border h-14 flex items-center px-4 gap-4">
      <button
        onClick={() => toogleSideMenu()}
        className="md:hidden text-muted-foreground hover:text-foreground"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div
        className="flex items-center gap-2 shrink-0 cursor-pointer"
        onClick={() => {
          setView("home");
          router.push("/");
        }}
      >
        <Logo width={40} height={40} />
        <span className="text-sm font-mono font-medium text-foreground tracking-tight">
          Eduoral
        </span>
      </div>
      <nav className="hidden md:flex items-center gap-1 ml-4">
        {navItems(isLogedIn, user).map(({ id, icon: Icon, label, path }) => (
          <button
            key={id}
            onClick={() => {
              setView(id);
              router.push(path);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors ${view === id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </nav>
      {isLogedIn ? (
        <div className="ml-auto flex items-center gap-2">
          {/* <button className="relative text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
          </button> */}
          <button
            onClick={() => {
              setView("profile");
              router.push("/profile");
            }}
            className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-[11px] font-mono text-primary hover:border-primary/60 transition-colors"
          >
            {user?.displayName ? (
              user.displayName[0].toUpperCase()
            ) : (
              <User2 className="w-4 h-4" />
            )}
          </button>
        </div>
      ) : (
        <div className="space-x-2 ml-auto flex items-center gap-2">
          <Button
            variant={"outline"}
            onClick={() => {
              router.push("/login");
            }}
          >
            Login
          </Button>
          <Button
            onClick={() => {
              router.push("/signup");
            }}
          >
            Signup
          </Button>
        </div>
      )}
    </header>
  );
}

export let navItems = (
  isLogedIn?: boolean,
  user?: User | null,
): {
  id: View;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}[] => {
  // isLogedIn && user?.email?.endsWith("nu.edu.pk")?
  return [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "browse", icon: Grid, label: "Browse", path: "/browse" },
    { id: "upload", icon: Upload, label: "Upload", path: "/upload" },
  ];
  // : [
  //     { id: "home", icon: Home, label: "Home", path: "/" },
  //     { id: "browse", icon: Grid, label: "Browse", path: "/browse" },
  //   ];
};
