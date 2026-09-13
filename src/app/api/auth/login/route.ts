import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { AuthService } from "@/lib/auth";
import { INDIAN_PHONE_PATTERN, normalizeUsername } from "@/lib/auth-validation";

const failedAttempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = typeof body.identifier === "string" ? body.identifier.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const key = req.headers.get("x-forwarded-for") || "unknown";
    const attempt = failedAttempts.get(key);
    if (attempt && attempt.resetAt > Date.now() && attempt.count >= 10) {
      return NextResponse.json({ success: false, error: { code: "TOO_MANY_ATTEMPTS", message: "Too many login attempts. Please try again later." } }, { status: 429 });
    }

    const user = identifier.includes("@")
      ? await prisma.user.findUnique({ where: { email: identifier.toLowerCase() } })
      : INDIAN_PHONE_PATTERN.test(identifier)
        ? await prisma.user.findUnique({ where: { mobileNumber: identifier } })
        : await prisma.user.findUnique({ where: { username: normalizeUsername(identifier) } });
    const valid = Boolean(user?.passwordHash) && await bcrypt.compare(password, user?.passwordHash || "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalid");
    if (!user || !valid) {
      const next = attempt && attempt.resetAt > Date.now() ? { count: attempt.count + 1, resetAt: attempt.resetAt } : { count: 1, resetAt: Date.now() + 15 * 60 * 1000 };
      failedAttempts.set(key, next);
      return NextResponse.json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid username/phone number or password." } }, { status: 401 });
    }
    failedAttempts.delete(key);
    const token = AuthService.generateToken(user.id, user.mobileNumber);
    const response = NextResponse.json({ success: true, data: { user: { id: user.id, name: user.name, mobileNumber: user.mobileNumber, username: user.username } } });
    response.cookies.set("digivault_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 30 * 24 * 60 * 60, path: "/" });
    return response;
  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Authentication request failed.",
        },
      },
      { status: 500 }
    );
  }
}
