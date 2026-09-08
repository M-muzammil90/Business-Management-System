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
export async function getProducts(organizationId: string) {
  const products = await Product.find({
    organizationId,
  }).sort({
    createdAt: -1,
  });

  return products;
}

export async function getProductById(
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
