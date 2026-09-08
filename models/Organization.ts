import { Schema, model, models, Document, Types } from "mongoose";

export interface IOrganization extends Document {
  name: string;

  slug: string;

  ownerId: Types.ObjectId;

  logo?: string;

  industry?: string;

  phone?: string;

  address?: string;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    ownerId: {
  type: Schema.Types.ObjectId,
  ref: "User",
  required: true,
},

    logo: {
      type: String,
      default: null,
    },

    industry: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      default: null,
    },

    address: {
      type: String,
      default: null,
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

const Organization =
  models.Organization ||
  model<IOrganization>("Organization", OrganizationSchema);

export default Organization;