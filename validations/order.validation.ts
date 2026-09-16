import { z } from "zod";

// ==============================
// Common ObjectId Validation
// ==============================

const objectIdSchema = z
  .string()
  .regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid ID",
  );

// ==============================
// Order Item
// ==============================

const orderItemSchema = z.object({
  productId: objectIdSchema,

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),
});

// ==============================
// Create Order
// ==============================

export const createOrderSchema = z.object({
  customerId: objectIdSchema,

  items: z
    .array(orderItemSchema)
    .min(1, "Order must contain at least one product"),

  discount: z
    .number()
    .min(0, "Discount cannot be negative")
    .default(0),

  tax: z
    .number()
    .min(0, "Tax cannot be negative")
    .default(0),

  paymentMethod: z
    .enum([
      "CASH",
      "CARD",
      "BANK_TRANSFER",
      "ONLINE",
      "OTHER",
    ])
    .default("CASH"),

  paymentStatus: z
    .enum([
      "PENDING",
      "PAID",
      "PARTIALLY_PAID",
      "FAILED",
      "REFUNDED",
    ])
    .default("PENDING"),

  shippingAddress: z
    .string()
    .max(500, "Shipping address is too long")
    .trim()
    .optional(),

  billingAddress: z
    .string()
    .max(500, "Billing address is too long")
    .trim()
    .optional(),

  notes: z
    .string()
    .max(1000, "Notes are too long")
    .trim()
    .optional(),
});

export type CreateOrderInput =
  z.infer<typeof createOrderSchema>;

// ==============================
// Update Order
// ==============================

export const updateOrderSchema = z.object({
  orderStatus: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ])
    .optional(),

  paymentStatus: z
    .enum([
      "PENDING",
      "PAID",
      "PARTIALLY_PAID",
      "FAILED",
      "REFUNDED",
    ])
    .optional(),

  paymentMethod: z
    .enum([
      "CASH",
      "CARD",
      "BANK_TRANSFER",
      "ONLINE",
      "OTHER",
    ])
    .optional(),

  shippingAddress: z
    .string()
    .max(500, "Shipping address is too long")
    .trim()
    .optional(),

  billingAddress: z
    .string()
    .max(500, "Billing address is too long")
    .trim()
    .optional(),

  notes: z
    .string()
    .max(1000, "Notes are too long")
    .trim()
    .optional(),
});

export type UpdateOrderInput =
  z.infer<typeof updateOrderSchema>;