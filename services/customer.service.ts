
import Customer from "@/models/Customer";
import {
  CreateCustomerInput,
  UpdateCustomerInput,
} from "@/validations/customer.validation";

// =========================
// CREATE CUSTOMER
// =========================

export async function createCustomer(
  data: CreateCustomerInput,
  organizationId: string,
) {
  // Check duplicate email inside same organization
  if (data.email) {
    const existingCustomer = await Customer.findOne({
      email: data.email,
      organizationId,
    });

    if (existingCustomer) {
      throw new Error(
        "A customer with this email already exists in your organization",
      );
    }
  }

  const customer = await Customer.create({
    ...data,
    organizationId,
  });

  return customer;
}


// =========================
// GET ALL CUSTOMERS
// =========================

export async function getCustomers(
  organizationId: string,
  options?: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
  },
) {
  const page = Math.max(options?.page || 1, 1);

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

  // Search by name, email or phone
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
    ];
  }

  // Filter by city
  if (options?.city) {
    filter.city = {
      $regex: options.city.trim(),
      $options: "i",
    };
  }

  const [customers, totalCustomers] =
    await Promise.all([
      Customer.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Customer.countDocuments(filter),
    ]);

  const totalPages = Math.ceil(
    totalCustomers / limit,
  );

  return {
    customers,

    pagination: {
      page,
      limit,
      totalCustomers,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}


// =========================
// GET CUSTOMER BY ID
// =========================

export async function getCustomerById(
  customerId: string,
  organizationId: string,
) {
  const customer = await Customer.findOne({
    _id: customerId,
    organizationId,
    isActive: true,
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
}


// =========================
// UPDATE CUSTOMER
// =========================

export async function updateCustomer(
  customerId: string,
  data: UpdateCustomerInput,
  organizationId: string,
) {
  const customer = await Customer.findOne({
    _id: customerId,
    organizationId,
    isActive: true,
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  // Check duplicate email
  if (
    data.email &&
    data.email !== customer.email
  ) {
    const existingCustomer = await Customer.findOne({
      email: data.email,
      organizationId,
      _id: {
        $ne: customerId,
      },
    });

    if (existingCustomer) {
      throw new Error(
        "A customer with this email already exists in your organization",
      );
    }
  }

  Object.assign(customer, data);

  await customer.save();

  return customer;
}


// =========================
// DELETE CUSTOMER
// =========================

export async function deleteCustomer(
  customerId: string,
  organizationId: string,
) {
  const customer = await Customer.findOne({
    _id: customerId,
    organizationId,
    isActive: true,
  });

  if (!customer) {
    throw new Error("Customer not found");
  }

  // Soft delete
  customer.isActive = false;

  await customer.save();

  return customer;
}

