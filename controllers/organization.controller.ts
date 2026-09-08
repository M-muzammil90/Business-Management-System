import { NextRequest, NextResponse } from "next/server";
import { authenticateOrganization } from "@/middleware/organization.middleware";
import { getOrganizationById } from "@/services/organization.service";

export async function getMyOrganizationController(
  request: NextRequest,
) {
  try {
    const { organizationId } =
      await authenticateOrganization(request);

    const organization =
      await getOrganizationById(organizationId);

    return NextResponse.json(
      {
        success: true,
        message: "Organization fetched successfully",
        data: {
          organization,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Get Organization Controller Error:",
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
      { status: 401 },
    );
  }
}