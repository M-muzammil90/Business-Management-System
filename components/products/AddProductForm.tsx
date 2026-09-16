"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";

import type { ProductFormData } from "@/types/product";
import type { Product } from "@/types/product";

interface Category {
  _id: string;
  name: string;
}

interface AddProductFormProps {
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
  product?: Product;
}

export default function AddProductForm({
  categories,
  onClose,
  onSuccess,
  product,
}: AddProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(() => ({
    name: product?.name || "",
    sku: product?.sku || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    costPrice: product?.costPrice?.toString() || "",
    stock: product?.stock?.toString() || "",
    categoryId: product?.categoryId?._id || "",
    image: product?.image || "",
  }));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again.",
        );
      }

      if (!formData.name.trim()) {
        throw new Error("Product name is required.");
      }

      if (!formData.sku.trim()) {
        throw new Error("SKU is required.");
      }

      if (!formData.price) {
        throw new Error("Product price is required.");
      }

      if (!formData.stock) {
        throw new Error("Product stock is required.");
      }

      const response = await fetch(
        product ? `/api/products/${product._id}` : "/api/products",
        {
        method: product ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          sku: formData.sku.trim().toUpperCase(),
          description: formData.description.trim(),
          price: Number(formData.price),
          costPrice: formData.costPrice
            ? Number(formData.costPrice)
            : undefined,
          stock: Number(formData.stock),
          categoryId: formData.categoryId || undefined,
          image: formData.image.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to create product.",
        );
      }

      onSuccess();
      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {product ? "Edit Product" : "Add Product"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add a new product to your inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="max-h-[75vh] overflow-y-auto"
        >
          <div className="space-y-6 p-6">
            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            {/* Product Information */}
            <div>
              <h3 className="text-sm font-semibold">
                Product Information
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">
                    Product Name
                  </label>

                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Samsung Galaxy S24 Ultra"
                    className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="text-sm font-medium">
                    SKU
                  </label>

                  <input
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="e.g. SAM-S24-ULTRA"
                    className="mt-2 h-11 w-full rounded-lg border bg-background px-3 font-mono text-sm uppercase outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium">
                    Category
                  </label>

                  <select
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category._id}
                        value={category._id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter product description..."
                    className="mt-2 w-full resize-none rounded-lg border bg-background px-3 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div>
              <h3 className="text-sm font-semibold">
                Pricing & Inventory
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {/* Price */}
                <div>
                  <label className="text-sm font-medium">
                    Selling Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0"
                    className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Cost */}
                <div>
                  <label className="text-sm font-medium">
                    Cost Price
                  </label>

                  <input
                    type="number"
                    name="costPrice"
                    min="0"
                    value={formData.costPrice}
                    onChange={handleChange}
                    placeholder="0"
                    className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="text-sm font-medium">
                    Initial Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="0"
                    className="mt-2 h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Image */}
            <div>
              <h3 className="text-sm font-semibold">
                Product Image
              </h3>

              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/product-image.jpg"
                className="mt-3 h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

              <p className="mt-2 text-xs text-muted-foreground">
                Image URL for now. We will integrate Cloudinary
                upload later.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t bg-muted/20 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-11 rounded-lg border px-5 text-sm font-semibold transition hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {loading ? "Saving..." : product ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}