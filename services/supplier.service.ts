import Supplier from "@/models/Supplier";

import {
  CreateSupplierInput,
  UpdateSupplierInput,
} from "@/validations/supplier.validation";

// =========================
// CREATE SUPPLIER
// =========================

export async function createSupplier(
  data: CreateSupplierInput,
  organizationId: string,
) {
  // Check duplicate email inside same organization
  if (data.email) {
    const existingSupplier = await Supplier.findOne({
      email: data.email,
      organizationId,
    });

    if (existingSupplier) {
      throw new Error(
        "A supplier with this email already exists in your organization",
      );
    }
  }

  const supplier = await Supplier.create({
    ...data,
    organizationId,
  });

  return supplier;
}


// =========================
// GET ALL SUPPLIERS
// =========================

export async function getSuppliers(
  organizationId: string,
  options?: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
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

  // Organization security
  const filter: Record<string, unknown> = {
    organizationId,
    isActive: true,
  };

  // Search by name, email, phone or company
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
        email: {
          $regex: search,
          $options: "i",
        },
      },
      {
        phone: {
          $regex: search,
          $options: "i",
        },
      },
      {
        companyName: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  // City filter
  if (options?.city) {
    filter.city = {
      $regex: options.city.trim(),
      $options: "i",
    };
  }

  const [suppliers, totalSuppliers] =
    await Promise.all([
      Supplier.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Supplier.countDocuments(filter),
    ]);

  const totalPages = Math.ceil(
    totalSuppliers / limit,
  );

  return {
    suppliers,

    pagination: {
      page,
      limit,
      totalSuppliers,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}


// =========================
// GET SUPPLIER BY ID
// =========================

export async function getSupplierById(
  supplierId: string,
  organizationId: string,
) {
  const supplier = await Supplier.findOne({
    _id: supplierId,
    organizationId,
    isActive: true,
  });

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  return supplier;
}


// =========================
// UPDATE SUPPLIER
// =========================

export async function updateSupplier(
  supplierId: string,
  data: UpdateSupplierInput,
  organizationId: string,
) {
  const supplier = await Supplier.findOne({
    _id: supplierId,
    organizationId,
    isActive: true,
  });

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  // Check duplicate email
  if (
    data.email &&
    data.email !== supplier.email
  ) {
    const existingSupplier =
      await Supplier.findOne({
        email: data.email,
        organizationId,
        _id: {
          $ne: supplierId,
        },
      });

    if (existingSupplier) {
      throw new Error(
        "A supplier with this email already exists in your organization",
      );
    }
  }

  Object.assign(supplier, data);

  await supplier.save();

  return supplier;
}


// =========================
// DELETE SUPPLIER
// =========================

export async function deleteSupplier(
  supplierId: string,
  organizationId: string,
) {
  const supplier = await Supplier.findOne({
    _id: supplierId,
    organizationId,
    isActive: true,
  });

  if (!supplier) {
    throw new Error("Supplier not found");
  }

  // Soft delete
  supplier.isActive = false;

  await supplier.save();

  return supplier;
}

