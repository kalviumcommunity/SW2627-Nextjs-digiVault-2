import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma, serializeBigInt } from "@/lib/prisma";
import { AuthService } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await AuthService.getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { documentId, expiryOption, expiryHours } = body;

    if (!documentId) {
      return NextResponse.json(
        { success: false, error: { code: "MISSING_DOCUMENT_ID", message: "Document ID is required." } },
        { status: 400 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: { code: "NOT_FOUND", message: "Document not found." } },
        { status: 404 }
      );
    }

    if (document.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: { code: "FORBIDDEN", message: "You do not have permission to share this document." } },
        { status: 403 }
      );
    }

    // Determine expiry duration in hours (Default 24h)
    let durationHours = 24;
    if (expiryOption === "15m") durationHours = 0.25;
    else if (expiryOption === "1h") durationHours = 1;
    else if (expiryOption === "24h") durationHours = 24;
    else if (expiryOption === "7d") durationHours = 24 * 7;
    else if (expiryOption === "30d") durationHours = 24 * 30;
    else if (typeof expiryHours === "number" && expiryHours > 0) {
      durationHours = expiryHours;
    }

    const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

    // Generate secure random token and SHA-256 hash
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    const shareLink = await prisma.shareLink.create({
      data: {
        documentId: document.id,
        userId: user.id,
        token: rawToken,
        tokenHash,
        expiresAt,
        isActive: true,
      },
    });

    const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin || "http://localhost:3000";
    const shareUrl = `${origin}/share/${rawToken}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          shareLink: serializeBigInt(shareLink),
          token: rawToken,
          shareUrl,
          expiresAt: expiresAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create share link error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to generate share link." } },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await AuthService.getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const shareLinks = await prisma.shareLink.findMany({
      where: {
        userId: user.id,
      },
      orderBy: { createdAt: "desc" },
      include: {
        document: true,
      },
    });

    const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin || "http://localhost:3000";

    const formattedLinks = shareLinks.map((link: typeof shareLinks[0]) => ({
      ...serializeBigInt(link),
      shareUrl: `${origin}/share/${link.token}`,
      isExpired: new Date() > new Date(link.expiresAt),
    }));

    return NextResponse.json({
      success: true,
      data: {
        shareLinks: formattedLinks,
      },
    });
  } catch (err) {
    console.error("List share links error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch share links." } },
      { status: 500 }
    );
  }
}
