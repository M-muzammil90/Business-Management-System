
import { NextRequest } from "next/server";

import {
  createSupplierController,
  getSuppliersController,
} from "@/controllers/supplier.controller";

// =========================
// POST /api/suppliers
// =========================

export async function POST(request: NextRequest) {
  return createSupplierController(request);
}

// =========================
// GET /api/suppliers
// =========================

export async function GET(request: NextRequest) {
  return getSuppliersController(request);
}

