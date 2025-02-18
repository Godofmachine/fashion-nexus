
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product, ProductSize } from "@/types/product";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface ProductDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDialog = ({ product, isOpen, onClose }: ProductDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const addToCart = async (size: ProductSize) => {
    if (!user || !product) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: product.id,
          size,
          quantity: 1,
        });

      if (error) throw error;

      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
      navigate("/cart");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <img
              src={product.images[0]}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">{product.name}</h3>
              <p className="text-accent text-xl font-semibold mt-2">
                ₦{product.price.toLocaleString()}
              </p>
            </div>
            <p className="text-gray-600">{product.description}</p>
            <div>
              <h4 className="font-medium mb-2">Available Sizes</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant="outline"
                    onClick={() => addToCart(size)}
                    className="flex items-center gap-2"
                  >
                    {size}
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
