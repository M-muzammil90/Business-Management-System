import { NextRequest } from "next/server";
import { DatabaseConnection } from "@/lib/db";

import {
  getSupplierByIdController,
  updateSupplierController,
  deleteSupplierController,
} from "@/controllers/supplier.controller";

// =========================
// GET /api/suppliers/:id
// =========================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await DatabaseConnection();
  const { id } = await params;

  return getSupplierByIdController(
    request,
    id,
  );
}

// =========================
// PUT /api/suppliers/:id
// =========================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await DatabaseConnection();
  const { id } = await params;

  return updateSupplierController(
    request,
    id,
  );
}

// =========================
// DELETE /api/suppliers/:id
// =========================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await DatabaseConnection();
  const { id } = await params;

  return deleteSupplierController(
    request,
    id,
  );
}
