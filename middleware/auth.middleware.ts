import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export interface AuthUser {
  userId: string;
  organizationId?: string;
  role: "SUPER_ADMIN" | "USER";
}

export async function authenticate(
  request: NextRequest,
): Promise<AuthUser> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    throw new Error("Authorization header is missing");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new Error("Invalid authorization format");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new Error("Token is missing");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as AuthUser;

    return decoded;
  } catch {
    throw new Error("Invalid or expired token");
  }
}