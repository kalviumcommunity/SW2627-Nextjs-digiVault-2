"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, Search, HardDrive, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { getStorageInfo } from "@/lib/api";
import { formatBytes, STORAGE_QUOTA_BYTES } from "@/lib/validation";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/documents", label: "Issued Documents", icon: FileText },
  { href: "/search", label: "Search Documents", icon: Search },
  { href: "/drive", label: "DigiVault Drive", icon: HardDrive },
  { href: "/about", label: "About DigiVault", icon: Info },
];

export default function Sidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const [storage, setStorage] = useState({ used: 0, limit: STORAGE_QUOTA_BYTES });

  useEffect(() => {
    let active = true;
    getStorageInfo().then((info) => {
      if (active) setStorage(info);
    });
    return () => {
      active = false;
    };
  }, [pathname]);

  const pct = Math.min(100, Math.round((storage.used / storage.limit) * 100));

  return (
    <aside className={`w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col ${className}`}>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-light text-brand"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="rounded-lg border border-slate-200 p-3">
          <p className="text-xs font-medium text-slate-500 mb-1.5">Storage</p>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">
            {formatBytes(storage.used)} of {formatBytes(storage.limit)} used
          </p>
        </div>
      </div>
    </aside>
  );
}
