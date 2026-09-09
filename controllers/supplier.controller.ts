import { NextRequest, NextResponse } from "next/server";

import { authenticateOrganization } from "@/middleware/organization.middleware";
import { DatabaseConnection } from "@/lib/db";
import {
  createSupplierSchema,
  updateSupplierSchema,
} from "@/validations/supplier.validation";

import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "@/services/supplier.service";

// =========================
// CREATE SUPPLIER
// =========================

export async function createSupplierController(
  request: NextRequest,
) {
  try {
    await DatabaseConnection();
    const { organizationId } =
      await authenticateOrganization(request);

    const body = await request.json();

    const validation =
      createSupplierSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const supplier = await createSupplier(
      validation.data,
      organizationId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Supplier created successfully",
        data: {
          supplier,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Create Supplier Controller Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 401 },
    );
  }
}

// =========================
// GET ALL SUPPLIERS
// =========================

export async function getSuppliersController(
  request: NextRequest,
) {
  try {
    const { organizationId } =
      await authenticateOrganization(request);

    const { searchParams } =
      new URL(request.url);

    const page =
      Number(searchParams.get("page")) || 1;

    const limit =
      Number(searchParams.get("limit")) || 10;

    const search =
      searchParams.get("search") || undefined;

    const city =
      searchParams.get("city") || undefined;

    const result = await getSuppliers(
      organizationId,
      {
        page,
        limit,
        search,
        city,
      },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Suppliers fetched successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Get Suppliers Controller Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 401 },
    );
  }
}

// =========================
// GET SUPPLIER BY ID
// =========================

export async function getSupplierByIdController(
  request: NextRequest,
  supplierId: string,
) {
  try {
    const { organizationId } =
      await authenticateOrganization(request);

    const supplier = await getSupplierById(
      supplierId,
      organizationId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Supplier fetched successfully",
        data: {
          supplier,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Get Supplier Controller Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 404 },
    );
  }
}

// =========================
// UPDATE SUPPLIER
// =========================

export async function updateSupplierController(
  request: NextRequest,
  supplierId: string,
) {
  try {
    const { organizationId } =
      await authenticateOrganization(request);

    const body = await request.json();

    const validation =
      updateSupplierSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten(),
        },
        { status: 400 },
      );
    }

    const supplier = await updateSupplier(
      supplierId,
      validation.data,
      organizationId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Supplier updated successfully",
        data: {
          supplier,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Update Supplier Controller Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 404 },
    );
  }
}

// =========================
// DELETE SUPPLIER
// =========================

export async function deleteSupplierController(
  request: NextRequest,
  supplierId: string,
) {
  try {
    const { organizationId } =
      await authenticateOrganization(request);

    const supplier = await deleteSupplier(
      supplierId,
      organizationId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Supplier deleted successfully",
        data: {
          supplier,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Delete Supplier Controller Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 404 },
    );
  }
}

