"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  History,
  Heart,
  Trash2,
  Filter,
  SortAsc,
  Search,
  Package,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { calculateProductSafety } from "@/lib/engine/classifier";
import { ProductCard } from "@/components/product/ProductCard";
import { IngredientList } from "@/components/product/IngredientList";
import { SafetySummary } from "@/components/product/SafetySummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product, SafetyStatus } from "@/types";

type SortOption = "recent" | "name" | "safety";
type FilterOption = "all" | "safe" | "unsafe" | "unknown";

export function HistoryScreen() {
  const {
    scanHistory,
    favorites,
    currentProduct,
    setCurrentProduct,
    toggleFavorite,
    clearHistory,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  const getProductSafetyStatus = (product: Product): SafetyStatus => {
    const safety = calculateProductSafety(product.ingredients);
    return safety.overallStatus;
  };

  const filterProducts = (products: Product[]) => {
    let filtered = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query) ||
          p.upc.includes(query),
      );
    }

    if (filterBy !== "all") {
      filtered = filtered.filter((p) => getProductSafetyStatus(p) === filterBy);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "safety": {
          const priority = { unsafe: 0, unknown: 1, safe: 2 };
          return (
            priority[getProductSafetyStatus(a)] -
            priority[getProductSafetyStatus(b)]
          );
        }
        case "recent":
        default:
          return (
            new Date(b.lastScannedAt || b.createdAt).getTime() -
            new Date(a.lastScannedAt || a.createdAt).getTime()
          );
      }
    });

    return filtered;
  };

  const displayProducts = activeTab === "favorites" ? favorites : scanHistory;
  const filteredProducts = filterProducts(displayProducts);

  if (currentProduct) {
    const safety = calculateProductSafety(currentProduct.ingredients);

    return (
      <div
        data-design-id="product-detail"
        className="h-full flex flex-col bg-background"
      >
        <div
          data-design-id="detail-header"
          className="p-4 flex items-center gap-3 border-b"
        >
          <Button
            data-design-id="detail-back"
            variant="ghost"
            size="icon"
            onClick={() => setCurrentProduct(null)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="font-semibold flex-1 truncate">
            {currentProduct.name}
          </h2>
          <Button
            data-design-id="detail-favorite"
            variant="ghost"
            size="icon"
            onClick={() =>
              currentProduct.id && toggleFavorite(currentProduct.id)
            }
          >
            <Heart
              className={`w-5 h-5 ${currentProduct.isFavorite ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-5 space-y-6 pb-24">
            <ProductCard product={currentProduct} />

            <IngredientList
              ingredients={currentProduct.ingredients}
              showProvenance
            />

            <div
              data-design-id="product-meta"
              className="text-xs text-muted-foreground space-y-1"
            >
              <p>UPC: {currentProduct.upc}</p>
              <p>Source: {currentProduct.sourceProvenance}</p>
              <p>
                Added: {new Date(currentProduct.createdAt).toLocaleDateString()}
              </p>
              {currentProduct.lastScannedAt && (
                <p>
                  Last scanned:{" "}
                  {new Date(currentProduct.lastScannedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div
      data-design-id="history-screen"
      className="h-full flex flex-col bg-background"
    >
      <div data-design-id="history-header" className="p-4 border-b space-y-4">
        <div className="flex items-center justify-between">
          <h1 data-design-id="history-title" className="text-xl font-bold">
            Product History
          </h1>
          <Badge data-design-id="history-count" variant="secondary">
            {scanHistory.length} products
          </Badge>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "all" | "favorites")}
        >
          <TabsList data-design-id="history-tabs" className="w-full">
            <TabsTrigger
              data-design-id="tab-all"
              value="all"
              className="flex-1"
            >
              <History className="w-4 h-4 mr-2" />
              All Scans
            </TabsTrigger>
            <TabsTrigger
              data-design-id="tab-favorites"
              value="favorites"
              className="flex-1"
            >
              <Heart className="w-4 h-4 mr-2" />
              Favorites ({favorites.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              data-design-id="history-search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button data-design-id="filter-btn" variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterBy("all")}>
                All Products
                {filterBy === "all" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("safe")}>
                Safe Only
                {filterBy === "safe" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("unsafe")}>
                Unsafe Only
                {filterBy === "unsafe" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("unknown")}>
                Unknown Only
                {filterBy === "unknown" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button data-design-id="sort-btn" variant="outline" size="icon">
                <SortAsc className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("recent")}>
                Most Recent
                {sortBy === "recent" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                Name (A-Z)
                {sortBy === "name" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("safety")}>
                Safety Status
                {sortBy === "safety" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 pb-24 space-y-2">
          <AnimatePresence mode="popLayout">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ProductCard
                    product={product}
                    compact
                    onSelect={() => setCurrentProduct(product)}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                data-design-id="history-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 data-design-id="empty-title" className="font-semibold mb-2">
                  {searchQuery
                    ? "No matching products"
                    : activeTab === "favorites"
                      ? "No favorites yet"
                      : "No products scanned"}
                </h3>
                <p
                  data-design-id="empty-desc"
                  className="text-sm text-muted-foreground"
                >
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : activeTab === "favorites"
                      ? "Tap the heart icon on a product to add it to favorites"
                      : "Start scanning products to build your history"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
}
