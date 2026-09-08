import { NextRequest, NextResponse } from "next/server";
import {
  createProductSchema,
  updateProductSchema,
} from "@/validations/product.validation";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "@/services/product.service";

import { authenticateOrganization } from "@/middleware/organization.middleware";

export async function createProductController(request: NextRequest) {
  try {
    // 1. Authenticate user + get organization
    const { organizationId } = await authenticateOrganization(request);

    // 2. Get request body
    const body = await request.json();

    // 3. Validate request body
    const validation = createProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // 4. Create product
    const product = await createProduct(validation.data, organizationId);

    // 5. Response
    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully",
        data: {
          product,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create Product Controller Error:", error);

    const message =
      error instanceof Error ? error.message : "Something went wrong";

    // Duplicate SKU
    if (message.includes("A product with this SKU already exists")) {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 409 },
      );
    }

    // Authentication / organization errors
    if (
      message.includes("Authorization") ||
      message.includes("Token") ||
      message.includes("organization") ||
      message.includes("Organization")
    ) {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}

export async function getProductsController(request: NextRequest) {
  try {
    const { organizationId } = await authenticateOrganization(request);

    const products = await getProducts(organizationId);

    return NextResponse.json(
      {
        success: true,
        message: "Products fetched successfully",
        data: {
          products,
          count: products.length,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get Products Controller Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 401 },
    );
  }
}

export async function getProductByIdController(
  request: NextRequest,
  productId: string,
) {
  try {
    const { organizationId } = await authenticateOrganization(request);

    const product = await getProductById(productId, organizationId);

    return NextResponse.json(
      {
        success: true,
        message: "Product fetched successfully",
        data: {
          product,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Get Product By ID Controller Error:", error);

    const message =
      error instanceof Error ? error.message : "Something went wrong";

    if (message === "Product not found") {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 401 },
    );
  }
}

export async function updateProductController(
  request: NextRequest,
  productId: string,
) {
  try {
    const { organizationId } =
      await authenticateOrganization(request);

    const body = await request.json();

    const validation = updateProductSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const product = await updateProduct(
      productId,
      validation.data,
      organizationId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        data: {
          product,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Update Product Controller Error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    if (message === "Product not found") {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 404 },
      );
    }

    if (
      message.includes(
        "A product with this SKU already exists",
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 409 },
      );
    }

    if (
      message.includes("Authorization") ||
      message.includes("Token") ||
      message.includes("organization") ||
      message.includes("Organization")
    ) {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}


export async function deleteProductController(
  request: NextRequest,
  productId: string,
) {
  try {
    const { organizationId } =
      await authenticateOrganization(request);

    const product = await deleteProduct(
      productId,
      organizationId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
        data: {
          product,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Delete Product Controller Error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    if (
      message === "Product not found" ||
      message === "Product is already inactive"
    ) {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 404 },
      );
    }

    if (
      message.includes("Authorization") ||
      message.includes("Token") ||
      message.includes("organization") ||
      message.includes("Organization")
    ) {
      return NextResponse.json(
        {
          success: false,
          message,
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
