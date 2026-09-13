// Data shapes mirror the "Suggested Data Entities" section of the DigiVault PRD.

export type DocumentCategory =
  | "Identity Documents"
  | "Education & Learning"
  | "Health & Wellness"
  | "Transport"
  | "Government Documents"
  | "Financial Documents";

export interface DigiDocument {
  id: string;
  userId: string;
  name: string;
  fileName: string;
  fileType: string; // e.g. "pdf", "jpg"
  fileSize: number; // bytes
  category: DocumentCategory;
  cloudStorageKey: string;
  uploadedAt: string; // ISO timestamp
  downloadCount: number;
  fileDataUrl: string; // local object URL standing in for the S3 object during preview/download
}

export interface ShareLink {
  id: string;
  documentId: string;
  userId: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  revokedAt: string | null;
  isActive: boolean;
}

export interface User {
  id: string;
  mobileNumber: string;
  name: string;
  fullName?: string | null;
  dateOfBirth?: string | null;
  email?: string | null;
  username?: string | null;
  avatar?: string | null;
  storageUsed: number;
  storageLimit: number;
}

export interface DashboardSummary {
  totalDocuments: number;
  storageUsed: number;
  shareLinks: number;
  downloads: number;
}

export interface PaginatedResult<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export type ExpiryOption = "15m" | "1h" | "24h" | "7d" | "30d";

export interface ApiError {
  message: string;
}
