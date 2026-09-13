"use client";

import { useState } from "react";
import { MoreVertical, Eye, Download, Share2, Trash2 } from "lucide-react";
import DocumentTypeIcon from "./DocumentTypeIcon";
import { DigiDocument } from "@/lib/types";
import { formatBytes } from "@/lib/validation";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DocumentCard({
  document,
  onView,
  onDownload,
  onShare,
  onDelete,
}: {
  document: DigiDocument;
  onView: (doc: DigiDocument) => void;
  onDownload: (doc: DigiDocument) => void;
  onShare: (doc: DigiDocument) => void;
  onDelete: (doc: DigiDocument) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <DocumentTypeIcon fileType={document.fileType} />
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Document actions"
            className="p-1.5 rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 text-sm">
                <MenuButton icon={Eye} label="View" onClick={() => { setMenuOpen(false); onView(document); }} />
                <MenuButton icon={Download} label="Download" onClick={() => { setMenuOpen(false); onDownload(document); }} />
                <MenuButton icon={Share2} label="Share" onClick={() => { setMenuOpen(false); onShare(document); }} />
                <MenuButton
                  icon={Trash2}
                  label="Delete"
                  danger
                  onClick={() => { setMenuOpen(false); onDelete(document); }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      <p className="mt-3 text-sm font-semibold text-slate-800 truncate" title={document.name}>
        {document.name}
      </p>
      <p className="text-xs text-slate-400 mt-0.5">{document.category}</p>

      <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
        <span>{formatDate(document.uploadedAt)}</span>
        <span>{formatBytes(document.fileSize)}</span>
      </div>
    </div>
  );
}

function MenuButton({
  icon: Icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 ${
        danger ? "text-red-600" : "text-slate-600"
      }`}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}
