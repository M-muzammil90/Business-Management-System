import { NextRequest } from "next/server";
import { DatabaseConnection } from "@/lib/db";

import {
  getOrderByIdController,
  updateOrderController,
} from "@/controllers/order.controller";

// ========================================
// GET /api/orders/:id
// ========================================

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  await DatabaseConnection();
  const { id } = await params;

  return getOrderByIdController(
    request,
    id,
  );
}

// ========================================
// PUT /api/orders/:id
// ========================================

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  await DatabaseConnection();
  const { id } = await params;

  return updateOrderController(
    request,
    id,
  );
}