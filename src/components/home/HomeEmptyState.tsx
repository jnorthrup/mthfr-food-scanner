import { motion } from "framer-motion";
import { ScanBarcode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeEmptyStateProps {
  setActiveTab: (tab: "home" | "scan" | "history" | "settings") => void;
}

export function HomeEmptyState({ setActiveTab }: HomeEmptyStateProps) {
  return (
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
  );
}
