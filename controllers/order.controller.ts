import { NextRequest, NextResponse } from "next/server";

import { DatabaseConnection } from "@/lib/db";

import { authenticateOrganization } from "@/middleware/organization.middleware";

import {
  createOrderSchema,
  updateOrderSchema,
} from "@/validations/order.validation";

import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
} from "@/services/order.service";

// ========================================
// CREATE ORDER
// ========================================

export async function createOrderController(request: NextRequest) {
  try {
    await DatabaseConnection();

    const { user, organizationId } = await authenticateOrganization(request);

    const body = await request.json();

    const validation = createOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    const order = await createOrder(
      validation.data,
      organizationId,
      user.userId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        data: {
          order,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Create Order Controller Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      {
        status: 400,
      },
    );
  }
}

// ========================================
// GET ALL ORDERS
// ========================================

export async function getOrdersController(request: NextRequest) {
  try {
    await DatabaseConnection();

    const { organizationId } = await authenticateOrganization(request);

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;

    const limit = Number(searchParams.get("limit")) || 10;

    const search = searchParams.get("search") || undefined;

    const orderStatus = searchParams.get("orderStatus") || undefined;

    const paymentStatus = searchParams.get("paymentStatus") || undefined;

    const result = await getOrders(organizationId, {
      page,
      limit,
      search,
      orderStatus,
      paymentStatus,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Orders fetched successfully",
        data: result,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Get Orders Controller Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      {
        status: 400,
      },
    );
  }
}

// ========================================
// GET ORDER BY ID
// ========================================

export async function getOrderByIdController(
  request: NextRequest,
  orderId: string,
) {
  try {
    await DatabaseConnection();

    const { organizationId } = await authenticateOrganization(request);

    const order = await getOrderById(orderId, organizationId);

    return NextResponse.json(
      {
        success: true,
        message: "Order fetched successfully",
        data: {
          order,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Get Order Controller Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      {
        status: 400,
      },
    );
  }
}

// ========================================
// UPDATE ORDER
// ========================================

export async function updateOrderController(
  request: NextRequest,
  orderId: string,
) {
  try {
    await DatabaseConnection();

    const { organizationId } = await authenticateOrganization(request);

    const body = await request.json();

    const validation = updateOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    const order = await updateOrder(orderId, validation.data, organizationId);

    return NextResponse.json(
      {
        success: true,
        message: "Order updated successfully",
        data: {
          order,
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Update Order Controller Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      {
        status: 400,
      },
    );
  }
}
