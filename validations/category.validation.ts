import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name is too long")
    .trim(),

  description: z
    .string()
    .max(500, "Description is too long")
    .trim()
    .optional(),
});

export type CreateCategoryInput =
  z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Category name must be at least 2 characters")
    .max(100, "Category name is too long")
    .trim()
    .optional(),

  description: z
    .string()
    .max(500, "Description is too long")
    .trim()
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export type UpdateCategoryInput =
  z.infer<typeof updateCategorySchema>;