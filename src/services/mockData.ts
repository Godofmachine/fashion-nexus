
import { Product, ProductCategory, ProductSize } from "@/types/product";
import { Review } from "@/types/review";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    description: "Comfortable and stylish cotton t-shirt perfect for everyday wear",
    price: 15000,
    original_price: null,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"],
    category: "men" as ProductCategory,
    sizes: ["S", "M", "L", "XL"] as ProductSize[],
    stock_quantity: 50,
    is_sale: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    name: "Elegant Summer Dress",
    description: "Beautiful flowing dress perfect for summer occasions",
    price: 25000,
    original_price: null,
    images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446"],
    category: "women" as ProductCategory,
    sizes: ["XS", "S", "M", "L"] as ProductSize[],
    stock_quantity: 30,
    is_sale: false,
    created_at: "2024-01-02T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z"
  },
  {
    id: "3",
    name: "Designer Handbag",
    description: "Luxury handbag made from premium materials",
    price: 45000,
    original_price: 60000,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3"],
    category: "accessories" as ProductCategory,
    sizes: ["M"] as ProductSize[],
    stock_quantity: 15,
    is_sale: true,
    created_at: "2024-01-03T00:00:00Z",
    updated_at: "2024-01-03T00:00:00Z"
  },
  {
    id: "4",
    name: "Classic Sneakers",
    description: "Comfortable sneakers for daily activities",
    price: 35000,
    original_price: null,
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772"],
    category: "accessories" as ProductCategory,
    sizes: ["M", "L", "XL"] as ProductSize[],
    stock_quantity: 25,
    is_sale: false,
    created_at: "2024-01-04T00:00:00Z",
    updated_at: "2024-01-04T00:00:00Z"
  }
];

export const mockReviews: Review[] = [
  {
    id: "1",
    user_id: "user1",
    product_id: "1",
    rating: 5,
    comment: "Excellent quality t-shirt, very comfortable!",
    created_at: "2024-01-15T10:00:00Z",
    is_verified_purchase: true,
    user_name: "John Doe"
  },
  {
    id: "2",
    user_id: "user2", 
    product_id: "1",
    rating: 4,
    comment: "Good quality, fits well. Recommend!",
    created_at: "2024-01-20T14:30:00Z",
    is_verified_purchase: true,
    user_name: "Jane Smith"
  },
  {
    id: "3",
    user_id: "user3",
    product_id: "2",
    rating: 5,
    comment: "Beautiful dress, perfect for summer events!",
    created_at: "2024-01-25T16:45:00Z",
    is_verified_purchase: true,
    user_name: "Sarah Johnson"
  }
];
