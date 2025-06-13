
import { useState, useMemo } from "react";
import { Product, ProductCategory } from "@/types/product";

interface FilterState {
  search: string;
  category: ProductCategory | "all";
  priceRange: "all" | "under-20k" | "20k-50k" | "over-50k";
  onSale: boolean | null;
  sortBy: "newest" | "price-low" | "price-high" | "name";
}

const initialFilters: FilterState = {
  search: "",
  category: "all",
  priceRange: "all",
  onSale: null,
  sortBy: "newest",
};

export const useProductFilters = (products: Product[] = []) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      filtered = filtered.filter(product => {
        switch (filters.priceRange) {
          case "under-20k":
            return product.price < 20000;
          case "20k-50k":
            return product.price >= 20000 && product.price <= 50000;
          case "over-50k":
            return product.price > 50000;
          default:
            return true;
        }
      });
    }

    // Sale filter
    if (filters.onSale !== null) {
      filtered = filtered.filter(product => product.is_sale === filters.onSale);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filters]);

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  return {
    filters,
    setFilters,
    clearFilters,
    filteredProducts: filteredAndSortedProducts,
    totalProducts: products.length,
    filteredCount: filteredAndSortedProducts.length,
  };
};
