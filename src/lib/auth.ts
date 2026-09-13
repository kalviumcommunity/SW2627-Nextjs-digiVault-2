import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "digivault_production_secure_jwt_secret_key_2026";

export interface AuthPayload {
  userId: string;
  mobileNumber: string;
}

export class AuthService {
  /**
   * Generates a signed JWT session token for a user
   */
  static generateToken(userId: string, mobileNumber: string): string {
    return jwt.sign({ userId, mobileNumber }, JWT_SECRET, { expiresIn: "30d" });
  }

  /**
   * Verifies a JWT token and returns payload
   */
  static verifyToken(token: string): AuthPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as AuthPayload;
    } catch {
      return null;
    }
  }

  /**
   * Extracts the current authenticated user from request cookies or Authorization header
   */
  static async getAuthUser(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const cookieToken = req.cookies.get("digivault_session")?.value;

    let token = cookieToken;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }

    if (token) {
      const payload = this.verifyToken(token);
      if (payload) {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
        });
        if (user) return user;
      }
    }
    return null;
  }
}
