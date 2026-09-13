import fs from "fs";
import path from "path";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3_BUCKET = process.env.AWS_S3_BUCKET;
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const isS3Configured = Boolean(
  S3_BUCKET && AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY
);

let s3Client: S3Client | null = null;
if (isS3Configured) {
  s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY_ID!,
      secretAccessKey: AWS_SECRET_ACCESS_KEY!,
    },
  });
}

const LOCAL_STORAGE_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure local uploads directory exists
if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
  fs.mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
}

export interface StorageUploadResult {
  key: string;
  url: string;
  provider: "s3" | "local";
}

export class StorageService {
  /**
   * Generates a unique cloud storage key for a file
   */
  static generateStorageKey(userId: string, originalFileName: string): string {
    const sanitizeName = originalFileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return `vault/${userId}/${uniqueId}_${sanitizeName}`;
  }

  /**
   * Uploads file buffer directly to cloud storage (S3 or Local Storage fallback)
   */
  static async uploadFile(
    buffer: Buffer,
    key: string,
    contentType: string
  ): Promise<StorageUploadResult> {
    if (isS3Configured && s3Client) {
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });
      await s3Client.send(command);
      return {
        key,
        url: `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`,
        provider: "s3",
      };
    } else {
      // Local storage fallback
      const filePath = path.join(LOCAL_STORAGE_DIR, path.basename(key));
      await fs.promises.writeFile(filePath, buffer);
      return {
        key,
        url: `/uploads/${path.basename(key)}`,
        provider: "local",
      };
    }
  }

  /**
   * Generates a presigned upload URL for direct-to-S3 uploads
   */
  static async getPresignedUploadUrl(
    key: string,
    contentType: string,
    expiresInSeconds: number = 900
  ): Promise<{ uploadUrl: string; key: string }> {
    if (isS3Configured && s3Client) {
      const command = new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        ContentType: contentType,
      });
      const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: expiresInSeconds,
      });
      return { uploadUrl, key };
    } else {
      // Return direct API endpoint for local fallback
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      return {
        uploadUrl: `${appUrl}/api/upload/direct?key=${encodeURIComponent(key)}`,
        key,
      };
    }
  }

  /**
   * Gets a secure download stream or URL for a document key
   */
  static async getDownloadStreamOrUrl(
    key: string,
    expiresInSeconds: number = 3600
  ): Promise<{ url?: string; buffer?: Buffer }> {
    if (isS3Configured && s3Client) {
      const command = new GetObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
      });
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: expiresInSeconds,
      });
      return { url };
    } else {
      const filePath = path.join(LOCAL_STORAGE_DIR, path.basename(key));
      if (fs.existsSync(filePath)) {
        const buffer = await fs.promises.readFile(filePath);
        return { buffer };
      }
      throw new Error(`File not found at storage path: ${key}`);
    }
  }

  /**
   * Deletes a file from cloud storage (S3 or local)
   */
  static async deleteFile(key: string): Promise<void> {
    try {
      if (isS3Configured && s3Client) {
        const command = new DeleteObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
        });
        await s3Client.send(command);
      } else {
        const filePath = path.join(LOCAL_STORAGE_DIR, path.basename(key));
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      }
    } catch (err) {
      console.error(`Failed to delete storage object key: ${key}`, err);
    }
  }
}
