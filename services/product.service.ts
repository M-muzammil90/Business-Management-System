
import Product from "@/models/Product";
import Category from "@/models/Category";
import {
  CreateProductInput,
  UpdateProductInput,
} from "@/validations/product.validation";

// =====================================================
// CREATE PRODUCT
// =====================================================

export async function createProduct(
  data: CreateProductInput,
  organizationId: string,
) {
  // Check category belongs to current organization
  if (data.categoryId) {
    const category = await Category.findOne({
      _id: data.categoryId,
      organizationId,
      isActive: true,
    });
    console.log("========== PRODUCT DEBUG ==========");
  console.log("CATEGORY ID:", data.categoryId);
  console.log("ORGANIZATION ID:", organizationId);

    if (!category) {
      throw new Error("Category not found");
    }
  }

  // Check duplicate SKU inside same organization
  const existingProduct = await Product.findOne({
    sku: data.sku,
    organizationId,
  });

  if (existingProduct) {
    throw new Error(
      "A product with this SKU already exists in your organization",
    );
  }

  // Create product
  const product = await Product.create({
    ...data,
    organizationId,
  });

  // Return product with category
  return await Product.findById(product._id).populate(
    "categoryId",
    "name description",
  );
}

// =====================================================
// GET ALL PRODUCTS
// =====================================================

export async function getProducts(
  organizationId: string,
  options?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    stockStatus?: "inStock" | "outOfStock";
    sortBy?: "createdAt" | "name" | "price" | "stock";
    sortOrder?: "asc" | "desc";
  },
) {
  // Pagination
  const page = Math.max(options?.page || 1, 1);

  const limit = Math.min(
    Math.max(options?.limit || 10, 1),
    100,
  );

  const skip = (page - 1) * limit;

  // Base filter
  const filter: Record<string, any> = {
    organizationId,
    isActive: true,
  };

  // ===================================================
  // SEARCH
  // ===================================================

  if (options?.search) {
    const search = options.search.trim();

    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        sku: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // ===================================================
  // CATEGORY FILTER
  // ===================================================

  if (options?.categoryId) {
    filter.categoryId = options.categoryId;
  }

  // ===================================================
  // MINIMUM PRICE
  // ===================================================

  if (options?.minPrice !== undefined) {
    filter.price = {
      ...filter.price,
      $gte: options.minPrice,
    };
  }

  // ===================================================
  // MAXIMUM PRICE
  // ===================================================

  if (options?.maxPrice !== undefined) {
    filter.price = {
      ...filter.price,
      $lte: options.maxPrice,
    };
  }

  // ===================================================
  // STOCK STATUS
  // ===================================================

  if (options?.stockStatus === "inStock") {
    filter.stock = {
      $gt: 0,
    };
  }

  if (options?.stockStatus === "outOfStock") {
    filter.stock = {
      $eq: 0,
    };
  }

  // ===================================================
  // SORTING
  // ===================================================

  const sortBy = options?.sortBy || "createdAt";

  const sortOrder =
    options?.sortOrder === "asc" ? 1 : -1;

  // ===================================================
  // GET PRODUCTS + COUNT
  // ===================================================

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .populate("categoryId", "name description")
      .sort({
        [sortBy]: sortOrder,
      })
      .skip(skip)
      .limit(limit),

    Product.countDocuments(filter),
  ]);

  // Total pages
  const totalPages = Math.ceil(
    totalProducts / limit,
  );

  return {
    products,

    pagination: {
      page,
      limit,
      totalProducts,
      totalPages,

      hasNextPage:
        page < totalPages,

      hasPreviousPage:
        page > 1,
    },
  };
}

// =====================================================
// GET PRODUCT BY ID
// =====================================================

export async function getProductById(
  productId: string,
  organizationId: string,
) {
  const product = await Product.findOne({
    _id: productId,
    organizationId,
    isActive: true,
  }).populate(
    "categoryId",
    "name description",
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

// =====================================================
// UPDATE PRODUCT
// =====================================================

export async function updateProduct(
  productId: string,
  data: UpdateProductInput,
  organizationId: string,
) {
  // Check product belongs to current organization
  const product = await Product.findOne({
    _id: productId,
    organizationId,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // ===================================================
  // CHECK CATEGORY
  // ===================================================

  if (data.categoryId) {
    const category = await Category.findOne({
      _id: data.categoryId,
      organizationId,
      isActive: true,
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  // ===================================================
  // CHECK DUPLICATE SKU
  // ===================================================

  if (data.sku && data.sku !== product.sku) {
    const existingProduct = await Product.findOne({
      sku: data.sku,
      organizationId,
      _id: {
        $ne: productId,
      },
    });

    if (existingProduct) {
      throw new Error(
        "A product with this SKU already exists in your organization",
      );
    }
  }

  // ===================================================
  // UPDATE PRODUCT
  // ===================================================

  Object.assign(product, data);

  await product.save();

  // Return updated product with category
  return await Product.findById(product._id).populate(
    "categoryId",
    "name description",
  );
}

// =====================================================
// DELETE PRODUCT
// =====================================================

export async function deleteProduct(
  productId: string,
  organizationId: string,
) {
  // Check product belongs to current organization
  const product = await Product.findOne({
    _id: productId,
    organizationId,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Already inactive
  if (!product.isActive) {
    throw new Error("Product is already inactive");
  }

  // Soft delete
  product.isActive = false;

  await product.save();

  return product;
}

