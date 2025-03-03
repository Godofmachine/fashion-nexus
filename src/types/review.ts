
export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  is_verified_purchase: boolean;
  user_name: string;
}
