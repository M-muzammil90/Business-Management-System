import { Schema, model, models, Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "SUPER_ADMIN" | "USER";
  organizationId?: Types.ObjectId;
  provider: "credentials" | "google";
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      select: false,
    },

    image: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "USER"],
      default: "USER",
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },

    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;