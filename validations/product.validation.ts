import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(150, "Product name is too long")
    .trim(),

  sku: z
    .string()
    .min(2, "SKU is required")
    .max(50, "SKU is too long")
    .trim()
    .toUpperCase(),

  description: z
    .string()
    .max(1000, "Description is too long")
    .trim()
    .optional(),

  price: z
    .number()
    .min(0, "Price cannot be negative"),

  costPrice: z
    .number()
    .min(0, "Cost price cannot be negative")
    .optional(),

  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .default(0),

  category: z
    .string()
    .trim()
    .optional(),

  image: z
    .string()
    .url("Invalid image URL")
    .optional(),
});

export type CreateProductInput =
  z.infer<typeof createProductSchema>;

  export const updateProductSchema = z.object({
  name: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(150, "Product name is too long")
    .trim()
    .optional(),

  sku: z
    .string()
    .min(2, "SKU is required")
    .max(50, "SKU is too long")
    .trim()
    .toUpperCase()
    .optional(),

  description: z
    .string()
    .max(1000, "Description is too long")
    .trim()
    .optional(),

  price: z
    .number()
    .min(0, "Price cannot be negative")
    .optional(),

  costPrice: z
    .number()
    .min(0, "Cost price cannot be negative")
    .optional(),

  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .optional(),

  category: z
    .string()
    .trim()
    .optional(),

  image: z
    .string()
    .url("Invalid image URL")
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export type UpdateProductInput =
  z.infer<typeof updateProductSchema>;