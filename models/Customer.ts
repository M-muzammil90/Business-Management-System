
import {
  Schema,
  model,
  models,
  Document,
  Types,
} from "mongoose";

export interface ICustomer extends Document {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  notes?: string;
  organizationId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: [true, "Customer name is required"],
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

// Same customer email can exist in different organizations,
// but should be unique inside the same organization.
CustomerSchema.index(
  { organizationId: 1, email: 1 },
  {
    unique: true,
    sparse: true,
  },
);

const Customer =
  models.Customer ||
  model<ICustomer>("Customer", CustomerSchema);

export default Customer;

