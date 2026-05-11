import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

interface HomeSearchResultsProps {
  filteredHistory: Product[];
  setCurrentProduct: (product: Product | null) => void;
  setActiveTab: (tab: "home" | "scan" | "history" | "settings") => void;
}

export function HomeSearchResults({
  filteredHistory,
  setCurrentProduct,
  setActiveTab,
}: HomeSearchResultsProps) {
  return (
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
  );
}
