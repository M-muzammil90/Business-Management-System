import Product from "@/models/Product";
import Inventory from "@/models/Inventory";
import {
  StockInInput,
  StockOutInput,
  StockAdjustmentInput,
   
} from "@/validations/inventory.validation";


// =========================
// STOCK IN
// =========================
export async function stockIn(
  data: StockInInput,
  organizationId: string,
  userId: string,
) {
  console.log("========== STOCK IN DEBUG ==========");
  console.log("Product ID:", data.productId);
  console.log("Organization ID:", organizationId);
  console.log("User ID:", userId);

  const product = await Product.findOne({
    _id: data.productId,
    organizationId,
    isActive: true,
  });

  console.log("Found Product:", product);

  if (!product) {
    throw new Error("Product not found");
  }

   const previousStock = product.stock;

  product.stock += data.quantity;

  await product.save();

  const inventory = await Inventory.create({
    productId: product._id,
    organizationId,
    quantity: data.quantity,
    type: "STOCK_IN",
    reason: data.reason,
    reference: data.reference,
    createdBy: userId,
  });

  return {
    inventory,
    product,
    previousStock,
    newStock: product.stock,
  };
}
// export async function stockIn(
//   data: StockInInput,
//   organizationId: string,
//   userId: string,
// ) {
//   const product = await Product.findOne({
//     _id: data.productId,
//     organizationId,
//     isActive: true,
//   });

//   if (!product) {
//     throw new Error("Product not found");
//   }

 
// }


// =========================
// STOCK OUT
// =========================

export async function stockOut(
  data: StockOutInput,
  organizationId: string,
  userId: string,
) {
  const product = await Product.findOne({
    _id: data.productId,
    organizationId,
    isActive: true,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Prevent negative stock
  if (product.stock < data.quantity) {
    throw new Error(
      `Insufficient stock. Available stock: ${product.stock}`,
    );
  }

  const previousStock = product.stock;

  product.stock -= data.quantity;

  await product.save();

  const inventory = await Inventory.create({
    productId: product._id,
    organizationId,
    quantity: data.quantity,
    type: "STOCK_OUT",
    reason: data.reason,
    reference: data.reference,
    createdBy: userId,
  });

  return {
    inventory,
    product,
    previousStock,
    newStock: product.stock,
  };
}


// =========================
// STOCK ADJUSTMENT
// =========================

export async function stockAdjustment(
  data: StockAdjustmentInput,
  organizationId: string,
  userId: string,
) {
  const product = await Product.findOne({
    _id: data.productId,
    organizationId,
    isActive: true,
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const previousStock = product.stock;

  product.stock = data.quantity;

  await product.save();

  const inventory = await Inventory.create({
    productId: product._id,
    organizationId,
    quantity: data.quantity,
    type: "ADJUSTMENT",
    reason: data.reason,
    reference: data.reference,
    createdBy: userId,
  });

  return {
    inventory,
    product,
    previousStock,
    newStock: product.stock,
  };
}

// =========================
// GET INVENTORY HISTORY
// =========================

export async function getInventoryHistory(
  organizationId: string,
  options?: {
    page?: number;
    limit?: number;
    productId?: string;
    type?:
      | "STOCK_IN"
      | "STOCK_OUT"
      | "ADJUSTMENT";
  },
) {
  const page = Math.max(
    options?.page || 1,
    1,
  );

  const limit = Math.min(
    Math.max(options?.limit || 10, 1),
    100,
  );

  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {
    organizationId,
  };

  // Product filter
  if (options?.productId) {
    filter.productId = options.productId;
  }

  // Movement type filter
  if (options?.type) {
    filter.type = options.type;
  }

  const [inventory, totalInventory] =
    await Promise.all([
      Inventory.find(filter)
        .populate(
          "productId",
          "name sku price stock",
        )
        .populate(
          "createdBy",
          "name email",
        )
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Inventory.countDocuments(filter),
    ]);

  const totalPages = Math.ceil(
    totalInventory / limit,
  );

  return {
    inventory,
    pagination: {
      page,
      limit,
      totalInventory,
      totalPages,
      hasNextPage:
        page < totalPages,
      hasPreviousPage:
        page > 1,
    },
  };
}


