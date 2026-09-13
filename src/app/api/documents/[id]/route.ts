import { NextRequest, NextResponse } from "next/server";
import { prisma, serializeBigInt } from "@/lib/prisma";
import { AuthService } from "@/lib/auth";
import { StorageService } from "@/lib/storage";

// GET document details & download link
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await AuthService.getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id },
      include: { folder: true },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Document not found." } },
        { status: 404 }
      );
    }

    if (document.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "You do not have permission to access this document." } },
        { status: 403 }
      );
    }

    const downloadInfo = await StorageService.getDownloadStreamOrUrl(document.cloudStorageKey);

    return NextResponse.json({
      success: true,
      data: {
        document: serializeBigInt(document),
        downloadUrl: downloadInfo.url || `/api/documents/${document.id}/download`,
      },
    });
  } catch (err) {
    console.error("Get document error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to retrieve document details." } },
      { status: 500 }
    );
  }
}

// DELETE document
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await AuthService.getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Document not found." } },
        { status: 404 }
      );
    }

    if (document.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "You do not have permission to delete this document." } },
        { status: 403 }
      );
    }

    // Delete file from Cloud Storage
    await StorageService.deleteFile(document.cloudStorageKey);

    // Delete database record and adjust user storage quota
    await prisma.$transaction(async (tx) => {
      await tx.document.delete({
        where: { id: document.id },
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          storageUsed: {
            decrement: document.fileSize,
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        message: "Document deleted successfully.",
        deletedId: id,
      },
    });
  } catch (err) {
    console.error("Delete document error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to delete document." } },
      { status: 500 }
    );
  }
}

// PATCH update document metadata (rename, category, move folder)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await AuthService.getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Document not found." } },
        { status: 404 }
      );
    }

    if (document.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "You do not have permission to update this document." } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, category, folderId } = body;

    const updatedDocument = await prisma.document.update({
      where: { id: document.id },
      data: {
        ...(name ? { name } : {}),
        ...(category ? { category } : {}),
        ...(folderId !== undefined ? { folderId } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        document: serializeBigInt(updatedDocument),
      },
    });
  } catch (err) {
    console.error("Update document error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to update document." } },
      { status: 500 }
    );
  }
}
