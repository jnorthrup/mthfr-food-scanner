import { motion } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

interface HomeRecentScansProps {
  recentScans: Product[];
  setActiveTab: (tab: "home" | "scan" | "history" | "settings") => void;
  setCurrentProduct: (product: Product | null) => void;
}

export function HomeRecentScans({
  recentScans,
  setActiveTab,
  setCurrentProduct,
}: HomeRecentScansProps) {
  if (recentScans.length === 0) return null;

  return (
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
  );
}
