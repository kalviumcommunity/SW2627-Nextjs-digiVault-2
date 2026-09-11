import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/lib/auth";
import { StorageService } from "@/lib/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await AuthService.getAuthUser(req);
    
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Document not found." } },
        { status: 404 }
      );
    }

    if (user && document.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Access denied." } },
        { status: 403 }
      );
    }

    // Increment download metrics
    await prisma.document.update({
      where: { id: document.id },
      data: {
        downloadCount: { increment: 1 },
      },
    });

    if (user) {
      await prisma.download.create({
        data: {
          documentId: document.id,
          userId: user.id,
        },
      });
    }

    const downloadInfo = await StorageService.getDownloadStreamOrUrl(document.cloudStorageKey);

    if (downloadInfo.url) {
      return NextResponse.redirect(downloadInfo.url);
    }

    if (downloadInfo.buffer) {
      const headers = new Headers();
      headers.set("Content-Type", document.fileType || "application/octet-stream");
      headers.set(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(document.fileName)}"`
      );
      headers.set("Content-Length", document.fileSize.toString());

      return new NextResponse(new Uint8Array(downloadInfo.buffer), {
        status: 200,
        headers,
      });
    }

    return NextResponse.json(
      { success: false, error: { code: "FILE_UNAVAILABLE", message: "Storage file is unavailable." } },
      { status: 404 }
    );
  } catch (err) {
    console.error("Document download stream error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Download failed." } },
      { status: 500 }
    );
  }
}
