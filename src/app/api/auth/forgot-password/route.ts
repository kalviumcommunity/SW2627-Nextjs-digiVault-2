import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json();
    const value = typeof identifier === "string" ? identifier.trim().toLowerCase() : "";
    const user = await prisma.user.findFirst({ where: { OR: [{ email: value }, { username: value }, { mobileNumber: value }] } });
    if (!user) return NextResponse.json({ success: true, data: { message: "If an account matches, a reset link has been created." } });

    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } });
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt: new Date(Date.now() + 15 * 60 * 1000) } });
    return NextResponse.json({ success: true, data: { message: "Reset link created.", resetToken: process.env.NODE_ENV === "production" ? undefined : token } });
  } catch {
    return NextResponse.json({ success: false, error: { code: "RESET_REQUEST_FAILED", message: "Unable to start password reset." } }, { status: 500 });
  }
}