"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";

export default function PublicHeader() {
  const router = useRouter();

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center px-4 sm:px-8">
      <Logo />
      <nav className="hidden sm:flex items-center gap-6 ml-10 text-sm font-medium text-slate-600">
        <Link
          href="/"
          className="text-slate-900 hover:text-brand transition-colors"
        >
          Home
        </Link>
        <Link
          href="/documents"
          className="hover:text-brand transition-colors"
        >
          Explore Documents
        </Link>
        <Link
          href="/about"
          className="hover:text-brand transition-colors"
        >
          About
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-3">
        <span className="hidden sm:inline text-xs text-slate-400">EN</span>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          Login / Register
        </button>
      </div>
    </header>
  );
}
