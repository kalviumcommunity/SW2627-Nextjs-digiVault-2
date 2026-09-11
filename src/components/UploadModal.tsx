"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Loader2, FileWarning } from "lucide-react";
import { DocumentCategory } from "@/lib/types";
import { validateFile, formatBytes, SUPPORTED_EXTENSIONS, MAX_FILE_SIZE_BYTES } from "@/lib/validation";
import { uploadDocument, getStorageInfo } from "@/lib/api";
import DocumentTypeIcon from "./DocumentTypeIcon";
import { useToast } from "@/lib/ToastContext";
import { DigiDocument } from "@/lib/types";

const CATEGORIES: DocumentCategory[] = [
  "Identity Documents",
  "Education & Learning",
  "Health & Wellness",
  "Transport",
  "Government Documents",
  "Financial Documents",
];

export default function UploadModal({
  open,
  onClose,
  onUploaded,
}: {
  open: boolean;
  onClose: () => void;
  onUploaded: (doc: DigiDocument) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<DocumentCategory>("Identity Documents");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { showToast } = useToast();

  if (!open) return null;

  const reset = () => {
    setFile(null);
    setError(null);
    setDragActive(false);
    setUploading(false);
  };

  const close = () => {
    reset();
    onClose();
  };

  const handleFile = async (selected: File | undefined | null) => {
    if (!selected) return;
    setError(null);
    const { used } = await getStorageInfo();
    const result = validateFile(selected, used);
    if (!result.valid) {
      setError(result.message ?? "This file can't be uploaded.");
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const doc = await uploadDocument(file, category);
      showToast(`${doc.name} uploaded successfully.`, "success");
      onUploaded(doc);
      close();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">Upload Document</h3>
          <button onClick={close} aria-label="Close" className="p-1 text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {!file ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                handleFile(e.dataTransfer.files?.[0]);
              }}
              onClick={() => inputRef.current?.click()}
              className={`flex flex-col items-center justify-center text-center rounded-xl border-2 border-dashed px-4 py-10 cursor-pointer transition-colors ${
                dragActive ? "border-brand bg-brand-light" : "border-slate-200 hover:border-brand/60"
              }`}
            >
              <UploadCloud size={28} className="text-brand mb-2" />
              <p className="text-sm font-medium text-slate-700">
                Drag and drop a file, or <span className="text-brand">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {SUPPORTED_EXTENSIONS.join(", ").toUpperCase()} — up to {formatBytes(MAX_FILE_SIZE_BYTES)}
              </p>
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
              <DocumentTypeIcon fileType={file.name.split(".").pop() ?? ""} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
              </div>
              <button
                onClick={() => setFile(null)}
                aria-label="Remove file"
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2.5 text-sm text-red-700">
              <FileWarning size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-slate-100">
          <button
            onClick={close}
            disabled={uploading}
            className="px-3.5 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-brand text-white hover:bg-brand-dark disabled:opacity-50 flex items-center gap-2"
          >
            {uploading && <Loader2 size={14} className="animate-spin" />}
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
