
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product, ProductSize } from "@/types/product";
import ProductDialog from "./ProductDialog";

const FeaturedProducts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('is_sale', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data as Product[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });

  const addToCart = async (productId: string, size: ProductSize) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: productId,
          size: size,
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">Loading products...</div>
      </div>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="text-sm text-accent uppercase tracking-wider">Collection</span>
          <h2 className="text-3xl font-bold mt-2">Featured Products</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products?.map((product) => (
            <Card key={product.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
              <div 
                className="relative aspect-square overflow-hidden cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                {product.is_sale && (
                  <Badge 
                    className="absolute top-2 right-2 bg-red-500 text-white border-red-500"
                    variant="secondary"
                  >
                    SALE
                  </Badge>
                )}
              </div>
              <CardContent className="p-4 flex-grow">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-accent font-semibold">₦{product.price.toLocaleString()}</p>
                  {product.is_sale && product.original_price && (
                    <p className="text-gray-500 line-through text-sm">
                      ₦{product.original_price.toLocaleString()}
                    </p>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-2 line-clamp-1 max-h-10">{product.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="w-full space-y-2">
                  <div className="flex flex-wrap gap-2 ">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant="outline"
                        size="sm"
                        onClick={() => addToCart(product.id, size)}
                        className="flex items-center gap-2"
                      >
                        {size}
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => setSelectedProduct(product)}
                  >
                    View Details
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate("/products")}
            className="hover:bg-primary hover:text-white transition-colors"
          >
            View All Products
          </Button>
        </div>
      </div>
      
      <ProductDialog
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
};

export default FeaturedProducts;
