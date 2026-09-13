import { DocumentCategory } from "./types";

// Centralized upload validation, matching PRD Section 6: Document Upload.
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB per document
export const STORAGE_QUOTA_BYTES = 1 * 1024 * 1024 * 1024; // 1 GB per user
export const MAX_USER_QUOTA_BYTES = STORAGE_QUOTA_BYTES;

// Supported file types, centralized so more formats can be added later (PRD 6).
export const SUPPORTED_EXTENSIONS = [
  "pdf",
  "jpg",
  "jpeg",
  "png",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
] as const;

export type SupportedExtension = (typeof SUPPORTED_EXTENSIONS)[number];

export type ValidationErrorCode =
  | "UNSUPPORTED_TYPE"
  | "FILE_TOO_LARGE"
  | "INSUFFICIENT_STORAGE";

export interface ValidationResult {
  valid: boolean;
  errorCode?: ValidationErrorCode;
  message?: string;
}

export function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

export function isSupportedFileType(fileName: string): boolean {
  const ext = getFileExtension(fileName);
  return (SUPPORTED_EXTENSIONS as readonly string[]).includes(ext);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Validates a file against type, size, and remaining storage quota.
 * This is the single source of truth for upload validation on client side.
 */
export function validateFile(
  file: File,
  currentStorageUsed: number
): ValidationResult {
  if (!isSupportedFileType(file.name)) {
    return {
      valid: false,
      errorCode: "UNSUPPORTED_TYPE",
      message: "File type not supported.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      errorCode: "FILE_TOO_LARGE",
      message: "File size must be 10 MB or less.",
    };
  }

  if (currentStorageUsed + file.size > STORAGE_QUOTA_BYTES) {
    return {
      valid: false,
      errorCode: "INSUFFICIENT_STORAGE",
      message: "Insufficient storage space.",
    };
  }

  return { valid: true };
}

// ---------------------------------------------------------------------------
// Server-Side Magic Bytes & Allowed File Types Definition
// ---------------------------------------------------------------------------

export interface AllowedFileType {
  extension: string;
  mimeType: string;
  category: DocumentCategory;
  description: string;
}

export const ALLOWED_FILE_TYPES: AllowedFileType[] = [
  { extension: "pdf", mimeType: "application/pdf", category: "Government Documents", description: "Portable Document Format" },
  { extension: "jpg", mimeType: "image/jpeg", category: "Identity Documents", description: "JPEG Image" },
  { extension: "jpeg", mimeType: "image/jpeg", category: "Identity Documents", description: "JPEG Image" },
  { extension: "png", mimeType: "image/png", category: "Identity Documents", description: "PNG Image" },
  { extension: "doc", mimeType: "application/msword", category: "Education & Learning", description: "Word Document" },
  { extension: "docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", category: "Education & Learning", description: "Word Document" },
  { extension: "xls", mimeType: "application/vnd.ms-excel", category: "Financial Documents", description: "Excel Spreadsheet" },
  { extension: "xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", category: "Financial Documents", description: "Excel Spreadsheet" },
  { extension: "ppt", mimeType: "application/vnd.ms-powerpoint", category: "Education & Learning", description: "PowerPoint Presentation" },
  { extension: "pptx", mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation", category: "Education & Learning", description: "PowerPoint Presentation" },
  { extension: "txt", mimeType: "text/plain", category: "Identity Documents", description: "Text File" },
];

export interface FileValidationResult {
  valid: boolean;
  errorCode?: string;
  errorMessage?: string;
  fileExtension?: string;
  mimeType?: string;
  category?: DocumentCategory;
}

export class FileValidator {
  /**
   * Get allowed file type definition by extension
   */
  static getFileTypeByExtension(ext: string): AllowedFileType | undefined {
    const cleanExt = ext.toLowerCase().replace(/^\./, "");
    return ALLOWED_FILE_TYPES.find((t) => t.extension === cleanExt);
  }

  /**
   * Inspects magic bytes buffer to confirm underlying file header integrity
   */
  static validateMagicBytes(buffer: Buffer, fileExt: string): boolean {
    if (!buffer || buffer.length < 4) return true;

    const ext = fileExt.toLowerCase().replace(/^\./, "");

    // PDF: %PDF (0x25 0x50 0x44 0x46)
    if (ext === "pdf") {
      return (
        buffer[0] === 0x25 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x44 &&
        buffer[3] === 0x46
      );
    }

    // PNG: 0x89 0x50 0x4E 0x47
    if (ext === "png") {
      return (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4E &&
        buffer[3] === 0x47
      );
    }

    // JPEG: 0xFF 0xD8 0xFF
    if (ext === "jpg" || ext === "jpeg") {
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    }

    // DOCX, XLSX, PPTX (ZIP headers): PK (0x50 0x4B 0x03 0x04)
    if (["docx", "xlsx", "pptx"].includes(ext)) {
      return buffer[0] === 0x50 && buffer[1] === 0x4b;
    }

    // Legacy DOC, XLS, PPT (OLE Compound File): 0xD0 0xCF 0x11 0xE0
    if (["doc", "xls", "ppt"].includes(ext)) {
      return (
        buffer[0] === 0xd0 &&
        buffer[1] === 0xcf &&
        buffer[2] === 0x11 &&
        buffer[3] === 0xe0
      );
    }

    return true;
  }

  /**
   * Complete validation of file size, type, magic bytes, and user storage quota
   */
  static validateFile(
    fileName: string,
    fileSize: number,
    clientMimeType?: string,
    buffer?: Buffer,
    currentStorageUsed: number = 0,
    storageLimit: number = MAX_USER_QUOTA_BYTES
  ): FileValidationResult {
    // 1. File size check
    if (!fileSize || fileSize <= 0) {
      return {
        valid: false,
        errorCode: "EMPTY_FILE",
        errorMessage: "Uploaded file is empty.",
      };
    }

    if (fileSize > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        errorCode: "FILE_TOO_LARGE",
        errorMessage: `File size (${(fileSize / (1024 * 1024)).toFixed(
          2
        )} MB) exceeds the maximum allowed limit of 10 MB.`,
      };
    }

    // 2. Storage quota check
    if (currentStorageUsed + fileSize > storageLimit) {
      return {
        valid: false,
        errorCode: "STORAGE_QUOTA_EXCEEDED",
        errorMessage: `Uploading this file (${(fileSize / (1024 * 1024)).toFixed(
          2
        )} MB) will exceed your total storage limit of 1 GB.`,
      };
    }

    // 3. Extension check
    const extMatch = fileName.match(/\.([a-zA-Z0-9]+)$/);
    if (!extMatch) {
      return {
        valid: false,
        errorCode: "INVALID_FILE_NAME",
        errorMessage: "File name must have a valid file extension.",
      };
    }

    const ext = extMatch[1].toLowerCase();
    const typeDef = this.getFileTypeByExtension(ext);

    if (!typeDef) {
      return {
        valid: false,
        errorCode: "UNSUPPORTED_FILE_TYPE",
        errorMessage: `File extension .${ext} is not supported. Allowed formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT.`,
      };
    }

    // 4. Magic bytes validation if buffer is available
    if (buffer && !this.validateMagicBytes(buffer, ext)) {
      return {
        valid: false,
        errorCode: "FILE_CORRUPTED_OR_SPOOFED",
        errorMessage: `File contents do not match extension .${ext}. Upload rejected for security reasons.`,
      };
    }

    return {
      valid: true,
      fileExtension: ext,
      mimeType: typeDef.mimeType,
      category: typeDef.category,
    };
  }
}
