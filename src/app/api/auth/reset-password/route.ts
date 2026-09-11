import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isStrongPassword } from "@/lib/auth-validation";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (typeof token !== "string" || !isStrongPassword(password || "")) {
      return NextResponse.json({ success: false, error: { code: "INVALID_RESET", message: "Use a valid reset link and a stronger password." } }, { status: 400 });
    }
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const reset = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!reset || reset.usedAt || reset.expiresAt <= new Date()) {
      return NextResponse.json({ success: false, error: { code: "RESET_EXPIRED", message: "This reset link is invalid or expired." } }, { status: 400 });
    }
    await prisma.$transaction([
      prisma.user.update({ where: { id: reset.userId }, data: { passwordHash: await bcrypt.hash(password, 12) } }),
      prisma.passwordResetToken.update({ where: { id: reset.id }, data: { usedAt: new Date() } }),
    ]);
    return NextResponse.json({ success: true, data: { message: "Password reset successfully." } });
  } catch {
    return NextResponse.json({ success: false, error: { code: "RESET_FAILED", message: "Unable to reset password." } }, { status: 500 });
  }
}