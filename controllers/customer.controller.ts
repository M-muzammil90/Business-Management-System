
import { NextRequest, NextResponse } from "next/server";

import { authenticateOrganization } from "@/middleware/organization.middleware";

import {
  createCustomerSchema,
  updateCustomerSchema,
} from "@/validations/customer.validation";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "@/services/customer.service";


// =========================
// CREATE CUSTOMER
// =========================

export async function createCustomerController(
  request: NextRequest,
) {
  try {
    // Authenticate user + get organization
    const { organizationId } =
      await authenticateOrganization(request);

    // Get request body
    const body = await request.json();

    // Validate body
    const validation =
      createCustomerSchema.safeParse(body);

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

    // Create customer
    const customer = await createCustomer(
      validation.data,
      organizationId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Customer created successfully",
        data: {
          customer,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Create Customer Controller Error:",
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
// GET ALL CUSTOMERS
// =========================

export async function getCustomersController(
  request: NextRequest,
) {
  try {
    // Authenticate user + organization
    const { organizationId } =
      await authenticateOrganization(request);

    const { searchParams } =
      new URL(request.url);

    // Pagination
    const page =
      Number(searchParams.get("page")) || 1;

    const limit =
      Number(searchParams.get("limit")) || 10;

    // Search
    const search =
      searchParams.get("search") || undefined;

    // City filter
    const city =
      searchParams.get("city") || undefined;

    // Get customers
    const result = await getCustomers(
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
        message: "Customers fetched successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Get Customers Controller Error:",
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
// GET CUSTOMER BY ID
// =========================

export async function getCustomerByIdController(
  request: NextRequest,
  customerId: string,
) {
  try {
    // Authenticate user + organization
    const { organizationId } =
      await authenticateOrganization(request);

    // Get customer
    const customer = await getCustomerById(
      customerId,
      organizationId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Customer fetched successfully",
        data: {
          customer,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Get Customer Controller Error:",
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
// UPDATE CUSTOMER
// =========================

export async function updateCustomerController(
  request: NextRequest,
  customerId: string,
) {
  try {
    // Authenticate user + organization
    const { organizationId } =
      await authenticateOrganization(request);

    // Get request body
    const body = await request.json();

    // Validate body
    const validation =
      updateCustomerSchema.safeParse(body);

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

    // Update customer
    const customer = await updateCustomer(
      customerId,
      validation.data,
      organizationId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Customer updated successfully",
        data: {
          customer,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Update Customer Controller Error:",
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
// DELETE CUSTOMER
// =========================

export async function deleteCustomerController(
  request: NextRequest,
  customerId: string,
) {
  try {
    // Authenticate user + organization
    const { organizationId } =
      await authenticateOrganization(request);

    // Soft delete customer
    const customer = await deleteCustomer(
      customerId,
      organizationId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Customer deleted successfully",
        data: {
          customer,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Delete Customer Controller Error:",
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
