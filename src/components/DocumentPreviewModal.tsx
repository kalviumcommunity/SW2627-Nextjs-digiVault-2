"use client";

import { X, Download } from "lucide-react";
import { DigiDocument } from "@/lib/types";
import DocumentTypeIcon from "./DocumentTypeIcon";
import { formatBytes } from "@/lib/validation";

const IMAGE_TYPES = ["jpg", "jpeg", "png"];

export default function DocumentPreviewModal({
  document,
  onClose,
  onDownload,
}: {
  document: DigiDocument | null;
  onClose: () => void;
  onDownload: (doc: DigiDocument) => void;
}) {
  if (!document) return null;
  const isImage = IMAGE_TYPES.includes(document.fileType.toLowerCase());
  const canPreviewImage = isImage && !!document.fileDataUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800 truncate pr-4">{document.name}</h3>
          <button onClick={onClose} aria-label="Close" className="p-1 text-slate-400 hover:text-slate-600 shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {canPreviewImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={document.fileDataUrl}
              alt={document.name}
              className="w-full max-h-80 object-contain rounded-lg border border-slate-100 bg-slate-50"
            />
          ) : (
            <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-lg py-12">
              <DocumentTypeIcon fileType={document.fileType} />
              <p className="text-sm text-slate-400 mt-3">Preview not available for this file type.</p>
            </div>
          )}

          <dl className="grid grid-cols-2 gap-y-3 gap-x-4 mt-5 text-sm">
            <Detail label="Category" value={document.category} />
            <Detail label="File type" value={document.fileType.toUpperCase()} />
            <Detail label="Size" value={formatBytes(document.fileSize)} />
            <Detail
              label="Uploaded"
              value={new Date(document.uploadedAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            />
          </dl>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
          <button
            onClick={() => onDownload(document)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-brand text-white hover:bg-brand-dark flex items-center gap-2"
          >
            <Download size={15} />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="text-slate-700 font-medium mt-0.5">{value}</dd>
    </div>
  );
}
