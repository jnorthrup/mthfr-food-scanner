import { describe, it, expect, mock } from "bun:test";
import { calculateProductSafety } from "@/lib/engine/classifier";
import type { ProductIngredient } from "@/types";

// Mock the store and db
mock.module("@/lib/store", () => ({
  useAppStore: {
    getState: () => ({
      restrictionSettings: {
        mthfr: true,
        eu_standards: true,
        genetic_mutations: true,
        allergens: true,
        additives: true,
      },
    }),
  },
}));

mock.module("@/lib/db", () => ({
  db: {
    classificationRules: { toArray: async () => [] },
    maskingTerms: { toArray: async () => [] },
    canonicalIngredients: { toArray: async () => [] },
  },
}));

describe("calculateProductSafety", () => {
  it("should return a safe summary for an empty ingredients list", () => {
    const ingredients: ProductIngredient[] = [];
    const summary = calculateProductSafety(ingredients);

    expect(summary.overallStatus).toBe("safe");
    expect(summary.safeCount).toBe(0);
    expect(summary.totalIngredients).toBe(0);
    expect(summary.safePercentage).toBe(0);
  });

  it("should return a safe summary when all ingredients are safe", () => {
    const ingredients: ProductIngredient[] = [
      {
        originalText: "Water",
        canonicalName: "water",
        normalizedName: "water",
        confidence: 1.0,
        safetyStatus: "safe",
        isMasking: false,
        sourceProvenance: "api",
      },
      {
        originalText: "Salt",
        canonicalName: "salt",
        normalizedName: "salt",
        confidence: 1.0,
        safetyStatus: "safe",
        isMasking: false,
        sourceProvenance: "api",
      },
    ];
    const summary = calculateProductSafety(ingredients);

    expect(summary.overallStatus).toBe("safe");
    expect(summary.safeCount).toBe(2);
    expect(summary.unsafeCount).toBe(0);
    expect(summary.unknownCount).toBe(0);
    expect(summary.safePercentage).toBe(100);
  });

  it("should return unsafe if any ingredient is unsafe", () => {
    const ingredients: ProductIngredient[] = [
      {
        originalText: "Water",
        canonicalName: "water",
        normalizedName: "water",
        confidence: 1.0,
        safetyStatus: "safe",
        isMasking: false,
        sourceProvenance: "api",
      },
      {
        originalText: "Folic Acid",
        canonicalName: "folic acid",
        normalizedName: "folic acid",
        confidence: 1.0,
        safetyStatus: "unsafe",
        isMasking: false,
        sourceProvenance: "api",
      },
    ];
    const summary = calculateProductSafety(ingredients);

    expect(summary.overallStatus).toBe("unsafe");
    expect(summary.unsafeCount).toBe(1);
    expect(summary.unsafeIngredients.length).toBe(1);
    expect(summary.unsafeIngredients[0].canonicalName).toBe("folic acid");
  });

  it("should return unknown if most ingredients are unknown", () => {
    const ingredients: ProductIngredient[] = [
      {
        originalText: "Unknown 1",
        canonicalName: "unknown 1",
        normalizedName: "unknown 1",
        confidence: 0.5,
        safetyStatus: "unknown",
        isMasking: false,
        sourceProvenance: "api",
      },
      {
        originalText: "Unknown 2",
        canonicalName: "unknown 2",
        normalizedName: "unknown 2",
        confidence: 0.5,
        safetyStatus: "unknown",
        isMasking: false,
        sourceProvenance: "api",
      },
      {
        originalText: "Water",
        canonicalName: "water",
        normalizedName: "water",
        confidence: 1.0,
        safetyStatus: "safe",
        isMasking: false,
        sourceProvenance: "api",
      },
    ];
    const summary = calculateProductSafety(ingredients);

    expect(summary.overallStatus).toBe("unknown");
    expect(summary.unknownCount).toBe(2);
    expect(summary.unknownPercentage).toBe(67); // 2/3 = 66.66% -> 67%
  });

  it("should prioritize unsafe over unknown", () => {
    const ingredients: ProductIngredient[] = [
      {
        originalText: "Folic Acid",
        canonicalName: "folic acid",
        normalizedName: "folic acid",
        confidence: 1.0,
        safetyStatus: "unsafe",
        isMasking: false,
        sourceProvenance: "api",
      },
      {
        originalText: "Unknown",
        canonicalName: "unknown",
        normalizedName: "unknown",
        confidence: 0.5,
        safetyStatus: "unknown",
        isMasking: false,
        sourceProvenance: "api",
      },
    ];
    const summary = calculateProductSafety(ingredients);

    expect(summary.overallStatus).toBe("unsafe");
  });

  it("should handle nested ingredients correctly", () => {
    const ingredients: ProductIngredient[] = [
      {
        originalText: "Parent",
        canonicalName: "parent",
        normalizedName: "parent",
        confidence: 1.0,
        safetyStatus: "safe",
        isMasking: false,
        sourceProvenance: "api",
        subIngredients: [
          {
            originalText: "Child",
            canonicalName: "child",
            normalizedName: "child",
            confidence: 1.0,
            safetyStatus: "unsafe",
            isMasking: false,
            sourceProvenance: "api",
          },
        ],
      },
    ];
    const summary = calculateProductSafety(ingredients);

    // parent + child = 2 ingredients
    expect(summary.totalIngredients).toBe(2);
    expect(summary.unsafeCount).toBe(1);
    expect(summary.overallStatus).toBe("unsafe");
  });

  it("should return unknown for high risk masking ingredients", () => {
    const ingredients: ProductIngredient[] = [
      {
        originalText: "Natural Flavors",
        canonicalName: "natural flavors",
        normalizedName: "natural flavors",
        confidence: 1.0,
        safetyStatus: "safe",
        isMasking: true,
        maskingRiskLevel: "high",
        sourceProvenance: "api",
      },
    ];
    const summary = calculateProductSafety(ingredients);

    expect(summary.overallStatus).toBe("unknown");
    expect(summary.maskingIngredients.length).toBe(1);
  });
});
