import {
  NextRequest,
  NextResponse,
} from "next/server";

import { DatabaseConnection } from "@/lib/db";

import { authenticateOrganization } from "@/middleware/organization.middleware";

import { getDashboardStats } from "@/services/dashboard.service";

export async function getDashboardStatsController(
  request: NextRequest,
) {
  try {
    await DatabaseConnection();

    const { organizationId } =
      await authenticateOrganization(request);

    const stats = await getDashboardStats(
      organizationId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Dashboard stats fetched successfully",
        data: stats,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Dashboard Stats Controller Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 400 },
    );
  }
}