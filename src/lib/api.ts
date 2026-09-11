import {
  DashboardSummary,
  DigiDocument,
  DocumentCategory,
  ExpiryOption,
  PaginatedResult,
  ShareLink,
  User,
} from "./types";

const AUTH_TOKEN_KEY = "digivault_jwt";

function getAuthHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface ApiDocumentData {
  id: string;
  userId: string;
  name: string;
  fileName: string;
  fileType?: string;
  fileExtension?: string;
  fileSize?: number | bigint;
  category: string;
  cloudStorageKey?: string;
  uploadedAt: string | Date;
  downloadCount?: number;
}

interface ApiShareLinkData {
  id: string;
  documentId: string;
  userId: string;
  token: string;
  createdAt: string | Date;
  expiresAt: string | Date;
  revokedAt?: string | Date | null;
  isActive?: boolean;
  isExpired?: boolean;
}

function mapApiDocument(doc: ApiDocumentData): DigiDocument {
  return {
    id: doc.id,
    userId: doc.userId,
    name: doc.name,
    fileName: doc.fileName,
    fileType: doc.fileType || doc.fileExtension || "bin",
    fileSize: Number(doc.fileSize || 0),
    category: doc.category as DocumentCategory,
    cloudStorageKey: doc.cloudStorageKey || "",
    uploadedAt:
      typeof doc.uploadedAt === "string"
        ? doc.uploadedAt
        : new Date(doc.uploadedAt).toISOString(),
    downloadCount: Number(doc.downloadCount || 0),
    fileDataUrl: `/api/documents/${doc.id}/download`,
  };
}

// ---------------------------------------------------------------------------
// Auth (PRD Section 4: mobile number + OTP)
// ---------------------------------------------------------------------------

export async function requestOtp(
  mobileNumber: string
): Promise<{ sent: true; devOtp: string }> {
  if (!/^\d{10}$/.test(mobileNumber)) {
    throw new Error("Enter a valid 10-digit mobile number.");
  }

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "send_otp", mobileNumber }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || "Failed to send OTP.");
  }

  return {
    sent: true,
    devOtp: json.data?.mockOtp || "123456",
  };
}

export async function verifyOtp(
  mobileNumber: string,
  otp: string
): Promise<User> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "verify_otp", mobileNumber, otp }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || "Incorrect OTP. Please try again.");
  }

  const { user, token } = json.data;
  if (token && typeof window !== "undefined") {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  return {
    id: user.id,
    mobileNumber: user.mobileNumber,
    name: user.name || "User",
    storageUsed: Number(user.storageUsed || 0),
    storageLimit: Number(user.storageLimit || 1073741824),
  };
}

export async function getSession(): Promise<User | null> {
  try {
    const res = await fetch("/api/dashboard/stats", {
      headers: { ...getAuthHeaders() },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data?.user) return null;

    const { user, stats } = json.data;
    return {
      id: user.id,
      mobileNumber: user.mobileNumber,
      name: user.name || "User",
      fullName: user.fullName ?? null,
      dateOfBirth: user.dateOfBirth ?? null,
      email: user.email ?? null,
      username: user.username ?? null,
      avatar: user.avatar ?? null,
      storageUsed: Number(stats?.storageUsed || 0),
      storageLimit: Number(stats?.storageLimit || 1073741824),
    };
  } catch {
    return null;
  }
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST" });
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    document.cookie =
      "digivault_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
}

// ---------------------------------------------------------------------------
// Documents (PRD Section 6, 7, 8)
// ---------------------------------------------------------------------------

export interface ListDocumentsParams {
  cursor?: string | null;
  limit?: number;
  search?: string;
  category?: string | null;
  sort?: "newest" | "oldest" | "name_asc" | "name_desc" | "size";
}

export async function listDocuments(
  params: ListDocumentsParams
): Promise<PaginatedResult<DigiDocument>> {
  const query = new URLSearchParams();

  if (params.cursor) query.set("cursor", params.cursor);
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.category && params.category !== "All")
    query.set("category", params.category);
  if (params.sort) query.set("sortBy", params.sort);

  const res = await fetch(`/api/documents?${query.toString()}`, {
    headers: { ...getAuthHeaders() },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || "Failed to load documents.");
  }

  const rawDocs: ApiDocumentData[] = json.data?.documents || [];
  const items = rawDocs.map(mapApiDocument);

  return {
    items,
    nextCursor: json.data?.nextCursor ?? null,
    hasMore: Boolean(json.data?.nextCursor),
  };
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch("/api/dashboard/stats", {
    headers: { ...getAuthHeaders() },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || "Failed to load dashboard stats.");
  }

  const stats = json.data?.stats || {};
  return {
    totalDocuments: Number(stats.totalDocuments || 0),
    storageUsed: Number(stats.storageUsed || 0),
    shareLinks: Number(stats.activeShareLinks || 0),
    downloads: Number(stats.totalDownloads || 0),
  };
}

export async function getStorageInfo(): Promise<{ used: number; limit: number }> {
  const res = await fetch("/api/dashboard/stats", {
    headers: { ...getAuthHeaders() },
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || "Failed to load storage info.");
  }

  const stats = json.data?.stats || {};
  return {
    used: Number(stats.storageUsed || 0),
    limit: Number(stats.storageLimit || 1073741824),
  };
}

export async function uploadDocument(
  file: File,
  category: DocumentCategory
): Promise<DigiDocument> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { ...getAuthHeaders() },
    body: formData,
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || "Failed to upload document.");
  }

  return mapApiDocument(json.data.document);
}

export async function deleteDocument(id: string): Promise<void> {
  const res = await fetch(`/api/documents/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || "Failed to delete document.");
  }
}

export async function recordDownload(id: string): Promise<void> {
  // Download count is automatically incremented server-side upon fetching /api/documents/[id]/download
  try {
    await fetch(`/api/documents/${id}/download`, {
      method: "GET",
      headers: { ...getAuthHeaders() },
    });
  } catch {
    // Ignore non-blocking download count errors
  }
}

// ---------------------------------------------------------------------------
// Share links (PRD Section 9)
// ---------------------------------------------------------------------------

export async function createShareLink(
  documentId: string,
  expiry: ExpiryOption
): Promise<ShareLink> {
  const res = await fetch("/api/share", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ documentId, expiryOption: expiry }),
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || "Failed to create share link.");
  }

  const rawLink = json.data?.shareLink;
  return {
    id: rawLink.id,
    documentId: rawLink.documentId,
    userId: rawLink.userId,
    token: rawLink.token,
    createdAt:
      typeof rawLink.createdAt === "string"
        ? rawLink.createdAt
        : new Date(rawLink.createdAt).toISOString(),
    expiresAt:
      typeof rawLink.expiresAt === "string"
        ? rawLink.expiresAt
        : new Date(rawLink.expiresAt).toISOString(),
    revokedAt: rawLink.revokedAt
      ? typeof rawLink.revokedAt === "string"
        ? rawLink.revokedAt
        : new Date(rawLink.revokedAt).toISOString()
      : null,
    isActive: Boolean(rawLink.isActive),
  };
}

export async function revokeShareLink(id: string): Promise<void> {
  const res = await fetch(`/api/share/${id}/revoke`, {
    method: "POST",
    headers: { ...getAuthHeaders() },
  });

  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.error?.message || "Failed to revoke share link.");
  }
}

export async function getSharedDocument(
  token: string
): Promise<{ link: ShareLink; document: DigiDocument } | null> {
  try {
    const res = await fetch(`/api/shared/${token}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data?.document) return null;

    const { document, expiresAt } = json.data;
    const mappedDoc = mapApiDocument(document);
    if (json.data.downloadUrl) {
      mappedDoc.fileDataUrl = json.data.downloadUrl;
    }

    const link: ShareLink = {
      id: token,
      documentId: document.id,
      userId: "",
      token,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt || new Date(Date.now() + 86400000).toISOString(),
      revokedAt: null,
      isActive: true,
    };

    return { link, document: mappedDoc };
  } catch {
    return null;
  }
}

export async function listShareLinksForDocument(
  documentId: string
): Promise<ShareLink[]> {
  try {
    const res = await fetch("/api/share", {
      headers: { ...getAuthHeaders() },
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok || !json.success) return [];

    const rawLinks: ApiShareLinkData[] = json.data?.shareLinks || [];
    return rawLinks
      .filter((l) => l.documentId === documentId)
      .map((rawLink) => ({
        id: rawLink.id,
        documentId: rawLink.documentId,
        userId: rawLink.userId,
        token: rawLink.token,
        createdAt:
          typeof rawLink.createdAt === "string"
            ? rawLink.createdAt
            : new Date(rawLink.createdAt).toISOString(),
        expiresAt:
          typeof rawLink.expiresAt === "string"
            ? rawLink.expiresAt
            : new Date(rawLink.expiresAt).toISOString(),
        revokedAt: rawLink.revokedAt
          ? typeof rawLink.revokedAt === "string"
            ? rawLink.revokedAt
          : new Date(rawLink.revokedAt).toISOString()
          : null,
        isActive: Boolean(rawLink.isActive && !rawLink.isExpired),
      }));
  } catch {
    return [];
  }
}
