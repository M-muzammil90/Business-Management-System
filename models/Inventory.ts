import {
  Schema,
  model,
  models,
  Document,
  Types,
} from "mongoose";

export type InventoryType =
  | "STOCK_IN"
  | "STOCK_OUT"
  | "ADJUSTMENT";

export interface IInventory extends Document {
  productId: Types.ObjectId;
  organizationId: Types.ObjectId;
  quantity: number;
  type: InventoryType;
  reason?: string;
  reference?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventory>(
  {
    // Product whose stock changed
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    // Multi-tenant security
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    // Quantity changed
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be greater than 0"],
    },

    // Stock movement type
    type: {
      type: String,
      enum: [
        "STOCK_IN",
        "STOCK_OUT",
        "ADJUSTMENT",
      ],
      required: true,
    },

    // Why stock changed
    reason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },

    // Optional reference
    // Example: PO-001, SALE-001, ADJ-001
    reference: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    // User who performed the movement
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

// Helpful indexes for inventory history
InventorySchema.index({
  organizationId: 1,
  productId: 1,
  createdAt: -1,
});

InventorySchema.index({
  organizationId: 1,
  type: 1,
  createdAt: -1,
});

const Inventory =
  models.Inventory ||
  model<IInventory>("Inventory", InventorySchema);

export default Inventory;

