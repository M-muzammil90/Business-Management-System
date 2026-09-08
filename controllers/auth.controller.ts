import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/validations/auth.validation";
import { registerUser } from "@/services/auth.service";
import { loginSchema } from "@/validations/auth.validation";
import { loginUser } from "@/services/auth.service";
export async function registerController(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validation = registerSchema.safeParse(body);

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

    // Register user
    const result = await registerUser(validation.data);

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data: result,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Register Controller Error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 500 },
    );
  }
}

export async function loginController(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate
    const validation = loginSchema.safeParse(body);

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

    // Login
    const result = await loginUser(validation.data);

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Login Controller Error:", error);

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