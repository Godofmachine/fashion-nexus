
export type ProductCategory = "men" | "women" | "accessories";
export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: ProductCategory;
  images: string[];
  sizes: ProductSize[];
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}
