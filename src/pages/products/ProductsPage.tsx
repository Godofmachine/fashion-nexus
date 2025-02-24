
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product, ProductCategory, ProductSize } from "@/types/product";
import { ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import ProductDialog from "@/components/ProductDialog";
import { Badge } from "@/components/ui/badge";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category") as ProductCategory | null;
  const isSale = searchParams.get("is_sale") === "true";
  const sortByNewest = searchParams.get("sort") === "newest";
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', category, isSale, sortByNewest],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*');
      
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
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: productId,
          size,
          quantity: 1,
        });

      if (error) throw error;

      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const getPageTitle = () => {
    if (isSale) return 'Sale Items';
    if (sortByNewest) return 'New Arrivals';
    if (category) return `${category.charAt(0).toUpperCase() + category.slice(1)}'s Collection`;
    return 'All Products';
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">
            {getPageTitle()}
          </h1>
          {!isSale && !sortByNewest && (
            <Select
              value={category || "all"}
              onValueChange={(value) => {
                const newSearchParams = new URLSearchParams(searchParams);
                if (value === "all") {
                  newSearchParams.delete("category");
                } else {
                  newSearchParams.set("category", value);
                }
                window.location.search = newSearchParams.toString();
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products?.map((product) => (
              <Card key={product.id} className="group overflow-hidden">
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
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-accent font-semibold">₦{product.price.toLocaleString()}</p>
                    {product.is_sale && product.original_price && (
                      <p className="text-gray-500 line-through text-sm">
                        ₦{product.original_price.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2 min-h-10">{product.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="w-full space-y-2">
                    <div className="flex flex-wrap gap-2">
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
        )}
      </div>
      
      <ProductDialog
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      
      <Footer />
    </div>
  );
};

export default ProductsPage;
