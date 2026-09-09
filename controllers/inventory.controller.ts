import { NextRequest, NextResponse } from "next/server";

import { DatabaseConnection } from "@/lib/db";
import { authenticateOrganization } from "@/middleware/organization.middleware";

import {
  stockInSchema,
  stockOutSchema,
  stockAdjustmentSchema,
} from "@/validations/inventory.validation";

import {
  stockIn,
  stockOut,
  stockAdjustment,
  getInventoryHistory,
} from "@/services/inventory.service";

// import {
//  stockIn,
//   stockOut,
//   stockAdjustment,
// } from "@/services/inventory.service";


// =========================
// STOCK IN
// =========================

export async function stockInController(
  request: NextRequest,
) {
  try {
    await DatabaseConnection();

    const {
      user,
      organizationId,
    } = await authenticateOrganization(request);

    const body = await request.json();

    const validation = stockInSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await stockIn(
      validation.data,
      organizationId,
      user.userId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Stock added successfully",
        data: result,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Stock In Controller Error:",
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


// =========================
// STOCK OUT
// =========================

export async function stockOutController(
  request: NextRequest,
) {
  try {
    await DatabaseConnection();

    const {
      user,
      organizationId,
    } = await authenticateOrganization(request);

    const body = await request.json();

    const validation = stockOutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await stockOut(
      validation.data,
      organizationId,
      user.userId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Stock removed successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Stock Out Controller Error:",
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


// =========================
// STOCK ADJUSTMENT
// =========================

export async function stockAdjustmentController(
  request: NextRequest,
) {
  try {
    await DatabaseConnection();

    const {
      user,
      organizationId,
    } = await authenticateOrganization(request);

    const body = await request.json();

    const validation =
      stockAdjustmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await stockAdjustment(
      validation.data,
      organizationId,
      user.userId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Stock adjusted successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Stock Adjustment Controller Error:",
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

// =========================
// GET INVENTORY HISTORY
// =========================

export async function getInventoryHistoryController(
  request: NextRequest,
) {
  try {
    await DatabaseConnection();

    const {
      organizationId,
    } = await authenticateOrganization(request);

    const { searchParams } =
      new URL(request.url);

    const page =
      Number(searchParams.get("page")) || 1;

    const limit =
      Number(searchParams.get("limit")) || 10;

    const productId =
      searchParams.get("productId") || undefined;

    const typeParam =
      searchParams.get("type");

    const type =
      typeParam === "STOCK_IN" ||
      typeParam === "STOCK_OUT" ||
      typeParam === "ADJUSTMENT"
        ? typeParam
        : undefined;

    const result =
      await getInventoryHistory(
        organizationId,
        {
          page,
          limit,
          productId,
          type,
        },
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Inventory history fetched successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Get Inventory History Controller Error:",
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

