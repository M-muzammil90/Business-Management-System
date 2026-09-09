import { NextRequest } from "next/server";

import {
  createCustomerController,
  getCustomersController,
} from "@/controllers/customer.controller";

// =========================
// POST /api/customers
// =========================

export async function POST(request: NextRequest) {
  return createCustomerController(request);
}

// =========================
// GET /api/customers
// =========================

export async function GET(request: NextRequest) {
  return getCustomersController(request);
}

