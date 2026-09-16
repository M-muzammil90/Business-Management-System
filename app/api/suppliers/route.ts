
import { NextRequest } from "next/server";
import { DatabaseConnection } from "@/lib/db";

import {
  createSupplierController,
  getSuppliersController,
} from "@/controllers/supplier.controller";

// =========================
// POST /api/suppliers
// =========================

export async function POST(request: NextRequest) {
  await DatabaseConnection();
  return createSupplierController(request);
}

// =========================
// GET /api/suppliers
// =========================

export async function GET(request: NextRequest) {
  await DatabaseConnection();
  return getSuppliersController(request);
}

