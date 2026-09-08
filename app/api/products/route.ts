import { NextRequest } from "next/server";
import { DatabaseConnection } from "@/lib/db";
import {
  createProductController,
  getProductsController,
} from "@/controllers/product.controller";

export async function POST(request: NextRequest) {
  try {
    await DatabaseConnection();

    return await createProductController(request);
  } catch (error) {
    console.error("Product POST API Error:", error);

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

    return await getProductsController(request);
  } catch (error) {
    console.error("Product GET API Error:", error);

    return Response.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 },
    );
  }
}