
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf } from "lucide-react";
import { Review } from "@/types/review";

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  // Fetch reviews for the product
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          product_id,
          rating,
          comment,
          created_at,
          is_verified_purchase,
          profiles:user_id (full_name)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our Review type
      return data.map((review) => ({
        ...review,
        user_name: review.profiles?.full_name || 'Anonymous',
      })) as Review[];
    },
  });

  // Check if user has already reviewed this product
  const { data: userReview } = useQuery({
    queryKey: ['userReview', productId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') return null; // No rows returned
        throw error;
      }
      
      return data;
    },
    enabled: !!user,
  });

  // Create a new review
  const createReviewMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("You must be logged in to leave a review");
      if (rating === 0) throw new Error("Please select a rating");
      
      const { data: verificationData, error: verificationError } = await supabase
        .from('order_items')
        .select('id')
        .eq('product_id', productId)
        .filter('orders.user_id', 'eq', user.id)
        .limit(1);
      
      if (verificationError) throw verificationError;
      
      const isVerifiedPurchase = verificationData && verificationData.length > 0;
      
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          product_id: productId,
          rating,
          comment,
          is_verified_purchase: isVerifiedPurchase
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['userReview', productId, user?.id] });
      setRating(0);
      setComment("");
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  });

  // Update an existing review
  const updateReviewMutation = useMutation({
    mutationFn: async () => {
      if (!user || !userReview) return;
      if (rating === 0) throw new Error("Please select a rating");
      
      const { error } = await supabase
        .from('reviews')
        .update({
          rating,
          comment,
        })
        .eq('id', userReview.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['userReview', productId, user?.id] });
      toast({
        title: "Review updated",
        description: "Your review has been updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  });

  // Calculate average rating
  const averageRating = reviews?.length 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  // Handle rating stars UI
  const renderStars = (value: number, interactive = false) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <div 
            key={star}
            className={`${interactive ? 'cursor-pointer' : ''} text-yellow-400`}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
            onClick={() => interactive && setRating(star)}
          >
            {interactive ? (
              <Star 
                className={`h-6 w-6 ${(hoveredRating || rating) >= star ? 'fill-yellow-400' : 'fill-none'}`} 
              />
            ) : (
              star <= Math.floor(value) ? (
                <Star className="h-5 w-5 fill-yellow-400" />
              ) : star - 0.5 <= value ? (
                <StarHalf className="h-5 w-5 fill-yellow-400" />
              ) : (
                <Star className="h-5 w-5 fill-none" />
              )
            )}
          </div>
        ))}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
      
      {/* Review Summary */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center">
          {renderStars(averageRating)}
          <span className="ml-2 font-medium">
            {averageRating.toFixed(1)} out of 5
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {reviews?.length} {reviews?.length === 1 ? 'review' : 'reviews'}
        </div>
      </div>
      
      {/* Write a review section */}
      {user && !userReview && (
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <h4 className="font-medium mb-3">Write a Review</h4>
          <div className="mb-3">
            <p className="text-sm mb-2">Rating</p>
            {renderStars(rating, true)}
          </div>
          <div className="mb-3">
            <Textarea
              placeholder="Share your experience with this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-24"
            />
          </div>
          <Button 
            onClick={() => createReviewMutation.mutate()}
            disabled={createReviewMutation.isPending || rating === 0}
          >
            {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      )}
      
      {/* Edit existing review */}
      {user && userReview && (
        <div className="bg-gray-50 p-4 rounded-lg mb-8">
          <h4 className="font-medium mb-3">Update Your Review</h4>
          <div className="mb-3">
            <p className="text-sm mb-2">Rating</p>
            {renderStars(rating || userReview.rating, true)}
          </div>
          <div className="mb-3">
            <Textarea
              placeholder="Share your experience with this product..."
              value={comment || userReview.comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-24"
            />
          </div>
          <Button 
            onClick={() => updateReviewMutation.mutate()}
            disabled={updateReviewMutation.isPending}
          >
            {updateReviewMutation.isPending ? 'Updating...' : 'Update Review'}
          </Button>
        </div>
      )}
      
      {/* Reviews list */}
      <div className="space-y-6">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{review.user_name}</p>
                  {review.is_verified_purchase && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                      Verified Purchase
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
              </div>
              <div className="my-1">
                {renderStars(review.rating)}
              </div>
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;
