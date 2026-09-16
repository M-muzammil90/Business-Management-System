import {
  NextRequest,
  NextResponse,
} from "next/server";

import { DatabaseConnection } from "@/lib/db";

import { authenticateAdmin } from "@/middleware/admin.middleware";

import { getSalesAnalytics } from "@/services/analytics.service";

export async function getSalesAnalyticsController(
  request: NextRequest,
) {
  try {
    await DatabaseConnection();

    const { organizationId } = await authenticateAdmin(request);

    const analytics =
      await getSalesAnalytics(
        organizationId,
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Sales analytics fetched successfully",
        data: analytics,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Sales Analytics Controller Error:",
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