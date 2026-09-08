import { NextRequest } from "next/server";
import { DatabaseConnection } from "@/lib/db";
import {
  getProductByIdController,
  updateProductController,
    deleteProductController,
} from "@/controllers/product.controller";



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await DatabaseConnection();

    const { id } = await params;

    return await getProductByIdController(
      request,
      id,
    );
  } catch (error) {
    console.error("Get Product API Error:", error);

    return Response.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await DatabaseConnection();

    const { id } = await params;

    return await updateProductController(
      request,
      id,
    );
  } catch (error) {
    console.error("Update Product API Error:", error);

    return Response.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 },
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await DatabaseConnection();

    const { id } = await params;

    return await deleteProductController(
      request,
      id,
    );
  } catch (error) {
    console.error("Delete Product API Error:", error);

    return Response.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 },
    );
  }
}