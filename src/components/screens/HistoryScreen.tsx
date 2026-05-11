"use client";

import { useState, useMemo } from "react";
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

function useHistoryFilter(products: Product[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");

  const getProductSafetyStatus = (product: Product): SafetyStatus => {
    const safety = calculateProductSafety(product.ingredients);
    return safety.overallStatus;
  };

  const filteredProducts = useMemo(() => {
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
  }, [products, searchQuery, filterBy, sortBy]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    filteredProducts,
  };
}

function ProductList({
  products,
  searchQuery,
  activeTab,
  onSelectProduct,
}: {
  products: Product[];
  searchQuery: string;
  activeTab: "all" | "favorites";
  onSelectProduct: (product: Product) => void;
}) {
  return (
    <AnimatePresence mode="popLayout">
      {products.length > 0 ? (
        products.map((product, index) => (
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
              onSelect={() => onSelectProduct(product)}
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
  );
}

function ProductDetailView({
  product,
  onBack,
  onToggleFavorite,
}: {
  product: Product;
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
}) {
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
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="font-semibold flex-1 truncate">{product.name}</h2>
        <Button
          data-design-id="detail-favorite"
          variant="ghost"
          size="icon"
          onClick={() => product.id && onToggleFavorite(product.id)}
        >
          <Heart
            className={`w-5 h-5 ${product.isFavorite ? "fill-red-500 text-red-500" : ""}`}
          />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6 pb-24">
          <ProductCard product={product} />

          <IngredientList ingredients={product.ingredients} showProvenance />

          <div
            data-design-id="product-meta"
            className="text-xs text-muted-foreground space-y-1"
          >
            <p>UPC: {product.upc}</p>
            <p>Source: {product.sourceProvenance}</p>
            <p>Added: {new Date(product.createdAt).toLocaleDateString()}</p>
            {product.lastScannedAt && (
              <p>
                Last scanned:{" "}
                {new Date(product.lastScannedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export function HistoryScreen() {
  const {
    scanHistory,
    favorites,
    currentProduct,
    setCurrentProduct,
    toggleFavorite,
    clearHistory,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const displayProducts = activeTab === "favorites" ? favorites : scanHistory;

  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterBy,
    setFilterBy,
    filteredProducts,
  } = useHistoryFilter(displayProducts);

  if (currentProduct) {
    return (
      <ProductDetailView
        product={currentProduct}
        onBack={() => setCurrentProduct(null)}
        onToggleFavorite={toggleFavorite}
      />
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
          <ProductList
            products={filteredProducts}
            searchQuery={searchQuery}
            activeTab={activeTab}
            onSelectProduct={setCurrentProduct}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
