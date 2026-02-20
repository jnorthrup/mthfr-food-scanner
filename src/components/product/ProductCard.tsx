"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Heart,
  ExternalLink,
  Clock,
  Database,
  Camera,
  User,
  ChevronRight,
} from "lucide-react";
import type { Product, SourceProvenance } from "@/types";
import { calculateProductSafety } from "@/lib/engine/classifier";
import { SafetySummary } from "./SafetySummary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onSelect?: () => void;
  onToggleFavorite?: () => void;
  compact?: boolean;
  showDetails?: boolean;
}

const sourceIcons: Record<SourceProvenance, typeof Database> = {
  api: Database,
  ocr: Camera,
  review: ExternalLink,
  manual: User,
  community: User,
};

const sourceLabels: Record<SourceProvenance, string> = {
  api: "Product Database",
  ocr: "Photo OCR",
  review: "Review Data",
  manual: "Manual Entry",
  community: "Community",
};

export function ProductCard({
  product,
  onSelect,
  onToggleFavorite,
  compact = false,
  showDetails = false,
}: ProductCardProps) {
  const safety = calculateProductSafety(product.ingredients);
  const SourceIcon = sourceIcons[product.sourceProvenance];

  if (compact) {
    return (
      <motion.button
        data-design-id={`product-card-compact-${product.upc}`}
        onClick={onSelect}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all text-left"
      >
        {product.imageUrl ? (
          <div
            data-design-id={`product-image-${product.upc}`}
            className="w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0"
          >
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            data-design-id={`product-placeholder-${product.upc}`}
            className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0"
          >
            <span className="text-2xl">📦</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3
            data-design-id={`product-name-${product.upc}`}
            className="font-semibold text-sm truncate"
          >
            {product.name}
          </h3>
          {product.brand && (
            <p
              data-design-id={`product-brand-${product.upc}`}
              className="text-xs text-muted-foreground truncate"
            >
              {product.brand}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <SafetySummary summary={safety} compact />
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      </motion.button>
    );
  }

  return (
    <motion.div
      data-design-id={`product-card-${product.upc}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      <div
        data-design-id={`product-header-${product.upc}`}
        className="relative"
      >
        {product.imageUrl ? (
          <div className="aspect-video bg-muted">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <span className="text-6xl">📦</span>
          </div>
        )}

        {onToggleFavorite && (
          <Button
            data-design-id={`favorite-btn-${product.upc}`}
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="absolute top-3 right-3 glass bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70"
          >
            <Heart
              className={cn(
                "w-5 h-5 transition-colors",
                product.isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-muted-foreground",
              )}
            />
          </Button>
        )}

        <div
          data-design-id={`source-badge-${product.upc}`}
          className="absolute bottom-3 left-3"
        >
          <Badge
            variant="secondary"
            className="glass bg-white/90 dark:bg-black/70"
          >
            <SourceIcon className="w-3 h-3 mr-1" />
            {sourceLabels[product.sourceProvenance]}
          </Badge>
        </div>
      </div>

      <div
        data-design-id={`product-content-${product.upc}`}
        className="p-5 space-y-4"
      >
        <div>
          <h2
            data-design-id={`product-title-${product.upc}`}
            className="text-xl font-bold"
          >
            {product.name}
          </h2>
          {product.brand && (
            <p
              data-design-id={`product-brand-full-${product.upc}`}
              className="text-muted-foreground"
            >
              {product.brand}
            </p>
          )}
          <p
            data-design-id={`product-upc-${product.upc}`}
            className="text-xs text-muted-foreground mt-1 font-mono"
          >
            UPC: {product.upc}
          </p>
        </div>

        <SafetySummary summary={safety} />

        {product.lastScannedAt && (
          <div
            data-design-id={`last-scanned-${product.upc}`}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Clock className="w-3.5 h-3.5" />
            Last scanned: {new Date(product.lastScannedAt).toLocaleDateString()}
          </div>
        )}

        {showDetails && onSelect && (
          <Button
            data-design-id={`view-details-btn-${product.upc}`}
            onClick={onSelect}
            className="w-full"
          >
            View Full Details
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
