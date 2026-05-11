import { describe, it, expect, mock } from "bun:test";
import { calculateProductSafety } from "../src/lib/engine/classifier";
import type { ProductIngredient, SafetyStatus } from "../src/types";

// Mock db and store to avoid issues during module import
mock.module("@/lib/db", () => ({
  db: {
    classificationRules: { toArray: async () => [] },
    maskingTerms: { toArray: async () => [] },
    canonicalIngredients: { toArray: async () => [] },
  },
}));

mock.module("@/lib/store", () => ({
  useAppStore: {
    getState: () => ({ restrictionSettings: {} }),
  },
}));

describe("Classifier Engine - calculateProductSafety", () => {
  const createIngredient = (
    status: SafetyStatus,
    isMasking = false,
    riskLevel: "high" | "medium" | "low" | undefined = undefined,
    subIngredients: ProductIngredient[] | undefined = undefined
  ): ProductIngredient => ({
    originalText: "test ingredient",
    canonicalName: "test ingredient",
    normalizedName: "test ingredient",
    confidence: 1,
    safetyStatus: status,
    isMasking,
    maskingRiskLevel: riskLevel,
    sourceProvenance: "api",
    subIngredients,
  });

  it("should handle an empty array of ingredients safely", () => {
    const result = calculateProductSafety([]);
    expect(result.overallStatus).toBe("unknown");
    expect(result.totalIngredients).toBe(0);
    expect(result.safeCount).toBe(0);
    expect(result.unsafeCount).toBe(0);
    expect(result.unknownCount).toBe(0);
    expect(result.safePercentage).toBe(0);
    expect(result.unsafePercentage).toBe(0);
    expect(result.unknownPercentage).toBe(0);
    expect(result.unsafeIngredients).toHaveLength(0);
    expect(result.maskingIngredients).toHaveLength(0);
  });

  it("should return safe when all ingredients are safe", () => {
    const ingredients = [
      createIngredient("safe"),
      createIngredient("safe"),
    ];
    const result = calculateProductSafety(ingredients);
    expect(result.overallStatus).toBe("safe");
    expect(result.totalIngredients).toBe(2);
    expect(result.safeCount).toBe(2);
    expect(result.safePercentage).toBe(100);
  });

  it("should return unsafe when there is at least one unsafe ingredient", () => {
    const ingredients = [
      createIngredient("safe"),
      createIngredient("unsafe"),
      createIngredient("unknown"),
    ];
    const result = calculateProductSafety(ingredients);
    expect(result.overallStatus).toBe("unsafe");
    expect(result.unsafeCount).toBe(1);
    expect(result.unsafeIngredients).toHaveLength(1);
  });

  it("should return unknown when more than 50% of ingredients are unknown", () => {
    const ingredients = [
      createIngredient("unknown"),
      createIngredient("unknown"),
      createIngredient("safe"),
    ];
    const result = calculateProductSafety(ingredients);
    expect(result.overallStatus).toBe("unknown");
    expect(result.unknownCount).toBe(2);
    expect(result.safeCount).toBe(1);
    expect(result.totalIngredients).toBe(3);
  });

  it("should return unknown when there is a high-risk masking ingredient", () => {
    const ingredients = [
      createIngredient("safe"),
      createIngredient("safe"),
      createIngredient("safe", true, "high"),
    ];
    const result = calculateProductSafety(ingredients);
    expect(result.overallStatus).toBe("unknown");
    expect(result.maskingIngredients).toHaveLength(1);
  });

  it("should correctly flatten and calculate nested sub-ingredients", () => {
    const ingredients = [
      createIngredient("safe", false, undefined, [
        createIngredient("unsafe"),
        createIngredient("safe"),
      ]),
      createIngredient("safe"),
    ];
    const result = calculateProductSafety(ingredients);
    expect(result.totalIngredients).toBe(4); // 2 top level + 2 nested
    expect(result.safeCount).toBe(3);
    expect(result.unsafeCount).toBe(1);
    expect(result.overallStatus).toBe("unsafe");
  });

  it("should return unknown when there are some unknown but under 50% and no high risk", () => {
    const ingredients = [
      createIngredient("unknown"),
      createIngredient("safe"),
      createIngredient("safe"),
      createIngredient("safe"),
    ];
    const result = calculateProductSafety(ingredients);
    expect(result.overallStatus).toBe("unknown");
    expect(result.unknownCount).toBe(1);
  });
});
