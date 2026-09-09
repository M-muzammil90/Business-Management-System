import { NextRequest } from "next/server";
import { DatabaseConnection } from "@/lib/db";
import {
  getCategoryByIdController,
  updateCategoryController,
    deleteCategoryController,
} from "@/controllers/category.controller";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await DatabaseConnection();

    const { id } = await params;

    return await getCategoryByIdController(
      request,
      id,
    );
  } catch (error) {
    console.error(
      "Get Category By ID API Error:",
      error,
    );

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

    return await updateCategoryController(
      request,
      id,
    );
  } catch (error) {
    console.error(
      "Update Category API Error:",
      error,
    );

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

    return await deleteCategoryController(
      request,
      id,
    );
  } catch (error) {
    console.error(
      "Delete Category API Error:",
      error,
    );

    return Response.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 },
    );
  }
}