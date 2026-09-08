import { NextRequest } from "next/server";
import { DatabaseConnection } from "@/lib/db";
import { getMyOrganizationController } from "@/controllers/organization.controller";

export async function GET(request: NextRequest) {
  try {
    await DatabaseConnection();

    return await getMyOrganizationController(request);
  } catch (error) {
    console.error("Organization API Error:", error);

    return Response.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 },
    );
  }
}