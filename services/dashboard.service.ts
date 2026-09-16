import Product from "@/models/Product";
import Customer from "@/models/Customer";
import Supplier from "@/models/Supplier";
import Order from "@/models/Order";
import Inventory from "@/models/Inventory";

export async function getDashboardStats(
  organizationId: string,
) {
  const [
    totalProducts,
    totalCustomers,
    totalSuppliers,
    totalOrders,
    pendingOrders,
    lowStockProducts,
    outOfStockProducts,
    recentOrders,
    salesResult,
  ] = await Promise.all([
    Product.countDocuments({
      organizationId,
      isActive: true,
    }),

    Customer.countDocuments({
      organizationId,
      isActive: true,
    }),

    Supplier.countDocuments({
      organizationId,
      isActive: true,
    }),

    Order.countDocuments({
      organizationId,
    }),

    Order.countDocuments({
      organizationId,
      orderStatus: "PENDING",
    }),

    Product.countDocuments({
      organizationId,
      isActive: true,
      stock: {
        $gt: 0,
        $lte: 5,
      },
    }),

    Product.countDocuments({
      organizationId,
      isActive: true,
      stock: 0,
    }),

    Order.find({
      organizationId,
    })
      .populate("customerId", "name email")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    Order.aggregate([
      {
        $match: {
          organizationId,
          orderStatus: {
            $ne: "CANCELLED",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: "$total",
          },
        },
      },
    ]),
  ]);

  const totalSales = salesResult[0]?.totalSales || 0;

  return {
    overview: {
      totalProducts,
      totalCustomers,
      totalSuppliers,
      totalOrders,
      totalSales,
    },

    inventory: {
      lowStockProducts,
      outOfStockProducts,
    },

    orders: {
      pendingOrders,
    },

    recentOrders,
  };
}