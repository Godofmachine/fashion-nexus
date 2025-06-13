
import { Product, ProductCategory, ProductSize } from "@/types/product";
import { Review } from "@/types/review";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Classic Denim Jacket",
    description: "A timeless denim jacket perfect for any season",
    price: 25000,
    original_price: 30000,
    images: ["https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500"],
    category: "men" as ProductCategory,
    sizes: ["S", "M", "L", "XL"] as ProductSize[],
    stock_quantity: 50,
    is_sale: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    name: "Elegant Summer Dress",
    description: "Lightweight and comfortable dress for summer",
    price: 18000,
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"],
    category: "women" as ProductCategory,
    sizes: ["XS", "S", "M", "L"] as ProductSize[],
    stock_quantity: 30,
    is_sale: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "3",
    name: "Leather Crossbody Bag",
    description: "Premium leather bag with adjustable strap",
    price: 35000,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
    category: "accessories" as ProductCategory,
    sizes: ["One Size"] as ProductSize[],
    stock_quantity: 20,
    is_sale: false,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "4",
    name: "Casual White Sneakers",
    description: "Comfortable white sneakers for everyday wear",
    price: 22000,
    original_price: 28000,
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"],
    category: "men" as ProductCategory,
    sizes: ["40", "41", "42", "43", "44"] as ProductSize[],
    stock_quantity: 40,
    is_sale: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

export const mockReviews: Review[] = [
  {
    id: "1",
    user_id: "user1",
    product_id: "1",
    rating: 5,
    comment: "Great quality denim jacket! Fits perfectly and looks amazing.",
    created_at: "2024-01-15T00:00:00Z",
    is_verified_purchase: true,
    user_name: "John Doe"
  },
  {
    id: "2",
    user_id: "user2",
    product_id: "1",
    rating: 4,
    comment: "Nice jacket, but runs a bit large. Would recommend sizing down.",
    created_at: "2024-01-10T00:00:00Z",
    is_verified_purchase: true,
    user_name: "Jane Smith"
  },
  {
    id: "3",
    user_id: "user3",
    product_id: "2",
    rating: 5,
    comment: "Beautiful dress! Perfect for summer events.",
    created_at: "2024-01-12T00:00:00Z",
    is_verified_purchase: false,
    user_name: "Alice Johnson"
  }
];

export const mockCartItems = [
  {
    id: "cart1",
    user_id: "mock-user",
    product_id: "1",
    quantity: 2,
    size: "M" as ProductSize,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    product: mockProducts[0]
  }
];

export const mockOrders = [
  {
    id: "order1",
    user_id: "mock-user",
    total_amount: 50000,
    status: "pending" as const,
    shipping_address: "123 Mock Street, Mock City",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "order2",
    user_id: "mock-user",
    total_amount: 18000,
    status: "shipped" as const,
    shipping_address: "123 Mock Street, Mock City",
    created_at: "2023-12-15T00:00:00Z",
    updated_at: "2023-12-20T00:00:00Z"
  }
];

export const mockUser = {
  id: "mock-user",
  email: "user@example.com",
  user_metadata: {
    full_name: "Mock User",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
  }
};
