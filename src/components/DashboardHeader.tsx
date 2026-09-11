"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, Bell, Globe, LogOut, ChevronRight, UserRound, UsersRound, RefreshCw, Shuffle, X, BadgeCheck, CalendarDays, Phone, Mail, UserRoundCheck } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "@/lib/AuthContext";
import { useTextSize } from "@/lib/useTextSize";

export default function DashboardHeader({
  onSearch,
}: {
  onSearch?: (query: string) => void;
}) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { size, setSize } = useTextSize();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const initials = (user?.name ?? "U").slice(0, 2).toUpperCase();
  const profile = user as (typeof user & {
    email?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    verified?: boolean;
  });

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const profileMenu = (
    <div className="absolute right-0 mt-2 w-68 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden">
      <div className="px-5 pt-4 pb-3 text-center">
        <span className="mx-auto w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold text-white"
          style={{ background: "var(--dl-purple)" }}>
          {initials}
        </span>
        <p className="mt-2 text-sm font-bold text-slate-900 truncate">{user?.name}</p>
        <button
          onClick={() => setMenuOpen(false)}
          className="mt-3 rounded-full border border-slate-300 px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Manage your Account Settings
        </button>
      </div>
      <div className="border-t border-slate-200">
        {[
          { label: "My Profile", icon: UserRound, action: () => setProfileOpen(true) },
          { label: "Nominee", icon: UsersRound },
          { label: "Activities", icon: RefreshCw },
          { label: "Switch Account", icon: Shuffle },
        ].map(({ label, icon: Icon, action }) => (
          <button
            key={label}
            onClick={() => { setMenuOpen(false); action?.(); }}
            className="w-full flex items-center gap-4 px-5 py-3 text-left text-sm text-slate-700 border-b border-slate-200 hover:bg-slate-50"
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </div>
      <div className="flex justify-center px-5 py-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          <LogOut size={16} /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4" onClick={() => setProfileOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-title"
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => setProfileOpen(false)}
              aria-label="Close profile"
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={18} />
            </button>
            <div className="bg-dl-purple-light px-6 pb-6 pt-7 text-center">
              <div className="relative mx-auto w-fit">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-dl-purple text-2xl font-semibold text-white shadow-md">
                  {initials}
                </div>
                <BadgeCheck className="absolute -bottom-1 -right-1 rounded-full bg-white text-emerald-600" size={25} />
              </div>
              <h2 id="profile-title" className="mt-3 text-lg font-bold text-slate-900">{user?.name || "DigiVault User"}</h2>
              <p className="mt-1 flex items-center justify-center gap-1 text-xs font-medium text-emerald-700">
                <UserRoundCheck size={14} /> Verified profile
              </p>
            </div>
            <div className="grid grid-cols-1 gap-px bg-slate-200 sm:grid-cols-2">
              {[
                { label: "Name", value: user?.name || "Not added", icon: UserRound },
                { label: "Date of birth", value: profile?.dateOfBirth || "Not added", icon: CalendarDays },
                { label: "Gender", value: profile?.gender || "Not added", icon: UserRoundCheck },
                { label: "Phone number", value: user?.mobileNumber ? `+91 ${user.mobileNumber}` : "Not added", icon: Phone },
                ...(profile?.email ? [{ label: "Email", value: profile.email, icon: Mail }] : []),
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white px-5 py-3">
                  <p className="flex items-center gap-2 text-xs text-slate-400"><Icon size={14} />{label}</p>
                  <p className="mt-1 truncate text-sm font-medium text-slate-800">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end px-5 py-4">
              <button onClick={() => setProfileOpen(false)} className="rounded-lg bg-dl-purple px-4 py-2 text-sm font-medium text-white hover:bg-dl-purple-dark">
                Done
              </button>
            </div>
          </section>
        </div>
      )}
      {/* ── DigiLocker-style top bar ── */}
      <div
        className="h-8 flex items-center px-4 sm:px-8 text-xs text-white gap-4"
        style={{ background: "#1a237e" }}
      >
        <span className="flex items-center gap-1.5 font-medium">
          🇮🇳 Government of India
        </span>
        <span className="ml-auto hidden sm:flex items-center gap-6">
          <button className="hover:underline">Skip to main content</button>
          <span className="flex items-center gap-1">
            <button
              onClick={() => setSize("lg")}
              className="px-1 font-bold text-sm hover:underline"
              aria-label="Increase text size"
            >
              A+
            </button>
            <button
              onClick={() => setSize("md")}
              className="px-1 hover:underline"
              aria-label="Normal text size"
            >
              A
            </button>
            <button
              onClick={() => setSize("sm")}
              className="px-1 text-xs hover:underline"
              aria-label="Decrease text size"
            >
              A-
            </button>
          </span>
          <button className="flex items-center gap-1 hover:underline">
            <Globe size={12} /> English
            <ChevronRight size={10} className="-rotate-90" />
          </button>
        </span>
      </div>

      {/* ── Main header ── */}
      <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center gap-4 px-4 sm:px-8">
        <div className="shrink-0">
          <Logo size="sm" />
        </div>

        {/* Desktop nav buttons (DigiLocker style) */}
        <div className="hidden md:flex items-center gap-2 ml-auto">
          <button
            className="px-4 py-1.5 rounded-full text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            onClick={() => router.push("/about")}
          >
            Explore DigiVault
          </button>
          <button
            className="px-4 py-1.5 rounded-full text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Become a Partner
          </button>

          {/* Text size */}
          <div className="flex items-center rounded-md border border-slate-200 overflow-hidden text-xs font-medium text-slate-500 ml-2">
            {(["sm", "md", "lg"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                aria-label={`Set text size ${s}`}
                className={`px-2 py-1.5 ${size === s ? "bg-brand-light text-brand" : "hover:bg-slate-50"}`}
              >
                {s === "sm" ? "A-" : s === "md" ? "A" : "A+"}
              </button>
            ))}
          </div>

          <button className="p-2 rounded-md text-slate-500 hover:bg-slate-50 relative" aria-label="Notifications">
            <Bell size={18} />
          </button>

          {/* User avatar + dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold text-white transition-colors"
              style={{ background: "var(--dl-purple)" }}
            >
              <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold" style={{ color: "var(--dl-purple)" }}>
                {initials}
              </span>
              {user?.name?.split(" ")[0]}
            </button>
            {menuOpen && <><div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />{profileMenu}</>}
          </div>
        </div>

        {/* Mobile: just bell + avatar */}
        <div className="md:hidden ml-auto flex items-center gap-2">
          {onSearch && (
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-36 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm placeholder:text-slate-400 focus:bg-white outline-none"
              />
            </div>
          )}
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 rounded-full text-white text-xs font-semibold flex items-center justify-center"
              style={{ background: "var(--dl-purple)" }}
            >
              {initials}
            </button>
            {menuOpen && <><div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />{profileMenu}</>}
          </div>
        </div>
      </header>
    </>
  );
}
