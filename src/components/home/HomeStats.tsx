import { motion } from "framer-motion";
import { TrendingUp, Heart, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types";

interface HomeStatsProps {
  scanHistory: Product[];
  favorites: Product[];
}

export function HomeStats({ scanHistory, favorites }: HomeStatsProps) {
  return (
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
  );
}
