import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Search, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Product, ProductCategory, ProductSize } from "@/types/product";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") as ProductCategory | null;
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', category, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*');

      if (category) {
        query = query.eq('category', category);
      }

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as Product[];
    },
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

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 pt-24">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}'s Collection` : "All Products"}
          </h1>
          <div className="relative w-full md:w-96">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading products...</div>
        ) : products?.length === 0 ? (
          <div className="text-center py-8">No products found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <Card key={product.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4 flex-grow">
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <p className="text-accent mt-2">₦{product.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="w-full space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <Button
                          key={size}
                          variant="outline"
                          size="sm"
                          onClick={() => addToCart(product.id, size as ProductSize)}
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
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
