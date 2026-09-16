import {
  Schema,
  model,
  models,
  Document,
  Types,
} from "mongoose";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "PARTIALLY_PAID"
  | "FAILED"
  | "REFUNDED";

export type PaymentMethod =
  | "CASH"
  | "CARD"
  | "BANK_TRANSFER"
  | "ONLINE"
  | "OTHER";

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface IOrder extends Document {
  orderNumber: string;

  customerId: Types.ObjectId;

  items: IOrderItem[];

  subtotal: number;
  discount: number;
  tax: number;
  total: number;

  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  orderStatus: OrderStatus;

  shippingAddress?: string;
  billingAddress?: string;

  notes?: string;

  organizationId: Types.ObjectId;

  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // Product ka snapshot
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: function (items: IOrderItem[]) {
          return items.length > 0;
        },
        message: "Order must contain at least one product",
      },
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    tax: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: [
        "CASH",
        "CARD",
        "BANK_TRANSFER",
        "ONLINE",
        "OTHER",
      ],
      default: "CASH",
    },

    paymentStatus: {
      type: String,
      enum: [
        "PENDING",
        "PAID",
        "PARTIALLY_PAID",
        "FAILED",
        "REFUNDED",
      ],
      default: "PENDING",
    },

    orderStatus: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PENDING",
    },

    shippingAddress: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    billingAddress: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Unique order number inside each organization
OrderSchema.index(
  {
    organizationId: 1,
    orderNumber: 1,
  },
  {
    unique: true,
  },
);

// Fast customer order history
OrderSchema.index({
  organizationId: 1,
  customerId: 1,
  createdAt: -1,
});

// Fast order listing
OrderSchema.index({
  organizationId: 1,
  createdAt: -1,
});

// Fast status filtering
OrderSchema.index({
  organizationId: 1,
  orderStatus: 1,
});

const Order =
  models.Order ||
  model<IOrder>("Order", OrderSchema);

export default Order;