import { NextRequest, NextResponse } from "next/server";
import { authenticateOrganization } from "@/middleware/organization.middleware";
import { createCategorySchema ,updateCategorySchema} from "@/validations/category.validation";
import { createCategory ,getCategories,getCategoryById,updateCategory,deleteCategory} from "@/services/category.service";

export async function createCategoryController(
  request: NextRequest,
) {
  try {
    const { organizationId } =
      await authenticateOrganization(request);

    const body = await request.json();

    const validation =
      createCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors:
            validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const category = await createCategory(
      validation.data,
      organizationId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: {
          category,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "Create Category Controller Error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    if (
      message.includes(
        "A category with this name already exists",
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

export async function getCategoriesController(
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

    const result = await getCategories(
      organizationId,
      {
        page,
        limit,
        search,
      },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Categories fetched successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Get Categories Controller Error:",
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

export async function getCategoryByIdController(
  request: NextRequest,
  categoryId: string,
) {
  try {
    const { organizationId } =
      await authenticateOrganization(request);

    const category = await getCategoryById(
      categoryId,
      organizationId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Category fetched successfully",
        data: {
          category,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Get Category By ID Controller Error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    if (message === "Category not found") {
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

export async function updateCategoryController(
  request: NextRequest,
  categoryId: string,
) {
  try {
    const { organizationId } =
      await authenticateOrganization(request);

    const body = await request.json();

    const validation =
      updateCategorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors:
            validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const category = await updateCategory(
      categoryId,
      validation.data,
      organizationId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully",
        data: {
          category,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Update Category Controller Error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    if (message === "Category not found") {
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
        "A category with this name already exists",
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

export async function deleteCategoryController(
  request: NextRequest,
  categoryId: string,
) {
  try {
    const { organizationId } =
      await authenticateOrganization(request);

    const category = await deleteCategory(
      categoryId,
      organizationId,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
        data: {
          category,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Delete Category Controller Error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    if (message === "Category not found") {
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