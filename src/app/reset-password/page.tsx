"use client";

import { FormEvent, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";

export default function ResetPasswordPage() {
  return <Suspense fallback={<div className="min-h-screen bg-dl-bg" />}><ResetPasswordForm /></Suspense>;
}

function ResetPasswordForm() {
  const params = useSearchParams(); const router = useRouter();
  const token = params.get("token") || "";
  const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [show, setShow] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent) => { event.preventDefault(); setError(""); if (password !== confirm) return setError("Passwords do not match."); setLoading(true); try { const response = await fetch("/api/auth/reset-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, password }) }); const json = await response.json(); if (!response.ok || !json.success) throw new Error(json.error?.message || "Unable to reset password."); router.replace("/"); } catch (err) { setError(err instanceof Error ? err.message : "Unable to reset password."); } finally { setLoading(false); } };
  return <div className="min-h-screen bg-dl-bg"><PublicHeader /><main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10"><form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-7 shadow-sm" style={{ border: "1px solid #e0daf5" }}><div className="mb-5 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dl-purple-light"><ShieldCheck size={23} className="text-dl-purple" /></div><div><h1 className="text-xl font-bold text-dl-text">Create New Password</h1><p className="text-sm text-dl-muted">Reset links expire after 15 minutes.</p></div></div><label className="mb-1.5 block text-sm font-medium text-dl-muted" htmlFor="password">New Password</label><div className="relative"><input id="password" type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-dl-border bg-dl-purple-light px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-dl-purple" required /><button type="button" onClick={() => setShow((visible) => !visible)} aria-label="Show or hide password" className="absolute right-3 top-1/2 -translate-y-1/2 text-dl-muted">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div><label className="mb-1.5 mt-4 block text-sm font-medium text-dl-muted" htmlFor="confirm">Confirm New Password</label><input id="confirm" type={show ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full rounded-lg border border-dl-border bg-dl-purple-light px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-dl-purple" required />{error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}<button disabled={loading || !token} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-dl-purple py-3 text-sm font-semibold text-white hover:bg-dl-purple-dark disabled:opacity-60">{loading && <Loader2 size={16} className="animate-spin" />}Reset Password</button><p className="mt-5 text-center text-sm text-dl-muted"><Link href="/" className="font-semibold text-dl-purple hover:underline">Back to Login</Link></p></form></main></div>;
}
