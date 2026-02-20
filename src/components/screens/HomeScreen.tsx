"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ScanBarcode,
  Plus,
  TrendingUp,
  Clock,
  Heart,
  Search,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/product/ProductCard";
import { ScrollArea } from "@/components/ui/scroll-area";

export function HomeScreen() {
  const { scanHistory, favorites, setActiveTab, setCurrentProduct } =
    useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const recentScans = scanHistory.slice(0, 5);
  const filteredHistory = searchQuery
    ? scanHistory.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.upc.includes(searchQuery),
      )
    : [];

  return (
    <ScrollArea className="h-full">
      <div data-design-id="home-screen" className="pb-24 px-5 pt-4 space-y-6">
        <motion.div
          data-design-id="home-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 data-design-id="home-greeting" className="text-2xl font-bold">
            {greeting}
          </h1>
          <p data-design-id="home-subtitle" className="text-muted-foreground">
            Ready to scan your next product?
          </p>
        </motion.div>

        <motion.div
          data-design-id="home-search"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            data-design-id="home-search-input"
            placeholder="Search scanned products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </motion.div>

        {searchQuery && filteredHistory.length > 0 && (
          <motion.div
            data-design-id="search-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <h3 className="font-semibold text-sm text-muted-foreground">
              Search Results
            </h3>
            <div className="space-y-2">
              {filteredHistory.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  compact
                  onSelect={() => {
                    setCurrentProduct(product);
                    setActiveTab("history");
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {!searchQuery && (
          <>
            <motion.div
              data-design-id="quick-actions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-3"
            >
              <Button
                data-design-id="action-scan"
                onClick={() => setActiveTab("scan")}
                className="h-28 flex-col gap-2 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/20"
              >
                <ScanBarcode className="w-8 h-8" />
                <span className="font-semibold">Scan Product</span>
              </Button>

              <Button
                data-design-id="action-manual"
                variant="outline"
                onClick={() => setActiveTab("scan")}
                className="h-28 flex-col gap-2 rounded-2xl border-2 hover:bg-secondary/50"
              >
                <Plus className="w-8 h-8" />
                <span className="font-semibold">Add Manually</span>
              </Button>
            </motion.div>

            <motion.div
              data-design-id="stats-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-3"
            >
              <Card
                data-design-id="stat-scanned"
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800"
              >
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-5 h-5 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                  <p
                    data-design-id="stat-scanned-value"
                    className="text-2xl font-bold text-blue-700 dark:text-blue-300"
                  >
                    {scanHistory.length}
                  </p>
                  <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                    Scanned
                  </p>
                </CardContent>
              </Card>

              <Card
                data-design-id="stat-favorites"
                className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/30 border-pink-200 dark:border-pink-800"
              >
                <CardContent className="p-4 text-center">
                  <Heart className="w-5 h-5 mx-auto mb-1 text-pink-600 dark:text-pink-400" />
                  <p
                    data-design-id="stat-favorites-value"
                    className="text-2xl font-bold text-pink-700 dark:text-pink-300"
                  >
                    {favorites.length}
                  </p>
                  <p className="text-xs text-pink-600/80 dark:text-pink-400/80">
                    Favorites
                  </p>
                </CardContent>
              </Card>

              <Card
                data-design-id="stat-safe"
                className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30 border-emerald-200 dark:border-emerald-800"
              >
                <CardContent className="p-4 text-center">
                  <Sparkles className="w-5 h-5 mx-auto mb-1 text-emerald-600 dark:text-emerald-400" />
                  <p
                    data-design-id="stat-safe-value"
                    className="text-2xl font-bold text-emerald-700 dark:text-emerald-300"
                  >
                    {
                      scanHistory.filter((p) =>
                        p.ingredients.every((i) => i.safetyStatus === "safe"),
                      ).length
                    }
                  </p>
                  <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                    Safe
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {recentScans.length > 0 && (
              <motion.div
                data-design-id="recent-scans"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3
                    data-design-id="recent-title"
                    className="font-semibold flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Recent Scans
                  </h3>
                  <Button
                    data-design-id="view-all-btn"
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab("history")}
                    className="text-primary"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {recentScans.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <ProductCard
                        product={product}
                        compact
                        onSelect={() => {
                          setCurrentProduct(product);
                          setActiveTab("history");
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {recentScans.length === 0 && (
              <motion.div
                data-design-id="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <ScanBarcode className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 data-design-id="empty-title" className="font-semibold mb-2">
                  No products scanned yet
                </h3>
                <p
                  data-design-id="empty-desc"
                  className="text-sm text-muted-foreground mb-4"
                >
                  Start by scanning a product barcode or adding one manually
                </p>
                <Button
                  data-design-id="empty-cta"
                  onClick={() => setActiveTab("scan")}
                >
                  <ScanBarcode className="w-4 h-4 mr-2" />
                  Scan Your First Product
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </ScrollArea>
  );
}
