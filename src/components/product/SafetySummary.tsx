"use client";

import { motion } from "framer-motion";
import {
  Shield,
  ShieldAlert,
  ShieldQuestion,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import type { ProductSafetySummary, SafetyStatus } from "@/types";
import { cn } from "@/lib/utils";

interface SafetySummaryProps {
  summary: ProductSafetySummary;
  compact?: boolean;
}

const statusConfig: Record<
  SafetyStatus,
  {
    icon: typeof Shield;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  safe: {
    icon: Shield,
    label: "MTHFR Safe",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  unsafe: {
    icon: ShieldAlert,
    label: "Contains Unsafe Ingredients",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/50",
    borderColor: "border-red-200 dark:border-red-800",
  },
  unknown: {
    icon: ShieldQuestion,
    label: "Requires Review",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
};

export function SafetySummary({
  summary,
  compact = false,
}: SafetySummaryProps) {
  const config = statusConfig[summary.overallStatus];
  const StatusIcon = config.icon;

  if (compact) {
    return (
      <div
        data-design-id="safety-summary-compact"
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border",
          config.bgColor,
          config.borderColor,
        )}
      >
        <StatusIcon className={cn("w-4 h-4", config.color)} />
        <span className={cn("text-sm font-medium", config.color)}>
          {summary.overallStatus === "safe"
            ? "Safe"
            : summary.overallStatus === "unsafe"
              ? `${summary.unsafeCount} Unsafe`
              : "Review Needed"}
        </span>
      </div>
    );
  }

  return (
    <motion.div
      data-design-id="safety-summary"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl border-2 p-5 space-y-4",
        config.bgColor,
        config.borderColor,
      )}
    >
      <div
        data-design-id="safety-summary-header"
        className="flex items-center gap-3"
      >
        <div
          className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center",
            summary.overallStatus === "safe"
              ? "bg-emerald-500"
              : summary.overallStatus === "unsafe"
                ? "bg-red-500"
                : "bg-amber-500",
          )}
        >
          <StatusIcon className="w-7 h-7 text-white" />
        </div>
        <div>
          <h3
            data-design-id="safety-summary-title"
            className={cn("text-lg font-bold", config.color)}
          >
            {config.label}
          </h3>
          <p
            data-design-id="safety-summary-subtitle"
            className="text-sm text-muted-foreground"
          >
            {summary.totalIngredients} ingredients analyzed
          </p>
        </div>
      </div>

      <div data-design-id="safety-summary-bars" className="space-y-2">
        <div className="h-3 rounded-full bg-muted overflow-hidden flex">
          <motion.div
            data-design-id="safety-bar-safe"
            initial={{ width: 0 }}
            animate={{ width: `${summary.safePercentage}%` }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-full bg-emerald-500"
          />
          <motion.div
            data-design-id="safety-bar-unknown"
            initial={{ width: 0 }}
            animate={{ width: `${summary.unknownPercentage}%` }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-full bg-amber-500"
          />
          <motion.div
            data-design-id="safety-bar-unsafe"
            initial={{ width: 0 }}
            animate={{ width: `${summary.unsafePercentage}%` }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="h-full bg-red-500"
          />
        </div>

        <div
          data-design-id="safety-summary-legend"
          className="flex justify-between text-xs"
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              {summary.safeCount} Safe ({summary.safePercentage}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {summary.unknownCount} Unknown ({summary.unknownPercentage}%)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-red-500" />
            <span>
              {summary.unsafeCount} Unsafe ({summary.unsafePercentage}%)
            </span>
          </div>
        </div>
      </div>

      {summary.unsafeIngredients.length > 0 && (
        <div data-design-id="unsafe-ingredients-list" className="space-y-2">
          <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Unsafe Ingredients
          </h4>
          <div className="space-y-1.5">
            {summary.unsafeIngredients.slice(0, 5).map((ing, index) => (
              <div
                key={index}
                data-design-id={`unsafe-ingredient-${index}`}
                className="flex items-start gap-2 text-sm bg-red-100 dark:bg-red-900/30 rounded-lg px-3 py-2"
              >
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-red-700 dark:text-red-300">
                    {ing.canonicalName}
                  </span>
                  {ing.safetyReason && (
                    <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">
                      {ing.safetyReason}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {summary.unsafeIngredients.length > 5 && (
              <p className="text-xs text-red-500 pl-6">
                +{summary.unsafeIngredients.length - 5} more unsafe ingredients
              </p>
            )}
          </div>
        </div>
      )}

      {summary.maskingIngredients.length > 0 && (
        <div data-design-id="masking-ingredients-list" className="space-y-2">
          <h4 className="text-sm font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Masking Ingredients
          </h4>
          <div className="space-y-1.5">
            {summary.maskingIngredients.slice(0, 3).map((ing, index) => (
              <div
                key={index}
                data-design-id={`masking-ingredient-${index}`}
                className="flex items-start gap-2 text-sm bg-violet-100 dark:bg-violet-900/30 rounded-lg px-3 py-2"
              >
                <AlertTriangle className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-violet-700 dark:text-violet-300">
                    {ing.canonicalName}
                  </span>
                  {ing.maskingReason && (
                    <p className="text-xs text-violet-600/80 dark:text-violet-400/80 mt-0.5">
                      {ing.maskingReason}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
