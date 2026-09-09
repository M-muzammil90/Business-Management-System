
import {
  Schema,
  model,
  models,
  Document,
  Types,
} from "mongoose";

export interface ISupplier extends Document {
  name: string;
  email?: string;
  phone?: string;
  companyName?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  organizationId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SupplierSchema = new Schema<ISupplier>(
  {
    name: {
      type: String,
      required: [true, "Supplier name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      default: null,
    },

    companyName: {
      type: String,
      trim: true,
      maxlength: 150,
      default: null,
    },

    address: {
      type: String,
      trim: true,
      maxlength: 300,
      default: null,
    },

    city: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    country: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },

    // Multi-tenant security
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    // Soft delete
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Email unique inside each organization
SupplierSchema.index(
  { organizationId: 1, email: 1 },
  {
    unique: true,
    sparse: true,
  },
);

const Supplier =
  models.Supplier ||
  model<ISupplier>("Supplier", SupplierSchema);

export default Supplier;

