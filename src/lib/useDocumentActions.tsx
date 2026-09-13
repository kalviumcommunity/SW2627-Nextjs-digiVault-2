"use client";

import { useState } from "react";
import { DigiDocument } from "@/lib/types";
import { deleteDocument, recordDownload } from "@/lib/api";
import { useToast } from "@/lib/ToastContext";
import DocumentPreviewModal from "@/components/DocumentPreviewModal";
import ShareModal from "@/components/ShareModal";
import ConfirmDialog from "@/components/ConfirmDialog";

export function useDocumentActions(onDeleted: (id: string) => void) {
  const [previewDoc, setPreviewDoc] = useState<DigiDocument | null>(null);
  const [shareDoc, setShareDoc] = useState<DigiDocument | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DigiDocument | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleDownload = (doc: DigiDocument) => {
    recordDownload(doc.id).catch(() => undefined);
    if (doc.fileDataUrl) {
      const a = window.document.createElement("a");
      a.href = doc.fileDataUrl;
      a.download = doc.fileName;
      a.click();
    }
    showToast(`Downloading ${doc.name}...`, "info");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteDocument(deleteTarget.id);
      showToast(`${deleteTarget.name} deleted.`, "success");
      onDeleted(deleteTarget.id);
      setDeleteTarget(null);
    } catch {
      setDeleteError("Couldn't delete this document. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const actions = {
    onView: setPreviewDoc,
    onDownload: handleDownload,
    onShare: setShareDoc,
    onDelete: setDeleteTarget,
  };

  const modals = (
    <>
      <DocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onDownload={handleDownload}
      />
      <ShareModal document={shareDoc} onClose={() => setShareDoc(null)} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this document?"
        description={
          deleteError ??
          `"${deleteTarget?.name}" will be permanently removed from your vault and any active share links will stop working.`
        }
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteTarget(null);
          setDeleteError(null);
        }}
      />
    </>
  );

  return { actions, modals };
}
