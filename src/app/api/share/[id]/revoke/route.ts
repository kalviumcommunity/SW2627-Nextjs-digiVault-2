import { NextRequest, NextResponse } from "next/server";
import { prisma, serializeBigInt } from "@/lib/prisma";
import { AuthService } from "@/lib/auth";

export async function POST(
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

    const shareLink = await prisma.shareLink.findUnique({
      where: { id },
    });

    if (!shareLink) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Share link not found." } },
        { status: 404 }
      );
    }

    if (shareLink.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "Permission denied." } },
        { status: 403 }
      );
    }

    const updatedLink = await prisma.shareLink.update({
      where: { id },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        shareLink: serializeBigInt(updatedLink),
        message: "Share link has been revoked successfully.",
      },
    });
  } catch (err) {
    console.error("Revoke share link error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to revoke share link." } },
      { status: 500 }
    );
  }
}
