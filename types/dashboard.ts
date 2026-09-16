export interface RecentOrder {
  _id: string;
  orderNumber: string;
  total: number;

  orderStatus:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

  paymentStatus:
    | "PENDING"
    | "PAID"
    | "PARTIALLY_PAID"
    | "FAILED"
    | "REFUNDED";

  createdAt: string;

  customerId?: {
    _id: string;
    name: string;
    email?: string;
  };
}

export interface TopProduct {
  _id: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface DashboardStats {
  overview: {
    totalProducts: number;
    totalCustomers: number;
    totalSuppliers: number;
    totalOrders: number;
    totalSales: number;
  };

  inventory: {
    lowStockProducts: number;
    outOfStockProducts: number;
  };

  orders: {
    pendingOrders: number;
  };

  recentOrders: RecentOrder[];
}

export interface SalesAnalytics {
  dailySales: {
    _id: string;
    sales: number;
    orders: number;
  }[];

  monthlySales: {
    _id: {
      year: number;
      month: number;
    };
    sales: number;
    orders: number;
  }[];

  topProducts: TopProduct[];

  inventoryValue: number;
}