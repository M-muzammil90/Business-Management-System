import { NextRequest } from "next/server";
import { DatabaseConnection } from "@/lib/db";

import {
  createCustomerController,
  getCustomersController,
} from "@/controllers/customer.controller";

// =========================
// POST /api/customers
// =========================

export async function POST(request: NextRequest) {
  await DatabaseConnection();
  return createCustomerController(request);
}

// =========================
// GET /api/customers
// =========================

export async function GET(request: NextRequest) {
  await DatabaseConnection();
  return getCustomersController(request);
}

