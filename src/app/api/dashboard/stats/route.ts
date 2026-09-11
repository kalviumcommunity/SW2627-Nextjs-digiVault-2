import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await AuthService.getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    const [totalDocuments, activeShareLinks, downloadsAggregate] = await Promise.all([
      prisma.document.count({
        where: { userId: user.id },
      }),
      prisma.shareLink.count({
        where: {
          userId: user.id,
          isActive: true,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
      }),
      prisma.document.aggregate({
        where: { userId: user.id },
        _sum: { downloadCount: true },
      }),
    ]);

    const totalDownloads = downloadsAggregate._sum.downloadCount || 0;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalDocuments,
          storageUsed: Number(user.storageUsed),
          storageLimit: Number(user.storageLimit),
          activeShareLinks,
          totalDownloads,
        },
        user: {
          id: user.id,
          name: user.name,
          fullName: user.fullName,
          dateOfBirth: user.dateOfBirth?.toISOString().slice(0, 10) ?? null,
          email: user.email,
          username: user.username,
          mobileNumber: user.mobileNumber,
          avatar: user.avatar,
        },
      },
    });
  } catch (err) {
    console.error("Fetch dashboard stats error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch dashboard stats." } },
      { status: 500 }
    );
  }
}
