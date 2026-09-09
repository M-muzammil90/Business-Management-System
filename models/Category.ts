import {
  Schema,
  model,
  models,
  Document,
  Types,
} from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  organizationId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
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

CategorySchema.index(
  { organizationId: 1, name: 1 },
  { unique: true },
);

const Category =
  models.Category ||
  model<ICategory>("Category", CategorySchema);

export default Category;