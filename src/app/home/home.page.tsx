"use client";

import { useEffect, useState, useCallback } from "react";
import { FileText, HardDrive, Link2, Download as DownloadIcon, Plus, Loader2 } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import DocumentCard from "@/components/DocumentCard";
import UploadModal from "@/components/UploadModal";
import EmptyState from "@/components/EmptyState";
import { useAuth } from "@/lib/AuthContext";
import { useDocumentActions } from "@/lib/useDocumentActions";
import { getDashboardSummary, listDocuments } from "@/lib/api";
import { DashboardSummary, DigiDocument, DocumentCategory } from "@/lib/types";
import { formatBytes } from "@/lib/validation";
import Link from "next/link";

const SUGGESTED: { name: string; category: DocumentCategory }[] = [
  { name: "COVID-19 Vaccination Certificate", category: "Health & Wellness" },
  { name: "Driving Licence", category: "Transport" },
  { name: "Vehicle Registration Certificate", category: "Transport" },
  { name: "Ration Card", category: "Government Documents" },
  { name: "Aadhaar Card", category: "Identity Documents" },
  { name: "PAN Card", category: "Identity Documents" },
  { name: "SSLC Marksheet", category: "Education & Learning" },
  { name: "Caste Certificate", category: "Government Documents" },
  { name: "Birth Certificate", category: "Government Documents" },
  { name: "Résumé", category: "Education & Learning" },
  { name: "HSC Marksheet", category: "Education & Learning" },
];

export default function HomePage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recent, setRecent] = useState<DigiDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, docs] = await Promise.all([
        getDashboardSummary(),
        listDocuments({ limit: 4, sort: "newest" }),
      ]);
      setSummary(s);
      setRecent(docs.items);
    } catch {
      setError("Couldn't load your dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch on mount
    load();
  }, [load]);

  const { actions, modals } = useDocumentActions((id) => {
    setRecent((prev) => prev.filter((d) => d.id !== id));
    load();
  });

  const cards = [
    { label: "Total Documents", value: summary?.totalDocuments ?? 0, icon: FileText, color: "text-blue-500" },
    { label: "Storage Used", value: formatBytes(summary?.storageUsed ?? 0), icon: HardDrive, color: "text-slate-400" },
    { label: "Share Links", value: summary?.shareLinks ?? 0, icon: Link2, color: "text-emerald-500" },
    { label: "Downloads", value: summary?.downloads ?? 0, icon: DownloadIcon, color: "text-indigo-500" },
  ];

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-xl font-semibold text-slate-900">Welcome, {user?.name}! 👋</h1>
        <p className="text-sm text-slate-400 mt-0.5">Here&apos;s an overview of your document vault.</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
            {error}
            <button onClick={load} className="font-medium underline">Retry</button>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          {cards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl p-4">
              <Icon size={20} className={color} />
              <p className="text-xl font-semibold text-slate-900 mt-2">
                {loading ? <Loader2 size={18} className="animate-spin text-slate-300" /> : value}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8 mb-3">
          <h2 className="text-base font-semibold text-slate-800">Your Issued Documents</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-medium hover:bg-brand-dark"
            >
              <Plus size={14} /> Upload
            </button>
            <Link
              href="/documents"
              className="flex items-center px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50"
            >
              View All
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-white border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <EmptyState
            action={
              <button
                onClick={() => setUploadOpen(true)}
                className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-dark"
              >
                Upload Document
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recent.map((doc) => (
              <DocumentCard key={doc.id} document={doc} {...actions} />
            ))}
          </div>
        )}

        <h2 className="text-base font-semibold text-slate-800 mt-8 mb-3">Documents You Might Need</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {SUGGESTED.map((item) => (
            <button
              key={item.name}
              onClick={() => setUploadOpen(true)}
              className="flex flex-col items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl p-3 text-center hover:border-brand/50 hover:shadow-sm transition-all"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-light flex items-center justify-center text-brand">
                <FileText size={16} />
              </div>
              <span className="text-[11px] font-medium text-slate-600 leading-tight">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={() => load()}
      />
      {modals}
    </DashboardShell>
  );
}
