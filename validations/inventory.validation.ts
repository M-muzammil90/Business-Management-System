import { z } from "zod";

// =========================
// COMMON PRODUCT ID
// =========================

const productIdSchema = z
  .string()
  .regex(
    /^[0-9a-fA-F]{24}$/,
    "Invalid product ID",
  );


// =========================
// STOCK IN
// =========================

export const stockInSchema = z.object({
  productId: productIdSchema,

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),

  reason: z
    .string()
    .max(500, "Reason is too long")
    .trim()
    .optional(),

  reference: z
    .string()
    .max(100, "Reference is too long")
    .trim()
    .optional(),
});

export type StockInInput =
  z.infer<typeof stockInSchema>;


// =========================
// STOCK OUT
// =========================

export const stockOutSchema = z.object({
  productId: productIdSchema,

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),

  reason: z
    .string()
    .max(500, "Reason is too long")
    .trim()
    .optional(),

  reference: z
    .string()
    .max(100, "Reference is too long")
    .trim()
    .optional(),
});

export type StockOutInput =
  z.infer<typeof stockOutSchema>;


// =========================
// STOCK ADJUSTMENT
// =========================

export const stockAdjustmentSchema = z.object({
  productId: productIdSchema,

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be greater than 0"),

  reason: z
    .string()
    .max(500, "Reason is too long")
    .trim()
    .optional(),

  reference: z
    .string()
    .max(100, "Reference is too long")
    .trim()
    .optional(),
});

export type StockAdjustmentInput =
  z.infer<typeof stockAdjustmentSchema>;

