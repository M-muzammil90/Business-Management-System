import { NextRequest } from "next/server";

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
  const { id } = await params;

  return deleteSupplierController(
    request,
    id,
  );
}
