import { NextRequest } from "next/server";
import { DatabaseConnection } from "@/lib/db";
import { loginController } from "@/controllers/auth.controller";

export async function POST(request: NextRequest) {
  try {
    await DatabaseConnection();

    return await loginController(request);
  } catch (error) {
    console.error("Login API Error:", error);

    return Response.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 },
    );
  }
}