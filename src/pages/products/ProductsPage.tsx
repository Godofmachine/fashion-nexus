
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product, ProductSize } from "@/types/product";
import { ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import ProductDialog from "@/components/ProductDialog";
import { Badge } from "@/components/ui/badge";
import ProductFilters from "@/components/ProductFilters";
import { useProductFilters } from "@/hooks/useProductFilters";
import { dataService } from "@/services/dataService";

const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allProducts, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => dataService.getProducts(),
  });

  const {
    filters,
    setFilters,
    clearFilters,
    filteredProducts,
    totalProducts,
    filteredCount,
  } = useProductFilters(allProducts);

  const addToCart = async (productId: string, size: ProductSize) => {
    const activeUser = user || dataService.getCurrentUser();
    
    if (!activeUser) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to add items to cart",
        variant: "destructive",
      });
      return;
    }

    try {
      await dataService.addToCart(activeUser.id, productId, size);

      // Invalidate cart queries to trigger an update
      queryClient.invalidateQueries({ queryKey: ['cart', activeUser.id] });
      queryClient.invalidateQueries({ queryKey: ['cartCount', activeUser.id] });

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

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">All Products</h1>
          
          {/* Search and Filters */}
          <ProductFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
          
          {/* Results Summary */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCount} of {totalProducts} products
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No products found matching your criteria</p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
                  <h3 className="font-medium text-md max-sm:text-lg xl:text-lg min-h-15">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-accent font-semibold">₦{product.price.toLocaleString()}</p>
                    {product.is_sale && product.original_price && (
                      <p className="text-gray-500 line-through text-sm">
                        ₦{product.original_price.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-1 ">{product.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="w-full space-y-2">
                    <div className="flex flex-wrap gap-2 min-h-20">
                      {product.sizes.map((size) => (
                        <Button
                          key={size}
                          variant="outline"
                          size="sm"
                          onClick={() => addToCart(product.id, size)}
                          className="flex items-center gap-2"
                        >
                          {size}
                          <ShoppingCart className="w-3 h-4 lg:h-4 lg:w-4" />
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
