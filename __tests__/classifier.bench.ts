
import { describe, it, expect, mock } from "bun:test";

// Mocking the dependencies
mock.module("@/lib/db", () => ({
  db: {
    classificationRules: {
      toArray: async () => [
        { ingredientPattern: "folic acid", safetyStatus: "unsafe", reason: "MTHFR", profile: "mthfr" },
        { ingredientPattern: "cyanocobalamin", safetyStatus: "unsafe", reason: "MTHFR", profile: "mthfr" },
        { ingredientPattern: "enriched|fortified", safetyStatus: "unsafe", reason: "MTHFR", profile: "mthfr" },
        // Add more rules to make the loop more significant
        ...Array.from({ length: 50 }, (_, i) => ({
          ingredientPattern: `rule${i}`,
          safetyStatus: "unknown",
          reason: `reason${i}`,
          profile: "additives"
        }))
      ],
    },
    maskingTerms: {
      toArray: async () => [
        { term: "natural flavors", reason: "vague", riskLevel: "high", verificationGuidance: "" },
        { term: "artificial flavors", reason: "vague", riskLevel: "high", verificationGuidance: "" },
      ],
    },
    canonicalIngredients: {
      toArray: async () => [],
    },
  },
}));

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

import { initializeClassifier, classifyIngredient } from "../src/lib/engine/classifier";

const iterations = 100000;
const ingredient = {
  originalText: "enriched wheat flour",
  canonicalName: "enriched wheat flour",
  normalizedName: "enriched wheat flour",
  confidence: 1.0,
};

async function runBenchmark() {
  await initializeClassifier();

  // Warm up
  for (let i = 0; i < 1000; i++) {
    classifyIngredient(ingredient as any);
  }

  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    classifyIngredient(ingredient as any);
  }
  const end = performance.now();
  console.log(`Benchmark took ${end - start}ms for ${iterations} iterations`);
  return end - start;
}

runBenchmark();
