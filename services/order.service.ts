import Order from "@/models/Order";
import Customer from "@/models/Customer";
import Product from "@/models/Product";
import Inventory from "@/models/Inventory";
import User from "@/models/User";

import {
  CreateOrderInput,
  UpdateOrderInput,
} from "@/validations/order.validation";

// ========================================
// Generate Order Number
// ========================================

async function generateOrderNumber(
  organizationId: string,
) {
  const lastOrder = await Order.findOne({
    organizationId,
  }).sort({
    createdAt: -1,
  });

  let nextNumber = 1;

  if (lastOrder?.orderNumber) {
    const match =
      lastOrder.orderNumber.match(/(\d+)$/);

    if (match) {
      nextNumber = Number(match[1]) + 1;
    }
  }

  return `ORD-${String(nextNumber).padStart(6, "0")}`;
}

// ========================================
// CREATE ORDER
// ========================================

export async function createOrder(
  data: CreateOrderInput,
  organizationId: string,
  userId: string,
) {
  // ======================================
  // 1. Verify Customer
  // ======================================

  const customer = await Customer.findOne({
    _id: data.customerId,
    organizationId,
    isActive: true,
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  // ======================================
  // 2. Prevent Duplicate Products
  // ======================================

  const productIds = data.items.map(
    (item) => item.productId,
  );

  const uniqueProductIds =
    new Set(productIds);

  if (
    uniqueProductIds.size !==
    productIds.length
  ) {
    throw new Error(
      "Duplicate products are not allowed in the same order",
    );
  }

  // ======================================
  // 3. Get Products
  // ======================================

  const products = await Product.find({
    _id: {
      $in: productIds,
    },
    organizationId,
    isActive: true,
  });

  if (
    products.length !==
    productIds.length
  ) {
    throw new Error(
      "One or more products were not found",
    );
  }

  // ======================================
  // 4. Validate Stock
  // ======================================

  const orderItems = [];

  let subtotal = 0;

  for (const item of data.items) {
    const product = products.find(
      (p) =>
        p._id.toString() ===
        item.productId,
    );

    if (!product) {
      throw new Error(
        `Product not found: ${item.productId}`,
      );
    }

    if (product.stock < item.quantity) {
      throw new Error(
        `Insufficient stock for ${product.name}. Available stock: ${product.stock}`,
      );
    }

    // ====================================
    // Calculate Item Subtotal
    // ====================================

    const itemSubtotal =
      product.price * item.quantity;

    subtotal += itemSubtotal;

    orderItems.push({
      productId: product._id,
      name: product.name,
      sku: product.sku,
      quantity: item.quantity,
      unitPrice: product.price,
      subtotal: itemSubtotal,
    });
  }

  // ======================================
  // 5. Calculate Final Total
  // ======================================

  const discount = data.discount || 0;
  const tax = data.tax || 0;

  if (discount > subtotal) {
    throw new Error(
      "Discount cannot be greater than subtotal",
    );
  }

  const total =
    subtotal - discount + tax;

  // ======================================
  // 6. Generate Order Number
  // ======================================

  const orderNumber =
    await generateOrderNumber(
      organizationId,
    );

  // ======================================
  // 7. Create Order
  // ======================================

  const order = await Order.create({
    orderNumber,

    customerId: customer._id,

    items: orderItems,

    subtotal,
    discount,
    tax,
    total,

    paymentMethod:
      data.paymentMethod,

    paymentStatus:
      data.paymentStatus,

    orderStatus: "PENDING",

    shippingAddress:
      data.shippingAddress,

    billingAddress:
      data.billingAddress,

    notes: data.notes,

    organizationId,

    createdBy: userId,
  });

  // ======================================
  // 8. Reduce Product Stock
  // ======================================

  for (const item of data.items) {
    const product =
      products.find(
        (p) =>
          p._id.toString() ===
          item.productId,
      );

    if (!product) continue;

    const previousStock =
      product.stock;

    product.stock -=
      item.quantity;

    await product.save();

    // ====================================
    // 9. Create Inventory History
    // ====================================

    await Inventory.create({
      productId: product._id,

      organizationId,

      quantity: item.quantity,

      type: "STOCK_OUT",

      reason: `Order ${orderNumber}`,

      reference: orderNumber,

      createdBy: userId,
    });

    console.log(
      `Stock updated: ${product.name} | ${previousStock} -> ${product.stock}`,
    );
  }

  // ======================================
  // 10. Return Complete Order
  // ======================================

  return await Order.findById(
    order._id,
  )
    .populate(
      "customerId",
      "name email phone",
    )
    .populate(
      "createdBy",
      "name email",
    )
    .populate(
      "items.productId",
      "name sku price stock",
    );
}

// ========================================
// GET ORDER BY ID
// ========================================

export async function getOrderById(
  orderId: string,
  organizationId: string,
) {
  const order = await Order.findOne({
    _id: orderId,
    organizationId,
  })
    .populate(
      "customerId",
      "name email phone address city country",
    )
    .populate(
      "createdBy",
      "name email",
    )
    .populate(
      "items.productId",
      "name sku price stock",
    );

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
}

// ========================================
// GET ALL ORDERS
// ========================================

export async function getOrders(
  organizationId: string,
  options?: {
    page?: number;
    limit?: number;
    search?: string;
    orderStatus?: string;
    paymentStatus?: string;
  },
) {
  const page = Math.max(
    options?.page || 1,
    1,
  );

  const limit = Math.min(
    Math.max(
      options?.limit || 10,
      1,
    ),
    100,
  );

  const skip =
    (page - 1) * limit;

  const filter: Record<
    string,
    any
  > = {
    organizationId,
  };

  if (options?.search) {
    filter.orderNumber = {
      $regex:
        options.search.trim(),
      $options: "i",
    };
  }

  if (options?.orderStatus) {
    filter.orderStatus =
      options.orderStatus;
  }

  if (options?.paymentStatus) {
    filter.paymentStatus =
      options.paymentStatus;
  }

  const [
    orders,
    totalOrders,
  ] = await Promise.all([
    Order.find(filter)
      .populate(
        "customerId",
        "name email phone",
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

    Order.countDocuments(filter),
  ]);

  const totalPages =
    Math.ceil(
      totalOrders / limit,
    );

  return {
    orders,

    pagination: {
      page,
      limit,
      totalOrders,
      totalPages,

      hasNextPage:
        page < totalPages,

      hasPreviousPage:
        page > 1,
    },
  };
}

// ========================================
// UPDATE ORDER
// ========================================

export async function updateOrder(
  orderId: string,
  data: UpdateOrderInput,
  organizationId: string,
) {
  const order =
    await Order.findOne({
      _id: orderId,
      organizationId,
    });

  if (!order) {
    throw new Error(
      "Order not found",
    );
  }

  // Prevent editing completed orders
  if (
    order.orderStatus ===
      "DELIVERED" ||
    order.orderStatus ===
      "CANCELLED"
  ) {
    throw new Error(
      "Completed or cancelled orders cannot be updated",
    );
  }

  // Prevent changing cancelled order
  if (
    order.orderStatus ===
      "CANCELLED"
  ) {
    throw new Error(
      "Cancelled order cannot be updated",
    );
  }

  Object.assign(
    order,
    data,
  );

  await order.save();

  return await Order.findById(
    order._id,
  )
    .populate(
      "customerId",
      "name email phone",
    )
    .populate(
      "createdBy",
      "name email",
    )
    .populate(
      "items.productId",
      "name sku price stock",
    );
}