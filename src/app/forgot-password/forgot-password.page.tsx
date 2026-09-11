"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Loader2, MailQuestion } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setMessage(""); setResetToken(""); setLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ identifier }) });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error?.message || "Unable to start reset.");
      setMessage(json.data.message);
      if (json.data.resetToken) setResetToken(json.data.resetToken);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to start reset."); } finally { setLoading(false); }
  };
  return <div className="min-h-screen bg-dl-bg"><PublicHeader /><main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10"><form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-7 shadow-sm" style={{ border: "1px solid #e0daf5" }}><div className="mb-5 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dl-purple-light"><MailQuestion size={23} className="text-dl-purple" /></div><div><h1 className="text-xl font-bold text-dl-text">Forgot Password?</h1><p className="text-sm text-dl-muted">Use your email, username, or phone.</p></div></div><label className="mb-1.5 block text-sm font-medium text-dl-muted" htmlFor="identifier">Email, Username, or Phone Number</label><input id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className="w-full rounded-lg border border-dl-border bg-dl-purple-light px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-dl-purple" required />{message && <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-sm text-dl-muted">{message}</p>}{resetToken && <Link href={`/reset-password?token=${resetToken}`} className="mt-3 block text-sm font-semibold text-dl-purple hover:underline">Open reset page</Link>}<button disabled={loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-dl-purple py-3 text-sm font-semibold text-white hover:bg-dl-purple-dark disabled:opacity-60">{loading && <Loader2 size={16} className="animate-spin" />}Send Reset Link</button><p className="mt-5 text-center text-sm text-dl-muted"><Link href="/" className="font-semibold text-dl-purple hover:underline">Back to Login</Link></p></form></main></div>;
}
