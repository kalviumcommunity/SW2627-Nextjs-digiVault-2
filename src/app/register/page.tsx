"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Check, Eye, EyeOff, Loader2, UserPlus, X } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";
import { isStrongPassword } from "@/lib/auth-validation";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", dateOfBirth: "", email: "", phoneNumber: "", username: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const update = (field: keyof typeof form, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const strength = form.password.length === 0 ? "" : isStrongPassword(form.password) ? "Strong password" : "Use 8+ characters with letters, numbers, and a special character.";

  useEffect(() => {
    const username = form.username.trim();
    if (!/^[A-Za-z0-9_]{3,30}$/.test(username)) {
      return;
    }
    const timer = window.setTimeout(async () => {
      setUsernameStatus("checking");
      try {
        const response = await fetch(`/api/auth/username?username=${encodeURIComponent(username)}`);
        const json = await response.json();
        setUsernameStatus(json.success && json.data?.available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [form.username]);

  const validUsername = /^[A-Za-z0-9_]{3,30}$/.test(form.username.trim());
  const visibleUsernameStatus = validUsername ? usernameStatus : "idle";

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    if (usernameStatus === "taken") return setError("Username is already taken.");
    if (!isStrongPassword(form.password)) return setError("Password does not meet the required security rules.");
    if (!agreed) return setError("Please agree to the Terms and Conditions.");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error?.message || "Unable to create account.");
      router.replace("/?registered=1");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to create account."); } finally { setLoading(false); }
  };

  const field = (key: keyof typeof form, label: string, type = "text", extra = "") => (
    <div className={extra}>
      <label className="mb-1.5 block text-sm font-medium text-dl-muted" htmlFor={key}>{label}</label>
      <input id={key} type={type} value={form[key]} onChange={(e) => update(key, e.target.value)} max={type === "date" ? new Date().toISOString().slice(0, 10) : undefined} autoComplete={key === "password" ? "new-password" : undefined} className="w-full rounded-lg border border-dl-border bg-dl-purple-light px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-dl-purple" required />
    </div>
  );

  return (
    <div className="min-h-screen bg-dl-bg"><PublicHeader /><main className="px-4 py-8"><form onSubmit={submit} className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-sm sm:p-8" style={{ border: "1px solid #e0daf5" }}>
      <div className="mb-7 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-dl-purple-light"><UserPlus size={23} className="text-dl-purple" /></div><div><h1 className="text-2xl font-bold text-dl-text">Create Account</h1><p className="text-sm text-dl-muted">Use your legal details to set up your DigiVault account.</p></div></div>
      <h2 className="mb-4 border-b border-slate-100 pb-2 text-sm font-bold uppercase tracking-wide text-dl-purple">Personal Information</h2>
      <div className="grid gap-4 sm:grid-cols-2">{field("fullName", "Full Name (as per Government ID)", "text", "sm:col-span-2")}{field("dateOfBirth", "Date of Birth", "date")}{field("email", "Email Address", "email")}<div><label className="mb-1.5 block text-sm font-medium text-dl-muted" htmlFor="phoneNumber">Phone Number</label><input id="phoneNumber" type="tel" inputMode="numeric" maxLength={10} value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value.replace(/\D/g, ""))} className="w-full rounded-lg border border-dl-border bg-dl-purple-light px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-dl-purple" required /></div></div>
      <h2 className="mb-4 mt-8 border-b border-slate-100 pb-2 text-sm font-bold uppercase tracking-wide text-dl-purple">Account Information</h2>
      <div className="space-y-4"><div><label className="mb-1.5 block text-sm font-medium text-dl-muted" htmlFor="username">Create Username</label><div className="relative"><input id="username" value={form.username} onChange={(e) => update("username", e.target.value.replace(/\s/g, ""))} autoComplete="username" className="w-full rounded-lg border border-dl-border bg-dl-purple-light px-4 py-3 pr-11 text-sm outline-none focus:ring-2 focus:ring-dl-purple" required />{visibleUsernameStatus === "available" && <Check size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600" />}{visibleUsernameStatus === "taken" && <X size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-600" />}</div>{visibleUsernameStatus === "available" && <p className="mt-1 text-xs text-emerald-600">Username available</p>}{visibleUsernameStatus === "taken" && <p className="mt-1 text-xs text-red-600">Username already exists. Please choose another username.</p>}</div>
        <div><label className="mb-1.5 block text-sm font-medium text-dl-muted" htmlFor="password">Create Password</label><div className="relative"><input id="password" type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} autoComplete="new-password" className="w-full rounded-lg border border-dl-border bg-dl-purple-light px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-dl-purple" required /><button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label="Show or hide password" className="absolute right-3 top-1/2 -translate-y-1/2 text-dl-muted">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>{strength && <p className={`mt-1 text-xs ${isStrongPassword(form.password) ? "text-emerald-600" : "text-amber-600"}`}>{strength}</p>}</div>
        <div><label className="mb-1.5 block text-sm font-medium text-dl-muted" htmlFor="confirmPassword">Confirm Password</label><div className="relative"><input id="confirmPassword" type={showConfirm ? "text" : "password"} value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} autoComplete="new-password" className="w-full rounded-lg border border-dl-border bg-dl-purple-light px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-dl-purple" required /><button type="button" onClick={() => setShowConfirm((visible) => !visible)} aria-label="Show or hide confirmation password" className="absolute right-3 top-1/2 -translate-y-1/2 text-dl-muted">{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
      </div>
      <label className="mt-6 flex items-start gap-2 text-sm text-dl-muted"><input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1" />I agree to the Terms and Conditions</label>
      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button disabled={loading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-dl-purple py-3 text-sm font-semibold text-white hover:bg-dl-purple-dark disabled:opacity-60">{loading && <Loader2 size={16} className="animate-spin" />}Create Account</button>
      <p className="mt-5 text-center text-sm text-dl-muted">Already have an account? <Link href="/" className="font-semibold text-dl-purple hover:underline">Login</Link></p>
    </form></main></div>
  );
}
