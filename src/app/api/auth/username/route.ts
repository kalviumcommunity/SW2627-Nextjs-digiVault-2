import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeUsername, USERNAME_PATTERN } from "@/lib/auth-validation";

export async function GET(req: NextRequest) {
  const username = normalizeUsername(new URL(req.url).searchParams.get("username") || "");
  if (!USERNAME_PATTERN.test(username)) {
    return NextResponse.json({ success: true, data: { available: false, valid: false } });
  }
  const user = await prisma.user.findUnique({ where: { username }, select: { id: true } });
  return NextResponse.json({ success: true, data: { available: !user, valid: true } });
}