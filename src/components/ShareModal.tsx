"use client";

import { useEffect, useState } from "react";
import { X, Copy, Check, Loader2, Link2, Ban } from "lucide-react";
import { DigiDocument, ExpiryOption, ShareLink } from "@/lib/types";
import { createShareLink, revokeShareLink } from "@/lib/api";
import { useToast } from "@/lib/ToastContext";

const EXPIRY_OPTIONS: { value: ExpiryOption; label: string }[] = [
  { value: "15m", label: "15 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "24h", label: "24 hours" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
];

export default function ShareModal({
  document,
  onClose,
}: {
  document: DigiDocument | null;
  onClose: () => void;
}) {
  const [expiry, setExpiry] = useState<ExpiryOption>("24h");
  const [link, setLink] = useState<ShareLink | null>(null);
  const [generating, setGenerating] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset panel when target document changes
    setLink(null);
    setError(null);
    setCopied(false);
  }, [document]);

  if (!document) return null;

  const shareUrl = link ? `${typeof window !== "undefined" ? window.location.origin : ""}/share/${link.token}` : "";

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const created = await createShareLink(document.id, expiry);
      setLink(created);
    } catch {
      setError("Couldn't generate the link. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast("Link copied to clipboard.", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't copy the link. Please copy it manually.");
    }
  };

  const handleRevoke = async () => {
    if (!link) return;
    setRevoking(true);
    try {
      await revokeShareLink(link.id);
      showToast("Link revoked.", "info");
      setLink(null);
    } catch {
      setError("Couldn't revoke the link. Please try again.");
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">Share Document</h3>
          <button onClick={onClose} aria-label="Close" className="p-1 text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-slate-500">
            Generate a secure link to <span className="font-medium text-slate-700">{document.name}</span>{" "}
            that automatically expires.
          </p>

          {!link ? (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Link expires in</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {EXPIRY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setExpiry(opt.value)}
                      className={`py-2 rounded-lg border text-xs font-medium ${
                        expiry === opt.value
                          ? "border-brand bg-brand-light text-brand"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-dark disabled:opacity-60"
              >
                {generating ? <Loader2 size={15} className="animate-spin" /> : <Link2 size={15} />}
                {generating ? "Generating link..." : "Generate Link"}
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 p-2.5">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 text-sm text-slate-600 bg-transparent outline-none min-w-0"
                />
                <button
                  onClick={handleCopy}
                  className="shrink-0 p-2 rounded-md bg-slate-50 text-slate-600 hover:bg-slate-100"
                  aria-label="Copy link"
                >
                  {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Expires on {new Date(link.expiresAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <button
                onClick={handleRevoke}
                disabled={revoking}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-60"
              >
                {revoking ? <Loader2 size={15} className="animate-spin" /> : <Ban size={15} />}
                {revoking ? "Revoking..." : "Revoke Link"}
              </button>
            </>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
