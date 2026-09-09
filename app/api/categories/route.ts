import { NextRequest } from "next/server";
import { DatabaseConnection } from "@/lib/db";
import {
  createCategoryController,
  getCategoriesController,
} from "@/controllers/category.controller";

export async function POST(request: NextRequest) {
  try {
    await DatabaseConnection();

    return await createCategoryController(request);
  } catch (error) {
    console.error(
      "Category POST API Error:",
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

export async function GET(request: NextRequest) {
  try {
    await DatabaseConnection();

    return await getCategoriesController(request);
  } catch (error) {
    console.error(
      "Category GET API Error:",
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