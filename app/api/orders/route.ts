import { NextRequest } from "next/server";
import { DatabaseConnection } from "@/lib/db";

import {
  createOrderController,
  getOrdersController,
} from "@/controllers/order.controller";

// ========================================
// POST /api/orders
// ========================================

export async function POST(
  request: NextRequest,
) {
  await DatabaseConnection();
  return createOrderController(
    request,
  );
}

// ========================================
// GET /api/orders
// ========================================

export async function GET(
  request: NextRequest,
) {
  await DatabaseConnection();
  return getOrdersController(
    request,
  );
}