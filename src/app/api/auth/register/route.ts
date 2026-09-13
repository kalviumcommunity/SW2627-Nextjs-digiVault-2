import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { EMAIL_PATTERN, INDIAN_PHONE_PATTERN, isStrongPassword, isValidDateOfBirth, normalizeEmail, normalizeUsername, USERNAME_PATTERN } from "@/lib/auth-validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const dateOfBirth = typeof body.dateOfBirth === "string" ? body.dateOfBirth : "";
    const email = normalizeEmail(typeof body.email === "string" ? body.email : "");
    const mobileNumber = typeof body.phoneNumber === "string" ? body.phoneNumber.replace(/\D/g, "") : "";
    const username = normalizeUsername(typeof body.username === "string" ? body.username : "");
    const password = typeof body.password === "string" ? body.password : "";

    if (!fullName) return error("Please enter your full name.");
    if (!isValidDateOfBirth(dateOfBirth)) return error("Please enter a valid date of birth.");
    if (!EMAIL_PATTERN.test(email)) return error("Please enter a valid email address.");
    if (!INDIAN_PHONE_PATTERN.test(mobileNumber)) return error("Please enter a valid Indian phone number.");
    if (!USERNAME_PATTERN.test(username)) return error("Username must be 3-30 characters using letters, numbers, or underscores.");
    if (!isStrongPassword(password)) return error("Password must be at least 8 characters and include letters, numbers, and a special character.");

    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { mobileNumber }, { username }] }, select: { email: true, mobileNumber: true, username: true } });
    if (existing?.email === email) return error("Email address is already registered.", 409);
    if (existing?.mobileNumber === mobileNumber) return error("Phone number is already registered.", 409);
    if (existing?.username === username) return error("Username is already taken.", 409);

    const passwordHash = await bcrypt.hash(password, 12);
    const initials = fullName.split(/\s+/).map((part: string) => part[0]).join("").slice(0, 2).toUpperCase();
    await prisma.user.create({
      data: {
        name: fullName,
        fullName,
        dateOfBirth: new Date(`${dateOfBirth}T00:00:00.000Z`),
        email,
        mobileNumber,
        username,
        passwordHash,
        avatar: initials,
        folders: { create: [{ name: "Documents" }, { name: "Education" }, { name: "Health" }, { name: "Identity" }, { name: "Finance" }] },
      },
    });
    return NextResponse.json({ success: true, data: { message: "Account created successfully." } }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ success: false, error: { code: "REGISTRATION_FAILED", message: "Unable to create account." } }, { status: 500 });
  }
}

function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message } }, { status });
}