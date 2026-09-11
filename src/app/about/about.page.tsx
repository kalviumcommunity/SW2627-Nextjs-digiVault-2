"use client";

import Link from "next/link";
import {
  ShieldCheck, FolderOpen, Share2, Download, Smartphone, Lock,
  FileText, Users, Star, ChevronDown, ChevronUp,
} from "lucide-react";
import { useState } from "react";
import Logo from "@/components/Logo";

// ── Public header (no login button — already on home) ─────────────────────────
function PublicNav() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center px-4 sm:px-10 sticky top-0 z-20">
      <Link href="/">
        <Logo />
      </Link>
      <nav className="hidden sm:flex items-center gap-7 ml-10 text-sm font-medium">
        <Link href="/" className="text-slate-500 hover:text-slate-900 transition-colors">Home</Link>
        <Link href="/documents" className="text-slate-500 hover:text-slate-900 transition-colors">Explore Documents</Link>
        <span className="text-slate-900 font-semibold" style={{ borderBottom: "2px solid var(--dl-purple)", paddingBottom: 2 }}>About</span>
      </nav>
      <div className="ml-auto">
        <Link href="/"
          className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors"
          style={{ background: "var(--dl-purple)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--dl-purple-dark)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--dl-purple)")}>
          Login / Register
        </Link>
      </div>
    </header>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-6 rounded-2xl bg-white shadow-sm" style={{ border: "1px solid #e0daf5" }}>
      <p className="text-3xl font-extrabold mb-1" style={{ color: "var(--dl-purple)" }}>{value}</p>
      <p className="text-sm" style={{ color: "var(--dl-muted)" }}>{label}</p>
    </div>
  );
}

// ── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-4 p-5 rounded-2xl bg-white shadow-sm" style={{ border: "1px solid #e0daf5" }}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--dl-purple-light)" }}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--dl-text)" }}>{title}</h3>
        <p className="text-xs leading-relaxed" style={{ color: "var(--dl-muted)" }}>{desc}</p>
      </div>
    </div>
  );
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "#e8e3f5" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left text-sm font-medium transition-colors"
        style={{ color: open ? "var(--dl-purple)" : "var(--dl-text)" }}
      >
        {q}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed" style={{ color: "var(--dl-muted)" }}>{a}</p>
      )}
    </div>
  );
}

// ── Step card for "How it works" ──────────────────────────────────────────────
function StepCard({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mb-4"
        style={{ background: "var(--dl-purple)" }}>
        {num}
      </div>
      <h3 className="font-semibold text-sm mb-2" style={{ color: "var(--dl-text)" }}>{title}</h3>
      <p className="text-xs leading-relaxed" style={{ color: "var(--dl-muted)" }}>{desc}</p>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const iconProps = { size: 20, style: { color: "var(--dl-purple)" } };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--dl-bg)" }}>
      <PublicNav />

      {/* ── Hero ── */}
      <section className="py-16 px-4 text-center" style={{ background: "var(--dl-bg)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-5"
            style={{ background: "var(--dl-purple-light)", color: "var(--dl-purple)", border: "1px solid var(--dl-border)" }}>
            <ShieldCheck size={13} /> Document Wallet to Empower Citizens
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight" style={{ color: "var(--dl-text)" }}>
            About <span style={{ color: "var(--dl-purple)" }}>DigiVault</span>
          </h1>
          <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: "var(--dl-muted)" }}>
            DigiVault is a secure, cloud-based digital document wallet that lets you store, manage, and share important personal documents — anytime, anywhere, safely.
          </p>
          <div className="flex items-center justify-center gap-4 mt-7 flex-wrap">
            <Link href="/"
              className="px-6 py-3 rounded-lg text-white text-sm font-semibold transition-all shadow"
              style={{ background: "var(--dl-purple)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--dl-purple-dark)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--dl-purple)")}>
              Get Started — It&apos;s Free
            </Link>
            <Link href="/documents"
              className="px-6 py-3 rounded-lg text-sm font-semibold transition-all"
              style={{ background: "white", color: "var(--dl-purple)", border: "1.5px solid var(--dl-border)" }}>
              Explore Documents
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard value="1 GB" label="Free storage per account" />
          <StatCard value="10+" label="Supported file types" />
          <StatCard value="100%" label="Private by default" />
          <StatCard value="24/7" label="Secure cloud access" />
        </div>
      </section>

      {/* ── About content ── */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-sm" style={{ border: "1px solid #e0daf5" }}>
          <h2 className="text-xl font-bold mb-3" style={{ color: "var(--dl-text)" }}>What is DigiVault?</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--dl-muted)" }}>
            DigiVault is a personal document management system designed to give every individual a secure, organised place for their important files — identity proofs, educational certificates, health records, financial documents, and more.
          </p>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--dl-muted)" }}>
            With DigiVault, you no longer need to carry physical documents. Simply upload once and access your vault from any device using your mobile number and OTP authentication — no passwords required.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--dl-muted)" }}>
            You can also generate secure, time-limited share links to let others view specific documents without giving full account access. Links auto-expire and can be revoked instantly.
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: "var(--dl-text)" }}>Key Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <FeatureCard icon={<FolderOpen {...iconProps} />} title="Organised Document Vault"
              desc="Categorise documents as Identity, Education, Health, Finance, Transport and more. Find anything in seconds." />
            <FeatureCard icon={<ShieldCheck {...iconProps} />} title="Passwordless Login"
              desc="Sign in with just your mobile number and a one-time password. No memorising passwords." />
            <FeatureCard icon={<Share2 {...iconProps} />} title="Expiring Share Links"
              desc="Share documents securely using links that automatically expire after 1, 7, or 30 days. Revoke anytime." />
            <FeatureCard icon={<Download {...iconProps} />} title="Easy Downloads"
              desc="Download any document instantly. Download counts are tracked automatically so you always know who accessed what." />
            <FeatureCard icon={<Smartphone {...iconProps} />} title="Access Anywhere"
              desc="Fully responsive — works on mobile, tablet, and desktop. Your vault is always a tap away." />
            <FeatureCard icon={<Lock {...iconProps} />} title="Private by Default"
              desc="Every document is visible only to you. Sharing is opt-in and fully under your control." />
            <FeatureCard icon={<FileText {...iconProps} />} title="Multiple File Types"
              desc="Upload PDFs, images (JPG, PNG), Word, Excel, PowerPoint, and text files — up to 10 MB each." />
            <FeatureCard icon={<Users {...iconProps} />} title="1 GB Free for Everyone"
              desc="Every account comes with 1 GB of free cloud storage. Storage usage is shown in real time." />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-sm" style={{ border: "1px solid #e0daf5" }}>
          <h2 className="text-xl font-bold mb-8 text-center" style={{ color: "var(--dl-text)" }}>How DigiVault Works</h2>
          <div className="grid sm:grid-cols-4 gap-2 divide-x divide-[#e8e3f5]">
            <StepCard num={1} title="Register with Mobile" desc="Enter your 10-digit mobile number to create or access your account." />
            <StepCard num={2} title="Verify with OTP" desc="Enter the 6-digit OTP sent to your mobile. No password needed." />
            <StepCard num={3} title="Upload Documents" desc="Choose a file and category. DigiVault validates and stores it securely." />
            <StepCard num={4} title="Access & Share" desc="View, download, or share documents with expiring links anytime." />
          </div>
        </div>
      </section>

      {/* ── Testimonial / highlight ── */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto rounded-2xl p-8 text-center"
          style={{ background: "var(--dl-purple)", color: "white" }}>
          <Star size={28} className="mx-auto mb-3 opacity-80" />
          <blockquote className="text-base font-medium leading-relaxed max-w-xl mx-auto mb-4">
            &ldquo;DigiVault makes managing important documents effortless. I can share my certificates with anyone in seconds using a secure link — and revoke access just as fast.&rdquo;
          </blockquote>
          <p className="text-sm opacity-75">— DigiVault User</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-6 text-center" style={{ color: "var(--dl-text)" }}>Frequently Asked Questions</h2>
          <div className="bg-white rounded-2xl px-6 shadow-sm" style={{ border: "1px solid #e0daf5" }}>
            {[
              { q: "How much storage do I get?", a: "Every DigiVault account includes 1 GB of free cloud storage. Your current usage is always displayed on your dashboard." },
              { q: "What file types can I upload?", a: "DigiVault supports PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, PPT, PPTX, and TXT files. Each file must be 10 MB or smaller." },
              { q: "How do share links work?", a: "When you create a share link, you choose an expiry period (1 day, 7 days, or 30 days). Anyone with the link can view the document until it expires. You can revoke a link at any time from your vault." },
              { q: "Is my data safe?", a: "Yes. All documents are stored securely. Your files are private by default and only accessible to you unless you explicitly share a link. We never expose your files publicly." },
              { q: "Do I need to remember a password?", a: "No. DigiVault uses passwordless login — just your mobile number and a one-time password (OTP). You can also log in using Aadhaar or Virtual ID." },
              { q: "Can I delete documents?", a: "Yes. You can delete any document from your vault at any time. Deleted documents are permanently removed and the storage is freed immediately." },
              { q: "How do I contact support?", a: "Reach us at support@digivault.in. We typically respond within one business day." },
            ].map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold mb-3" style={{ color: "var(--dl-text)" }}>Ready to secure your documents?</h2>
          <p className="text-sm mb-6" style={{ color: "var(--dl-muted)" }}>
            Join thousands of users who trust DigiVault to keep their important files safe and accessible.
          </p>
          <Link href="/"
            className="inline-block px-8 py-3.5 rounded-lg text-white text-sm font-semibold shadow transition-all"
            style={{ background: "var(--dl-purple)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--dl-purple-dark)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.background = "var(--dl-purple)")}>
            Create Free Account
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-navy text-slate-300 px-4 sm:px-8 py-8 mt-auto">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
          <div className="col-span-2">
            <Logo size="sm" />
            <p className="text-xs text-slate-400 mt-2 max-w-xs">
              A secure cloud-based platform for storing, organizing, and sharing your important documents.
            </p>
          </div>
          <div>
            <p className="font-semibold text-white mb-2 text-xs tracking-wide">PLATFORM</p>
            <ul className="space-y-1.5 text-xs">
              <li><Link href="/" className="text-slate-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/about" className="text-slate-400 hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-white mb-2 text-xs tracking-wide">LEGAL</p>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Terms and Conditions</li>
              <li>Privacy Policy</li>
              <li>Security Policy</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-[11px] text-slate-500 mt-6">© 2026 DigiVault. All rights reserved.</p>
      </footer>
    </div>
  );
}
