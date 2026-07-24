"use client";

import Header, { navItems } from "@/components/layout/header";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AuthStore } from "@/store/auth.store";
import { UiStore } from "@/store/ui.store";
import { Spinner } from "@/components/ui/spinner";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResourceDialog from "@/features/browse/dialogs/resource-dialog";
import { BrowseStore } from "@/store/browse.store";
import { Provider } from "@/lib/tanstack/provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user, setUser, setUserProfile } = AuthStore();
  const { sideMenuOpen, toogleSideMenu, view, setView } = UiStore();
  const { resource } = BrowseStore();

  async function handelLogout() {
    setLoading(true);
    await signOut(auth);
    router.push("/login");
    setLoading(false);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUser(null);
        router.replace("/login");
        return;
      }

      setUser(user);

      const res = await fetch(`/api/auth/profile?uid=${user.uid}`);

      if (res.ok) {
        const profile = await res.json();
        setUserProfile(profile);
      }
    });

    return unsubscribe;
  }, [router]);

  return (
    <>
      <Provider>
        {user ? (
          <div className="p-5">
            <Header />

            {sideMenuOpen && (
              <div className="fixed inset-0 z-40 md:hidden">
                <div
                  className="absolute inset-0 bg-black/60"
                  onClick={() => toogleSideMenu()}
                />
                <aside className="absolute left-0 top-0 bottom-0 w-56 bg-card border-r border-border flex flex-col pt-14">
                  <nav className="p-3 space-y-1">
                    {navItems().map(({ id, icon: Icon, label, path }) => (
                      <button
                        key={id}
                        onClick={() => {
                          setView(id);
                          router.push(path);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${view === id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/40"}`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                    <button
                      disabled={loading}
                      onClick={() => handelLogout()}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                    >
                      {loading ? (
                        <Spinner />
                      ) : (
                        <>
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </>
                      )}
                    </button>
                  </nav>
                </aside>
              </div>
            )}
            {children}
          </div>
        ) : (
          <div className="w-screen h-screen flex items-center justify-center">
            <DotLottieReact
              className="w-76.25 h-76.25"
              src="/lottie/cat-loading.lottie"
              loop
              autoplay
            />
          </div>
        )}

        {resource && <ResourceDialog />}
      </Provider>
    </>
  );
}
