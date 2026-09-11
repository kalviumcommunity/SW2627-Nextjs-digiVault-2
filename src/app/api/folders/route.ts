import { NextRequest, NextResponse } from "next/server";
import { prisma, serializeBigInt } from "@/lib/prisma";
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

    const folders = await prisma.folder.findMany({
      where: { userId: user.id },
      include: {
        _count: {
          select: { documents: true },
        },
      },
      orderBy: { name: "asc" },
    });

    const formattedFolders = folders.map((f) => ({
      ...serializeBigInt(f),
      documentCount: f._count.documents,
    }));

    return NextResponse.json({
      success: true,
      data: {
        folders: formattedFolders,
      },
    });
  } catch (err) {
    console.error("List folders error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch folders." } },
      { status: 500 }
    );
  }
}

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
    const { name, parentFolderId } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_FOLDER_NAME", message: "Folder name is required." } },
        { status: 400 }
      );
    }

    const folder = await prisma.folder.create({
      data: {
        userId: user.id,
        name: name.trim(),
        parentFolderId: parentFolderId || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          folder: serializeBigInt(folder),
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create folder error:", err);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_SERVER_ERROR", message: "Failed to create folder." } },
      { status: 500 }
    );
  }
}
