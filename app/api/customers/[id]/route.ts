import { NextRequest } from "next/server";
import { DatabaseConnection } from "@/lib/db";

import {
  getCustomerByIdController,
  updateCustomerController,
  deleteCustomerController,
} from "@/controllers/customer.controller";

// =========================
// GET /api/customers/:id
// =========================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await DatabaseConnection();
  const { id } = await params;

  return getCustomerByIdController(
    request,
    id,
  );
}

// =========================
// PUT /api/customers/:id
// =========================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await DatabaseConnection();
  const { id } = await params;

  return updateCustomerController(
    request,
    id,
  );
}

// =========================
// DELETE /api/customers/:id
// =========================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await DatabaseConnection();
  const { id } = await params;

  return deleteCustomerController(
    request,
    id,
  );
}

