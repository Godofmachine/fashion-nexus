
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Review } from "@/types/review";
import { mockProducts, mockReviews } from "./mockData";

const useMockData = import.meta.env.VITE_USE_MOCK_DATA === 'true' || 
                   localStorage.getItem('useMockData') === 'true';

export const dataService = {
  async getProducts(filters?: {
    category?: string;
    search?: string;
    priceRange?: [number, number];
    isSale?: boolean;
    sort?: string;
  }): Promise<Product[]> {
    if (useMockData) {
      let products = [...mockProducts];
      
      if (filters) {
        if (filters.category) {
          products = products.filter(p => p.category === filters.category);
        }
        
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          products = products.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            (p.description && p.description.toLowerCase().includes(searchLower))
          );
        }
        
        if (filters.priceRange) {
          products = products.filter(p => 
            p.price >= filters.priceRange![0] && p.price <= filters.priceRange![1]
          );
        }
        
        if (filters.isSale !== undefined) {
          products = products.filter(p => p.is_sale === filters.isSale);
        }
        
        if (filters.sort) {
          switch (filters.sort) {
            case 'price_asc':
              products.sort((a, b) => a.price - b.price);
              break;
            case 'price_desc':
              products.sort((a, b) => b.price - a.price);
              break;
            case 'newest':
              products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              break;
            case 'name':
              products.sort((a, b) => a.name.localeCompare(b.name));
              break;
          }
        }
      }
      
      return products;
    }

    let query = supabase.from('products').select('*');
    
    if (filters) {
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      if (filters.priceRange) {
        query = query.gte('price', filters.priceRange[0]).lte('price', filters.priceRange[1]);
      }
      
      if (filters.isSale !== undefined) {
        query = query.eq('is_sale', filters.isSale);
      }
      
      if (filters.sort) {
        switch (filters.sort) {
          case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'name':
            query = query.order('name', { ascending: true });
            break;
        }
      }
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  },

  async getReviews(productId: string): Promise<Review[]> {
    if (useMockData) {
      return mockReviews.filter(review => review.product_id === productId);
    }

    // Since reviews table doesn't exist in Supabase types yet, return empty array
    // This will be updated once the reviews table is created
    return [];
  },

  async createReview(reviewData: Omit<Review, 'id' | 'created_at' | 'user_name'>): Promise<Review> {
    if (useMockData) {
      const newReview: Review = {
        ...reviewData,
        id: Math.random().toString(36).substr(2, 9),
        created_at: new Date().toISOString(),
        user_name: 'Mock User'
      };
      mockReviews.push(newReview);
      return newReview;
    }

    // Since reviews table doesn't exist in Supabase types yet, throw error
    // This will be updated once the reviews table is created
    throw new Error('Reviews functionality not yet implemented in database');
  }
};
