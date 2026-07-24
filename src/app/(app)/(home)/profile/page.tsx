"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { fmt, RESOURCES, typeColor } from "@/lib/data";
import { auth } from "@/lib/firebase/client";
import { updateUser } from "@/services/api/profile";
import { AuthStore } from "@/store/auth.store";
import { signOut } from "firebase/auth";
import { useUpdateUser } from "@/hooks/use-updateUser";
import {
  Bookmark,
  Building,
  Camera,
  Clock,
  Download,
  Edit3,
  GraduationCap,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Upload,
  User2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const { user, userProfile, isLogedIn } = AuthStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLogedIn) {
      router.push("/login");
    }

    if (isLogedIn) {
      setProfile({
        name: user?.displayName ?? "",
        email: user?.email ?? "",
        bio: userProfile?.bio ?? "",
        institution: userProfile?.institution ?? "",
        department: userProfile?.department ?? "",
        country: userProfile?.country ?? "",
        website: "",
      });
    }
  }, [user, userProfile]);

  async function handelLogout() {
    setLoading(true);
    await signOut(auth);
    router.push("/login");
    setLoading(false);
  }

  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "uploads" | "bookmarks" | "activity"
  >("uploads");

  const [profile, setProfile] = useState({
    name: "- ",
    email: "-",
    bio: "-",
    institution: "-",
    department: "-",
    country: "-",
    website: "-",
  });

  const [draft, setDraft] = useState(profile);

  const myUploads = RESOURCES.slice(0, 5);
  const bookmarked = RESOURCES.slice(4, 8);
  // const totalDownloads = myUploads.reduce((s, r) => s + r.downloads, 0);
  // const totalLikes = myUploads.reduce((s, r) => s + r.likes, 0);

  const { mutate: updateUser, isPending } = useUpdateUser();
  function saveProfile() {
    if (!user?.uid) return;

    updateUser(
      {
        userId: user.uid,
        data: {
          email: user.email ?? "",

          displayName: draft.name,
          institution: draft.institution,
          department: draft.department,
          country: draft.country,
          bio: draft.bio,
        },
      },
      {
        onSuccess: (updatedUser) => {
          setProfile({
            name: updatedUser.displayName ?? "",
            email: updatedUser.email ?? "",
            bio: updatedUser.bio ?? "",
            institution: updatedUser.institution ?? "",
            department: updatedUser.department ?? "",
            country: updatedUser.country ?? "",
            website: "",
          });

          setEditing(false);
        },

        onError: (error) => {
          console.error(error);
        },
      },
    );
  }
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="h-28 bg-linear-to-r from-primary/10 via-primary/5 to-transparent relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(201,168,108,0.15),transparent_60%)]" />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary/40 to-primary/10 border-4 border-card flex items-center justify-center">
                <span className="text-2xl font-mono text-primary font-medium">
                  {user?.displayName ? (
                    user.displayName[0].toUpperCase()
                  ) : (
                    <User2 className="w-4 h-4" />
                  )}
                </span>
              </div>
              {editing && (
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-card">
                  <Camera className="w-3 h-3 text-primary-foreground" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 pb-1">
              {editing ? (
                <>
                  <button
                    onClick={() => {
                      setDraft(profile);
                      setEditing(false);
                    }}
                    className="px-4 py-1.5 bg-muted/40 border border-border text-sm text-muted-foreground rounded-lg hover:bg-muted/60 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    className="px-4 py-1.5 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Save changes
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setDraft(profile);
                      setEditing(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-muted/40 border border-border text-sm text-foreground rounded-lg hover:bg-muted/60 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit profile
                  </button>

                  <Button
                    variant={"link"}
                    disabled={loading}
                    onClick={() => handelLogout()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {loading ? <Spinner /> : <LogOut className="w-3.5 h-3.5" />}
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Name + meta */}
          {editing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                    Name
                  </label>
                  <input
                    value={draft.name}
                    onChange={(e) =>
                      setDraft({ ...draft, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <input
                    value={draft.email}
                    type="email"
                    onChange={(e) =>
                      setDraft({ ...draft, email: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                    Institution
                  </label>
                  <input
                    value={draft.institution}
                    onChange={(e) =>
                      setDraft({ ...draft, institution: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                    Department
                  </label>
                  <input
                    value={draft.department}
                    onChange={(e) =>
                      setDraft({ ...draft, department: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                    Country
                  </label>
                  <input
                    value={draft.country}
                    onChange={(e) =>
                      setDraft({ ...draft, country: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                    Website
                  </label>
                  <input
                    value={draft.website}
                    onChange={(e) =>
                      setDraft({ ...draft, website: e.target.value })
                    }
                    placeholder="https://"
                    className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-1">
                  Bio
                </label>
                <textarea
                  value={draft.bio}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50 resize-none"
                />
              </div>
            </div>
          ) : (
            <>
              <h2
                className="text-xl text-foreground"
                style={{ fontFamily: "'EB Garamond', serif" }}
              >
                {profile.name}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[12px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {profile.email}
                </span>
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3" />
                  {profile.institution}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" />
                  {profile.department}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {profile.country}
                </span>
              </div>
              {profile.bio && (
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed max-w-2xl">
                  {profile.bio}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: "Uploads",
            val: myUploads.length,
            icon: Upload,
            color: "text-amber-400",
          },
          {
            label: "Downloads",
            val: 0,
            icon: Download,
            color: "text-emerald-400",
          },
          {
            label: "Likes",
            val: 0,
            icon: Heart,
            color: "text-rose-400",
          },
          {
            label: "Member since",
            val: userProfile?.createdAt
              ? new Date(userProfile?.createdAt).toLocaleString("gb", {
                  month: "long",
                  year: "2-digit",
                })
              : "-",
            icon: Clock,
            color: "text-blue-400",
          },
        ].map(({ label, val, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-card border border-border rounded-lg p-4 text-center"
          >
            <Icon className={`w-4 h-4 ${color} mx-auto mb-2`} />
            <p className="text-lg font-mono text-foreground">{val}</p>
            <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div>
        <div className="flex gap-1 border-b border-border mb-5">
          {(["uploads", "bookmarks", "activity"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-mono capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "uploads" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {myUploads.map((r, i) => (
              <div
                key={r.id}
                className={`flex items-center gap-4 px-5 py-4 hover:bg-muted/10 transition-colors ${i < myUploads.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm text-foreground truncate"
                    style={{ fontFamily: "'EB Garamond', serif" }}
                  >
                    {r.title}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                    {r.institution} · {r.year} · {r.uploadDate}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 hidden sm:inline ${typeColor(r.type)}`}
                >
                  {r.type}
                </span>
                <div className="text-right shrink-0 text-[11px] font-mono text-muted-foreground space-y-0.5">
                  <p className="flex items-center gap-1 justify-end">
                    <Download className="w-3 h-3" />
                    {fmt(r.downloads)}
                  </p>
                  <p className="flex items-center gap-1 justify-end">
                    <Heart className="w-3 h-3" />
                    {fmt(r.likes)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "bookmarks" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {bookmarked.map((r) => (
              <div
                key={r.id}
                className="bg-card border border-border rounded-lg p-4 flex items-center gap-3 hover:border-primary/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm text-foreground truncate"
                    style={{ fontFamily: "'EB Garamond', serif" }}
                  >
                    {r.title}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground mt-0.5">
                    {r.institution} · {r.year}
                  </p>
                </div>
                <Bookmark className="w-4 h-4 text-primary fill-primary shrink-0" />
              </div>
            ))}
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-2">
            {[
              {
                action: "Uploaded",
                resource: "Mathematics Annual 2023",
                time: "2 days ago",
                icon: Upload,
                color: "text-amber-400",
              },
              {
                action: "Liked",
                resource: "O-Level Biology 5090/12",
                time: "3 days ago",
                icon: Heart,
                color: "text-rose-400",
              },
              {
                action: "Bookmarked",
                resource: "NTS GK MCQs 2024",
                time: "5 days ago",
                icon: Bookmark,
                color: "text-blue-400",
              },
              {
                action: "Downloaded",
                resource: "A-Level Pure Math P3",
                time: "1 week ago",
                icon: Download,
                color: "text-emerald-400",
              },
              {
                action: "Uploaded",
                resource: "Physics Notes — Mechanics",
                time: "2 weeks ago",
                icon: Upload,
                color: "text-amber-400",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3"
              >
                <div
                  className={`w-7 h-7 rounded-full bg-muted/60 flex items-center justify-center shrink-0`}
                >
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="text-muted-foreground">
                      {item.action}{" "}
                    </span>
                    <span className="truncate">{item.resource}</span>
                  </p>
                </div>
                <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
