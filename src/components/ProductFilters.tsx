
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { ProductCategory } from "@/types/product";

interface FilterState {
  search: string;
  category: ProductCategory | "all";
  priceRange: "all" | "under-20k" | "20k-50k" | "over-50k";
  onSale: boolean | null;
  sortBy: "newest" | "price-low" | "price-high" | "name";
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const ProductFilters = ({ filters, onFiltersChange, onClearFilters }: ProductFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = 
    filters.search !== "" ||
    filters.category !== "all" ||
    filters.priceRange !== "all" ||
    filters.onSale !== null ||
    filters.sortBy !== "newest";

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-1">
              Active
            </Badge>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="flex items-center gap-2 text-sm"
          >
            <X className="h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => updateFilter("category", value as ProductCategory | "all")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="men">Men</SelectItem>
                <SelectItem value="women">Women</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <Label>Price Range</Label>
            <Select
              value={filters.priceRange}
              onValueChange={(value) => updateFilter("priceRange", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under-20k">Under ₦20,000</SelectItem>
                <SelectItem value="20k-50k">₦20,000 - ₦50,000</SelectItem>
                <SelectItem value="over-50k">Over ₦50,000</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sale Filter */}
          <div className="space-y-2">
            <Label>Availability</Label>
            <Select
              value={filters.onSale === null ? "all" : filters.onSale ? "sale" : "regular"}
              onValueChange={(value) => 
                updateFilter("onSale", value === "all" ? null : value === "sale")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="sale">On Sale</SelectItem>
                <SelectItem value="regular">Regular Price</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => updateFilter("sortBy", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="outline" className="flex items-center gap-1">
              Search: "{filters.search}"
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter("search", "")}
              />
            </Badge>
          )}
          {filters.category !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              {filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter("category", "all")}
              />
            </Badge>
          )}
          {filters.priceRange !== "all" && (
            <Badge variant="outline" className="flex items-center gap-1">
              {filters.priceRange === "under-20k" && "Under ₦20,000"}
              {filters.priceRange === "20k-50k" && "₦20,000 - ₦50,000"}
              {filters.priceRange === "over-50k" && "Over ₦50,000"}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter("priceRange", "all")}
              />
            </Badge>
          )}
          {filters.onSale !== null && (
            <Badge variant="outline" className="flex items-center gap-1">
              {filters.onSale ? "On Sale" : "Regular Price"}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter("onSale", null)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
