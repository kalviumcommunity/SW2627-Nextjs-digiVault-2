"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Download, Loader2, ShieldOff } from "lucide-react";
import Logo from "@/components/Logo";
import DocumentTypeIcon from "@/components/DocumentTypeIcon";
import { getSharedDocument, recordDownload } from "@/lib/api";
import { DigiDocument, ShareLink } from "@/lib/types";
import { formatBytes } from "@/lib/validation";

export default function SharedDocumentPage() {
  const params = useParams<{ token: string }>();
  const [state, setState] = useState<"loading" | "found" | "expired">("loading");
  const [data, setData] = useState<{ link: ShareLink; document: DigiDocument } | null>(null);

  useEffect(() => {
    let active = true;
    getSharedDocument(params.token).then((result) => {
      if (!active) return;
      if (result) {
        setData(result);
        setState("found");
      } else {
        setState("expired");
      }
    });
    return () => {
      active = false;
    };
  }, [params.token]);

  const handleDownload = () => {
    if (!data) return;
    recordDownload(data.document.id).catch(() => undefined);
    if (data.document.fileDataUrl) {
      const a = window.document.createElement("a");
      a.href = data.document.fileDataUrl;
      a.download = data.document.fileName;
      a.click();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-16 border-b border-slate-200 bg-white flex items-center px-6">
        <Logo />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        {state === "loading" && <Loader2 className="animate-spin text-brand" size={28} />}

        {state === "expired" && (
          <div className="text-center max-w-sm">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <ShieldOff size={24} className="text-red-500" />
            </div>
            <h1 className="text-lg font-semibold text-slate-800">This link is no longer available</h1>
            <p className="text-sm text-slate-400 mt-1.5">
              The share link has expired or been revoked by its owner. Ask them to generate a new one.
            </p>
          </div>
        )}

        {state === "found" && data && (
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <DocumentTypeIcon fileType={data.document.fileType} />
            </div>
            <h1 className="text-lg font-semibold text-slate-800">{data.document.name}</h1>
            <p className="text-sm text-slate-400 mt-1">
              {data.document.category} · {formatBytes(data.document.fileSize)}
            </p>
            <p className="text-xs text-slate-400 mt-3">
              This link expires on{" "}
              {new Date(data.link.expiresAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 mt-5 py-2.5 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-dark"
            >
              <Download size={15} /> Download
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
