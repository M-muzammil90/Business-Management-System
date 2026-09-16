import { Types } from "mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";

export async function getSalesAnalytics(
  
  organizationId: string,
) {

  // =====================================
  // ORGANIZATION ID -> OBJECT ID
  // =====================================

  if (!Types.ObjectId.isValid(organizationId)) {
    throw new Error("Invalid organization ID");
  }

  const orgId = new Types.ObjectId(organizationId);

  console.log("========== ANALYTICS DEBUG ==========");
console.log("Organization ID:", organizationId);
console.log("Object ID:", orgId);
  // =====================================
  // SALES ANALYTICS
  // =====================================

  const testOrders = await Order.find({
  organizationId: orgId,
}).select(
  "_id orderNumber organizationId orderStatus total createdAt",
);

const testProducts = await Product.find({
  organizationId: orgId,
}).select(
  "_id name organizationId stock costPrice isActive",
);

console.log("========== ORDERS ==========");
console.log(testOrders);

console.log("========== PRODUCTS ==========");
console.log(testProducts);

  const [
    dailySales,
    monthlySales,
    topProducts,
  ] = await Promise.all([
    // =====================================
    // DAILY SALES - LAST 7 DAYS
    // =====================================

    Order.aggregate([
      {
        $match: {
          organizationId: orgId,

          orderStatus: {
            $ne: "CANCELLED",
          },

          createdAt: {
            $gte: new Date(
              Date.now() -
                7 * 24 * 60 * 60 * 1000,
            ),
          },
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          sales: {
            $sum: "$total",
          },

          orders: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]),

    // =====================================
    // MONTHLY SALES - LAST 12 MONTHS
    // =====================================

    Order.aggregate([
      {
        $match: {
          organizationId: orgId,

          orderStatus: {
            $ne: "CANCELLED",
          },

          createdAt: {
            $gte: new Date(
              new Date().setFullYear(
                new Date().getFullYear() - 1,
              ),
            ),
          },
        },
      },

      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt",
            },

            month: {
              $month: "$createdAt",
            },
          },

          sales: {
            $sum: "$total",
          },

          orders: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]),

    // =====================================
    // TOP SELLING PRODUCTS
    // =====================================

    Order.aggregate([
      {
        $match: {
          organizationId: orgId,

          orderStatus: {
            $ne: "CANCELLED",
          },
        },
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.productId",

          productName: {
            $first: "$items.name",
          },

          quantitySold: {
            $sum: "$items.quantity",
          },

          revenue: {
            $sum: "$items.subtotal",
          },
        },
      },

      {
        $sort: {
          quantitySold: -1,
        },
      },

      {
        $limit: 10,
      },
    ]),
  ]);

  // =====================================
  // INVENTORY VALUE
  // =====================================

  const inventoryResult =
    await Product.aggregate([
      {
        $match: {
          organizationId: orgId,

          isActive: true,
        },
      },

      {
        $group: {
          _id: null,

          inventoryValue: {
            $sum: {
              $multiply: [
                "$stock",
                "$costPrice",
              ],
            },
          },
        },
      },
    ]);

  const inventoryValue =
    inventoryResult[0]?.inventoryValue || 0;

  // Keep the chart stable even when one or more days have no orders.
  // Aggregation only returns dates that contain records, so the client would
  // otherwise render a sparse or empty chart for a perfectly valid period.
  const dailySalesByDate = new Map(
    dailySales.map((item) => [item._id, item]),
  );
  const completeDailySales = Array.from(
    { length: 7 },
    (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (6 - index));

      const dateKey = date.toISOString().slice(0, 10);
      const item = dailySalesByDate.get(dateKey);

      return {
        _id: dateKey,
        sales: item?.sales || 0,
        orders: item?.orders || 0,
      };
    },
  );

  // =====================================
  // RESPONSE
  // =====================================

  return {
    dailySales: completeDailySales,
    monthlySales,
    topProducts,
    inventoryValue,
  };
}