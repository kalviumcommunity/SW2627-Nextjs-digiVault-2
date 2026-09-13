"use client";

import { useEffect, useState } from "react";
import { Folder, Plus, Search, ArrowLeft, Loader2 } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import DocumentCard from "@/components/DocumentCard";
import EmptyState from "@/components/EmptyState";
import UploadModal from "@/components/UploadModal";
import { useDocumentActions } from "@/lib/useDocumentActions";
import { listDocuments, getStorageInfo } from "@/lib/api";
import { DigiDocument, DocumentCategory } from "@/lib/types";
import { formatBytes, STORAGE_QUOTA_BYTES } from "@/lib/validation";

const FOLDERS: { name: string; categories: DocumentCategory[] }[] = [
  { name: "Documents", categories: ["Government Documents", "Transport"] },
  { name: "Education", categories: ["Education & Learning"] },
  { name: "Health", categories: ["Health & Wellness"] },
  { name: "Identity", categories: ["Identity Documents"] },
  { name: "Finance", categories: ["Financial Documents"] },
];

export default function DrivePage() {
  const [storage, setStorage] = useState({ used: 0, limit: STORAGE_QUOTA_BYTES });
  const [search, setSearch] = useState("");
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [folderDocs, setFolderDocs] = useState<DigiDocument[]>([]);
  const [loadingFolder, setLoadingFolder] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const refreshStorage = () => getStorageInfo().then(setStorage);

  useEffect(() => {
    refreshStorage();
  }, []);

  const openFolderView = async (name: string) => {
    setOpenFolder(name);
    setLoadingFolder(true);
    const folder = FOLDERS.find((f) => f.name === name);
    try {
      const results = await Promise.all(
        (folder?.categories ?? []).map((category) => listDocuments({ category, limit: 50 }))
      );
      const merged = results.flatMap((r) => r.items);
      setFolderDocs(merged);
    } finally {
      setLoadingFolder(false);
    }
  };

  const { actions, modals } = useDocumentActions((id) => {
    setFolderDocs((prev) => prev.filter((d) => d.id !== id));
    refreshStorage();
  });

  const pct = Math.min(100, Math.round((storage.used / storage.limit) * 100));
  const visibleFolders = FOLDERS.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">DigiVault Drive</h1>
            <p className="text-sm text-slate-400 mt-0.5">Drive</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-dark"
            >
              <Plus size={15} /> New
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 text-sm">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-600"
                  >
                    New Folder
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setUploadOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-600"
                  >
                    Upload File
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 max-w-sm">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Storage Used</span>
            <span>{formatBytes(storage.used)} of {formatBytes(storage.limit)}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {openFolder ? (
          <>
            <button
              onClick={() => setOpenFolder(null)}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mt-6 mb-3"
            >
              <ArrowLeft size={15} /> Back to Drive
            </button>
            <h2 className="text-base font-semibold text-slate-800 mb-3">{openFolder}</h2>
            {loadingFolder ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-brand" size={22} />
              </div>
            ) : folderDocs.length === 0 ? (
              <EmptyState title="This folder is empty" description="Upload a document to see it here." />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {folderDocs.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} {...actions} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="relative mt-6 max-w-sm">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files..."
                className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm focus:border-brand outline-none"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-5">
              {visibleFolders.map((folder) => (
                <button
                  key={folder.name}
                  onClick={() => openFolderView(folder.name)}
                  className="flex flex-col items-center gap-2 bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm hover:border-brand/40 transition-all"
                >
                  <Folder size={32} className="text-brand fill-brand-light" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-slate-700">{folder.name}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={() => {
          refreshStorage();
          if (openFolder) openFolderView(openFolder);
        }}
      />
      {modals}
    </DashboardShell>
  );
}
