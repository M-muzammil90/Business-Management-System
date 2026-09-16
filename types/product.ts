export interface ProductCategory {
  _id: string;
  name: string;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  description?: string;
  price: number;
  costPrice?: number;
  stock: number;
  categoryId?: ProductCategory;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  price: string;
  costPrice: string;
  stock: string;
  categoryId: string;
  image: string;
}