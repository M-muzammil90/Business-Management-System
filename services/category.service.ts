import Category from "@/models/Category";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/validations/category.validation";

export async function createCategory(
  data: CreateCategoryInput,
  organizationId: string,
) {
  const existingCategory = await Category.findOne({
    name: data.name,
    organizationId,
  });

  if (existingCategory) {
    throw new Error(
      "A category with this name already exists in your organization",
    );
  }

  const category = await Category.create({
    ...data,
    organizationId,
  });

  return category;
}

export async function getCategories(
  organizationId: string,
  options?: {
    page?: number;
    limit?: number;
    search?: string;
  },
) {
  const page = Math.max(options?.page || 1, 1);
  const limit = Math.min(
    Math.max(options?.limit || 10, 1),
    100,
  );

  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {
    organizationId,
    isActive: true,
  };

  if (options?.search) {
    filter.name = {
      $regex: options.search.trim(),
      $options: "i",
    };
  }

  const [categories, totalCategories] =
    await Promise.all([
      Category.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Category.countDocuments(filter),
    ]);

  const totalPages = Math.ceil(
    totalCategories / limit,
  );

  return {
    categories,
    pagination: {
      page,
      limit,
      totalCategories,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getCategoryById(
  categoryId: string,
  organizationId: string,
) {
  const category = await Category.findOne({
    _id: categoryId,
    organizationId,
    isActive: true,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
}

export async function updateCategory(
  categoryId: string,
  data: UpdateCategoryInput,
  organizationId: string,
) {
  const category = await Category.findOne({
    _id: categoryId,
    organizationId,
    isActive: true,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  // Check duplicate category name
  if (
    data.name &&
    data.name.toLowerCase() !== category.name.toLowerCase()
  ) {
    const existingCategory = await Category.findOne({
      name: data.name,
      organizationId,
      _id: { $ne: categoryId },
      isActive: true,
    });

    if (existingCategory) {
      throw new Error(
        "A category with this name already exists in your organization",
      );
    }
  }

  Object.assign(category, data);

  await category.save();

  return category;
}

export async function deleteCategory(
  categoryId: string,
  organizationId: string,
) {
  const category = await Category.findOne({
    _id: categoryId,
    organizationId,
    isActive: true,
  });

  if (!category) {
    throw new Error("Category not found");
  }

  category.isActive = false;

  await category.save();

  return category;
}