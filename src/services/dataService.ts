
import { supabase } from "@/integrations/supabase/client";
import { Product, ProductCategory, ProductSize } from "@/types/product";
import { Review } from "@/types/review";
import { 
  mockProducts, 
  mockReviews, 
  mockCartItems, 
  mockOrders, 
  mockUser 
} from "./mockData";

// Check multiple sources for mock mode
const USE_MOCK_DATA = 
  import.meta.env.VITE_USE_MOCK_DATA === 'true' ||
  localStorage.getItem('useMockData') === 'true';

export const dataService = {
  // Products
  async getProducts(category?: ProductCategory, isSale?: boolean, sortByNewest?: boolean) {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for products');
      let filtered = [...mockProducts];
      
      if (category) {
        filtered = filtered.filter(p => p.category === category);
      }
      if (isSale) {
        filtered = filtered.filter(p => p.is_sale);
      }
      if (sortByNewest) {
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
      
      return filtered;
    }

    try {
      let query = supabase.from('products').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      if (isSale) {
        query = query.eq('is_sale', true);
      }
      if (sortByNewest) {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('is_sale', { ascending: false });
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Backend unavailable, falling back to mock data', error);
      return this.getProducts(category, isSale, sortByNewest);
    }
  },

  async getFeaturedProducts() {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for featured products');
      return mockProducts.slice(0, 4);
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('is_sale', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Backend unavailable, falling back to mock data', error);
      return mockProducts.slice(0, 4);
    }
  },

  // Reviews
  async getProductReviews(productId: string) {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for reviews');
      return mockReviews.filter(r => r.product_id === productId);
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Backend unavailable, falling back to mock data', error);
      return mockReviews.filter(r => r.product_id === productId);
    }
  },

  async addReview(review: Omit<Review, 'id' | 'created_at' | 'user_name'>) {
    if (USE_MOCK_DATA) {
      console.log('Mock: Adding review', review);
      // In mock mode, just simulate success
      return {
        id: `mock-review-${Date.now()}`,
        ...review,
        created_at: new Date().toISOString(),
        user_name: mockUser.user_metadata.full_name
      };
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Backend unavailable, using mock response', error);
      return this.addReview(review);
    }
  },

  // Cart
  async getCartItems(userId: string) {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for cart');
      return mockCartItems;
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Backend unavailable, falling back to mock data', error);
      return mockCartItems;
    }
  },

  async addToCart(userId: string, productId: string, size: ProductSize) {
    if (USE_MOCK_DATA) {
      console.log('Mock: Adding to cart', { userId, productId, size });
      return { success: true };
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: userId,
          product_id: productId,
          size,
          quantity: 1,
        });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.warn('Backend unavailable, using mock response', error);
      return { success: true };
    }
  },

  // Orders
  async getOrders(userId: string) {
    if (USE_MOCK_DATA) {
      console.log('Using mock data for orders');
      return mockOrders;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.warn('Backend unavailable, falling back to mock data', error);
      return mockOrders;
    }
  },

  async createOrder(userId: string, cartItems: any[], total: number) {
    if (USE_MOCK_DATA) {
      console.log('Mock: Creating order', { userId, total });
      return {
        id: `mock-order-${Date.now()}`,
        user_id: userId,
        total_amount: total,
        status: 'pending',
        shipping_address: "Mock Address",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    }

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          total_amount: total,
          shipping_address: "Test Address",
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;
      return order;
    } catch (error) {
      console.warn('Backend unavailable, using mock response', error);
      return this.createOrder(userId, cartItems, total);
    }
  },

  // Auth
  getCurrentUser() {
    if (USE_MOCK_DATA) {
      console.log('Using mock user');
      return mockUser;
    }
    return null; // Let the auth system handle this normally
  }
};
