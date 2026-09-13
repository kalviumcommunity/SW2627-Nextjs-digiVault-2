import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma, serializeBigInt } from "@/lib/prisma";
import { AuthService } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await AuthService.getAuthUser(req);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Authentication required." },
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") || undefined;
    const limitParam = parseInt(searchParams.get("limit") || "10", 10);
    const limit = Math.min(Math.max(isNaN(limitParam) ? 10 : limitParam, 1), 50);

    const category = searchParams.get("category") || undefined;
    const folderId = searchParams.get("folderId") || undefined;
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "newest";

    // Build filter clause
    const where: any = {
      userId: user.id,
    };

    if (category && category !== "All") {
      where.category = category;
    }

    if (folderId) {
      where.folderId = folderId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { fileName: { contains: search } },
      ];
    }

    // Build orderBy clause
    let orderBy: any = { uploadedAt: "desc" };
    if (sortBy === "oldest") {
      orderBy = { uploadedAt: "asc" };
    } else if (sortBy === "name_asc") {
      orderBy = { name: "asc" };
    } else if (sortBy === "name_desc") {
      orderBy = { name: "desc" };
    } else if (sortBy === "size") {
      orderBy = { fileSize: "desc" };
    }

    // Fetch limit + 1 items to determine nextCursor
    const documents = await prisma.document.findMany({
      where,
      take: limit + 1,
      ...(cursor
        ? {
            cursor: { id: cursor },
            skip: 1,
          }
        : {}),
      orderBy,
      include: {
        folder: {
          select: { id: true, name: true },
        },
      },
    });

    let nextCursor: string | null = null;
    if (documents.length > limit) {
      documents.pop();
      nextCursor = documents[documents.length - 1].id;
    }

    const totalCount = await prisma.document.count({ where });

    return NextResponse.json({
      success: true,
      data: {
        documents: serializeBigInt(documents),
        nextCursor,
        totalCount,
      },
    });
  } catch (err) {
    console.error("List documents error:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch document list.",
        },
      },
      { status: 500 }
    );
  }
}
