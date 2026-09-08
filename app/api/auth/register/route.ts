import { NextRequest } from "next/server";
import { DatabaseConnection } from "@/lib/db";
import { registerController } from "@/controllers/auth.controller";

export async function POST(request: NextRequest) {
  try {
    await DatabaseConnection();

    return await registerController(request);
  } catch (error) {
    console.error("Register API Error:", error);

    return Response.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 },
    );
  }
}