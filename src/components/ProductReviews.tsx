
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { dataService } from "@/services/dataService";
import { Review } from "@/types/review";

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => dataService.getReviews(productId),
  });

  const createReviewMutation = useMutation({
    mutationFn: (reviewData: Omit<Review, 'id' | 'created_at' | 'user_name'>) =>
      dataService.createReview(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      setRating(0);
      setComment("");
      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const handleSubmitReview = () => {
    if (!user || !rating) return;

    createReviewMutation.mutate({
      user_id: user.id,
      product_id: productId,
      rating,
      comment,
      is_verified_purchase: false,
    });
  };

  const renderStars = (count: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        } ${interactive ? "cursor-pointer" : ""}`}
        onClick={interactive ? () => setRating(i + 1) : undefined}
      />
    ));
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
    : 0;

  if (isLoading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
      
      {reviews.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
            <span className="text-sm text-gray-600">
              ({averageRating.toFixed(1)} out of 5 from {reviews.length} reviews)
            </span>
          </div>
        </div>
      )}

      {user && (
        <div className="mb-6 p-4 border rounded-lg">
          <h4 className="font-medium mb-3">Write a Review</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex">{renderStars(rating, true)}</div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Comment</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                className="w-full"
              />
            </div>
            <Button 
              onClick={handleSubmitReview}
              disabled={!rating || createReviewMutation.isPending}
            >
              {createReviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{review.user_name}</span>
                {review.is_verified_purchase && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Verified Purchase
                  </span>
                )}
              </div>
              <div className="flex">{renderStars(review.rating)}</div>
            </div>
            {review.comment && (
              <p className="text-gray-700 mb-2">{review.comment}</p>
            )}
            <p className="text-xs text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No reviews yet. Be the first to review this product!
        </p>
      )}
    </div>
  );
};

export default ProductReviews;
