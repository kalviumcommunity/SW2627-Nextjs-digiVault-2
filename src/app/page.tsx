"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!identifier.trim() || !password) {
      setError("Enter your username or phone number and password.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier, password }) });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error?.message || "Invalid username/phone number or password.");
      await refreshUser();
      router.replace("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid username/phone number or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dl-bg">
      <PublicHeader />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-7 shadow-sm" style={{ border: "1px solid #e0daf5" }}>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dl-purple-light"><LockKeyhole size={23} className="text-dl-purple" /></div>
            <div><h1 className="text-2xl font-bold text-dl-text">Login</h1><p className="text-sm text-dl-muted">Access your secure document vault</p></div>
          </div>
          <label className="mb-1.5 block text-sm font-medium text-dl-muted" htmlFor="identifier">Phone Number or Username</label>
          <input id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" className="mb-4 w-full rounded-lg border border-dl-border bg-dl-purple-light px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-dl-purple" />
          <label className="mb-1.5 block text-sm font-medium text-dl-muted" htmlFor="password">Password</label>
          <div className="relative">
            <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" className="w-full rounded-lg border border-dl-border bg-dl-purple-light px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-dl-purple" />
            <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-dl-muted">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          <div className="mt-2 text-right"><Link href="/forgot-password" className="text-xs text-dl-purple hover:underline">Forgot Password?</Link></div>
          {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          <button disabled={loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-dl-purple py-3 text-sm font-semibold text-white hover:bg-dl-purple-dark disabled:opacity-60">{loading && <Loader2 size={16} className="animate-spin" />}Login</button>
          <p className="mt-5 text-center text-sm text-dl-muted">New to DigiVault? <Link href="/register" className="font-semibold text-dl-purple hover:underline">Create Account</Link></p>
        </form>
      </main>
    </div>
  );
}
