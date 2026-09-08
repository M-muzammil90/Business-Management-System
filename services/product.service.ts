import Product from "@/models/Product";
import {
  CreateProductInput,
  UpdateProductInput,
} from "@/validations/product.validation";

export async function createProduct(
  data: CreateProductInput,
  organizationId: string,
) {
  const existingProduct = await Product.findOne({
    sku: data.sku,
    organizationId,
  });

  if (existingProduct) {
    throw new Error(
      "A product with this SKU already exists in your organization",
    );
  }

  const product = await Product.create({
    ...data,
    organizationId,
  });

  return product;
}

// GET ALL PRODUCTS
export async function getProducts(
  organizationId: string,
  options?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    stockStatus?: "inStock" | "outOfStock";
    sortBy?: "createdAt" | "name" | "price" | "stock";
    sortOrder?: "asc" | "desc";
  },
) {
  const page = Math.max(options?.page || 1, 1);
  const limit = Math.min(Math.max(options?.limit || 10, 1), 100);

  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {
    organizationId,
    isActive: true,
  };

  // Search
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

  // Category
  if (options?.category) {
    filter.category = options.category;
  }

  // Minimum price
  if (options?.minPrice !== undefined) {
    filter.price = {
      ...filter.price,
      $gte: options.minPrice,
    };
  }

  // Maximum price
  if (options?.maxPrice !== undefined) {
    filter.price = {
      ...filter.price,
      $lte: options.maxPrice,
    };
  }

  // Stock status
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

  // Sorting
  const sortBy = options?.sortBy || "createdAt";
  const sortOrder = options?.sortOrder === "asc" ? 1 : -1;

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .sort({
        [sortBy]: sortOrder,
      })
      .skip(skip)
      .limit(limit),

    Product.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalProducts / limit);

  return {
    products,
    pagination: {
      page,
      limit,
      totalProducts,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export async function getProductById(
  productId: string,
  organizationId: string,
) {
  const product = await Product.findOne({
    _id: productId,
    organizationId,
    isActive: true,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

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

  // If SKU is being changed, check duplicate SKU
  if (data.sku && data.sku !== product.sku) {
    const existingProduct = await Product.findOne({
      sku: data.sku,
      organizationId,
      _id: { $ne: productId },
    });

    if (existingProduct) {
      throw new Error(
        "A product with this SKU already exists in your organization",
      );
    }
  }

  // Update product
  Object.assign(product, data);

  await product.save();

  return product;
}

export async function deleteProduct(
  productId: string,
  organizationId: string,
) {
  const product = await Product.findOne({
    _id: productId,
    organizationId,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (!product.isActive) {
    throw new Error("Product is already inactive");
  }

  product.isActive = false;

  await product.save();

  return product;
}
