import { z } from "zod";

// =========================
// CREATE SUPPLIER
// =========================

export const createSupplierSchema = z.object({
  name: z
    .string()
    .min(2, "Supplier name must be at least 2 characters")
    .max(100, "Supplier name is too long")
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email")
    .trim()
    .toLowerCase()
    .optional(),

  phone: z
    .string()
    .max(30, "Phone number is too long")
    .trim()
    .optional(),

  companyName: z
    .string()
    .max(150, "Company name is too long")
    .trim()
    .optional(),

  address: z
    .string()
    .max(300, "Address is too long")
    .trim()
    .optional(),

  city: z
    .string()
    .max(100, "City name is too long")
    .trim()
    .optional(),

  country: z
    .string()
    .max(100, "Country name is too long")
    .trim()
    .optional(),

  notes: z
    .string()
    .max(1000, "Notes are too long")
    .trim()
    .optional(),
});

export type CreateSupplierInput =
  z.infer<typeof createSupplierSchema>;


// =========================
// UPDATE SUPPLIER
// =========================

export const updateSupplierSchema = z.object({
  name: z
    .string()
    .min(2, "Supplier name must be at least 2 characters")
    .max(100, "Supplier name is too long")
    .trim()
    .optional(),

  email: z
    .string()
    .email("Please enter a valid email")
    .trim()
    .toLowerCase()
    .optional(),

  phone: z
    .string()
    .max(30, "Phone number is too long")
    .trim()
    .optional(),

  companyName: z
    .string()
    .max(150, "Company name is too long")
    .trim()
    .optional(),

  address: z
    .string()
    .max(300, "Address is too long")
    .trim()
    .optional(),

  city: z
    .string()
    .max(100, "City name is too long")
    .trim()
    .optional(),

  country: z
    .string()
    .max(100, "Country name is too long")
    .trim()
    .optional(),

  notes: z
    .string()
    .max(1000, "Notes are too long")
    .trim()
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});

export type UpdateSupplierInput =
  z.infer<typeof updateSupplierSchema>;

