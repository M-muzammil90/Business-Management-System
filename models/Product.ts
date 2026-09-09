import { Schema, model, models, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  sku: string;
  description?: string;
  price: number;
  costPrice?: number;
  stock: number;
  categoryId?: Types.ObjectId;
  image?: string;
  organizationId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    sku: {
      type: String,
      required: [true, "SKU is required"],
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    costPrice: {
      type: Number,
      min: 0,
      default: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    categoryId: {
  type: Schema.Types.ObjectId,
  ref: "Category",
  default: null,
  index: true,
},

    image: {
      type: String,
      default: null,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Same SKU can exist in different organizations,
// but must be unique inside the same organization.
ProductSchema.index(
  { organizationId: 1, sku: 1 },
  { unique: true },
);

const Product =
  models.Product || model<IProduct>("Product", ProductSchema);

export default Product;