import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma, serializeBigInt } from "@/lib/prisma";
import { StorageService } from "@/lib/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_TOKEN", message: "Share token is required." } },
        { status: 400 }
      );
    }

    // Compute token hash to compare against DB record
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const shareLink = await prisma.shareLink.findFirst({
      where: {
        OR: [{ tokenHash }, { token }],
      },
      include: {
        document: true,
        user: {
          select: { name: true, avatar: true },
        },
      },
    });

    if (!shareLink) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SHARE_LINK_NOT_FOUND",
            message: "The requested document share link does not exist or has been removed.",
          },
        },
        { status: 404 }
      );
    }

    // Check revocation
    if (!shareLink.isActive || shareLink.revokedAt !== null) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SHARE_LINK_REVOKED",
            message: "This share link has been revoked by the owner.",
          },
        },
        { status: 410 }
      );
    }

    // Check expiration
    if (new Date() > new Date(shareLink.expiresAt)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "SHARE_LINK_EXPIRED",
            message: "This share link has expired and is no longer accessible.",
          },
        },
        { status: 410 }
      );
    }

    const { document } = shareLink;
    if (!document) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "DOCUMENT_NOT_FOUND",
            message: "The shared document no longer exists.",
          },
        },
        { status: 404 }
      );
    }

    const downloadInfo = await StorageService.getDownloadStreamOrUrl(document.cloudStorageKey);

    return NextResponse.json({
      success: true,
      data: {
        document: serializeBigInt({
          id: document.id,
          name: document.name,
          fileName: document.fileName,
          fileType: document.fileType,
          fileExtension: document.fileExtension,
          fileSize: document.fileSize,
          category: document.category,
          uploadedAt: document.uploadedAt,
        }),
        sharedBy: shareLink.user?.name || "DigiVault User",
        expiresAt: shareLink.expiresAt.toISOString(),
        downloadUrl: downloadInfo.url || `/api/documents/${document.id}/download`,
      },
    });
  } catch (err) {
    console.error("Shared link resolution error:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to access shared document.",
        },
      },
      { status: 500 }
    );
  }
}
