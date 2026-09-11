"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Plus, Grid2x2, List, Loader2 } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";
import DocumentCard from "@/components/DocumentCard";
import EmptyState from "@/components/EmptyState";
import UploadModal from "@/components/UploadModal";
import { useDocumentActions } from "@/lib/useDocumentActions";
import { useInfiniteDocuments } from "@/lib/useInfiniteDocuments";
import { DocumentCategory } from "@/lib/types";
import { formatBytes } from "@/lib/validation";

const CATEGORIES: (DocumentCategory | "All")[] = [
  "All",
  "Identity Documents",
  "Education & Learning",
  "Health & Wellness",
  "Transport",
  "Government Documents",
  "Financial Documents",
];

const SORTS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
  { value: "size", label: "File Size" },
] as const;

export default function DocumentsPage() {
  return (
    <Suspense fallback={null}>
      <DocumentsPageInner />
    </Suspense>
  );
}

function DocumentsPageInner() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState<string>("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]["value"]>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [uploadOpen, setUploadOpen] = useState(false);

  const {
    items,
    hasMore,
    initialLoading,
    loadingMore,
    error,
    sentinelRef,
    removeItem,
    prependItem,
    retry,
  } = useInfiniteDocuments({ search, category, sort, limit: 6 });

  const { actions, modals } = useDocumentActions(removeItem);

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Issued Documents</h1>
            <p className="text-sm text-slate-400 mt-0.5">{items.length} document{items.length === 1 ? "" : "s"} in your vault</p>
          </div>
          <button
            onClick={() => setUploadOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-dark"
          >
            <Plus size={15} /> Upload Document
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-5">
          <div className="relative flex-1 min-w-50">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documents..."
              className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm focus:border-brand outline-none"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-brand outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 focus:border-brand outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-2 ${view === "grid" ? "bg-brand-light text-brand" : "text-slate-400 hover:bg-slate-50"}`}
              aria-label="Grid view"
            >
              <Grid2x2 size={16} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 ${view === "list" ? "bg-brand-light text-brand" : "text-slate-400 hover:bg-slate-50"}`}
              aria-label="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <div className="mt-6">
          {initialLoading ? (
            <div className={view === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-4" : "space-y-3"}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`bg-white border border-slate-100 rounded-xl animate-pulse ${view === "grid" ? "h-32" : "h-20"}`} />
              ))}
            </div>
          ) : error && items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-red-600 mb-3">{error}</p>
              <button onClick={retry} className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-dark">
                Retry
              </button>
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              title={search || category !== "All" ? "No matching documents" : "No documents yet"}
              description={
                search || category !== "All"
                  ? "Try a different search term or category."
                  : "Upload your first document to start building your vault."
              }
              action={
                !search && category === "All" ? (
                  <button
                    onClick={() => setUploadOpen(true)}
                    className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-dark"
                  >
                    Upload Document
                  </button>
                ) : undefined
              }
            />
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {items.map((doc) => (
                <DocumentCard key={doc.id} document={doc} {...actions} />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{doc.name}</p>
                    <p className="text-xs text-slate-400">{doc.category}</p>
                  </div>
                  <div className="flex items-center gap-6 text-xs text-slate-400 shrink-0 ml-4">
                    <span>{formatBytes(doc.fileSize)}</span>
                    <div className="flex gap-1">
                      <button onClick={() => actions.onView(doc)} className="px-2 py-1 rounded hover:bg-slate-50 text-slate-500">View</button>
                      <button onClick={() => actions.onShare(doc)} className="px-2 py-1 rounded hover:bg-slate-50 text-slate-500">Share</button>
                      <button onClick={() => actions.onDelete(doc)} className="px-2 py-1 rounded hover:bg-red-50 text-red-500">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!initialLoading && items.length > 0 && (
            <div ref={sentinelRef} className="py-6 flex justify-center">
              {loadingMore && (
                <span className="flex items-center gap-2 text-sm text-slate-400">
                  <Loader2 size={15} className="animate-spin" /> Loading more...
                </span>
              )}
              {!hasMore && !loadingMore && (
                <span className="text-xs text-slate-300">You&apos;ve reached the end of your documents.</span>
              )}
              {error && !loadingMore && (
                <button onClick={retry} className="text-sm text-brand font-medium">
                  Couldn&apos;t load more — Retry
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onUploaded={prependItem} />
      {modals}
    </DashboardShell>
  );
}
