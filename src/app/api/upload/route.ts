import { NextRequest, NextResponse } from "next/server";
import { prisma, serializeBigInt } from "@/lib/prisma";
import { AuthService } from "@/lib/auth";
import { FileValidator } from "@/lib/validation";
import { StorageService } from "@/lib/storage";

export async function POST(req: NextRequest) {
  let uploadedStorageKey: string | null = null;

  try {
    const user = await AuthService.getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required to upload documents.",
          },
        },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const customName = formData.get("name") as string | null;
    const categoryOverride = formData.get("category") as string | null;
    const folderId = formData.get("folderId") as string | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "MISSING_FILE",
            message: "No file was provided in the request body.",
          },
        },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Execute server-side validation
    const validation = FileValidator.validateFile(
      file.name,
      file.size,
      file.type,
      fileBuffer,
      Number(user.storageUsed),
      Number(user.storageLimit)
    );

    if (!validation.valid) {
      const statusCode = validation.errorCode === "FILE_TOO_LARGE" ? 413 : 400;
      return NextResponse.json(
        {
          success: false,
          error: {
            code: validation.errorCode,
            message: validation.errorMessage,
          },
        },
        { status: statusCode }
      );
    }

    const docCategory = categoryOverride || validation.category || "Other";
    const storageKey = StorageService.generateStorageKey(user.id, file.name);

    // Upload file directly to Cloud Storage (AWS S3 or Local Fallback)
    const uploadResult = await StorageService.uploadFile(
      fileBuffer,
      storageKey,
      validation.mimeType || file.type || "application/octet-stream"
    );

    uploadedStorageKey = uploadResult.key;

    // Transactionally save metadata and update user quota
    const document = await prisma.$transaction(async (tx: any) => {
      const createdDoc = await tx.document.create({
        data: {
          userId: user.id,
          name: customName || file.name.replace(/\.[^/.]+$/, ""),
          fileName: file.name,
          fileType: validation.mimeType || file.type,
          fileExtension: validation.fileExtension || "bin",
          fileSize: file.size,
          category: docCategory,
          cloudStorageKey: storageKey,
          folderId: folderId || null,
        },
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          storageUsed: {
            increment: file.size,
          },
        },
      });

      return createdDoc;
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          document: serializeBigInt(document),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Document upload error:", err);

    // Clean up uploaded cloud storage object on error to prevent orphan files
    if (uploadedStorageKey) {
      await StorageService.deleteFile(uploadedStorageKey);
    }

    const message =
      err instanceof Error
        ? err.message
        : "Failed to upload document. Please try again.";

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UPLOAD_FAILED",
          message,
        },
      },
      { status: 500 }
    );
  }
}
