import { NextRequest, NextResponse } from "next/server";
import { DatabaseConnection } from "@/lib/db";
import { authenticate } from "@/middleware/auth.middleware";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await DatabaseConnection();

    // Verify JWT
    const authUser = await authenticate(request);

    // Find logged-in user
    const user = await User.findById(authUser.userId).select(
      "-password",
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Authenticated user",
        data: {
          user,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unauthorized",
      },
      { status: 401 },
    );
  }
}