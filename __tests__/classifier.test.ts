import { describe, it, expect, mock, beforeEach } from "bun:test";
import {
  classifyIngredient,
  calculateProductSafety,
  classifyIngredientsList,
  initializeClassifier
} from "../src/lib/engine/classifier";
import { db } from "@/lib/db";
import { useAppStore } from "@/lib/store";
import type { NormalizationResult, ProductIngredient } from "@/types";

// Mock the database
mock.module("@/lib/db", () => ({
  db: {
    classificationRules: {
      toArray: mock(() => Promise.resolve([])),
    },
    maskingTerms: {
      toArray: mock(() => Promise.resolve([])),
    },
    canonicalIngredients: {
      toArray: mock(() => Promise.resolve([])),
    },
  },
}));

// Mock the store
const mockRestrictionSettings = {
  mthfr: true,
  eu_standards: true,
  genetic_mutations: true,
  allergens: true,
  additives: true,
};

mock.module("@/lib/store", () => ({
  useAppStore: {
    getState: mock(() => ({
      restrictionSettings: mockRestrictionSettings,
    })),
  },
}));

describe("Classifier Engine", () => {
  beforeEach(async () => {
    // Reset mocks for each test
    (db.classificationRules.toArray as any).mockClear();
    (db.maskingTerms.toArray as any).mockClear();
    (db.canonicalIngredients.toArray as any).mockClear();
  });

  describe("classifyIngredient", () => {
    it("should classify known ingredients based on canonical list", async () => {
      (db.canonicalIngredients.toArray as any).mockResolvedValue([
        {
          canonicalName: "folic acid",
          synonyms: ["folacin"],
          safetyStatus: "unsafe",
          safetyReason: "Synthetic folate",
        }
      ]);

      await initializeClassifier();

      const input: NormalizationResult = {
        originalText: "Folacin",
        normalizedName: "folacin",
        canonicalName: "folic acid",
        confidence: 1.0,
      };

      const result = classifyIngredient(input);
      expect(result.safetyStatus).toBe("unsafe");
      expect(result.safetyReason).toBe("Synthetic folate");
      expect(result.canonicalName).toBe("folic acid");
    });

    it("should classify ingredients based on rules when not in canonical list", async () => {
      (db.canonicalIngredients.toArray as any).mockResolvedValue([]);
      (db.classificationRules.toArray as any).mockResolvedValue([
        {
          ingredientPattern: "titanium dioxide",
          safetyStatus: "unsafe",
          reason: "Banned in EU",
          profile: "eu_standards",
        }
      ]);

      await initializeClassifier();

      const input: NormalizationResult = {
        originalText: "Titanium Dioxide",
        normalizedName: "titanium dioxide",
        canonicalName: "titanium dioxide",
        confidence: 1.0,
      };

      const result = classifyIngredient(input);
      expect(result.safetyStatus).toBe("unsafe");
      expect(result.safetyReason).toBe("Banned in EU");
    });

    it("should skip rules if the profile is disabled", async () => {
      (db.canonicalIngredients.toArray as any).mockResolvedValue([]);
      (db.classificationRules.toArray as any).mockResolvedValue([
        {
          ingredientPattern: "titanium dioxide",
          safetyStatus: "unsafe",
          reason: "Banned in EU",
          profile: "eu_standards",
        }
      ]);

      // Disable eu_standards
      (useAppStore.getState as any).mockReturnValue({
        restrictionSettings: { ...mockRestrictionSettings, eu_standards: false }
      });

      await initializeClassifier();

      const input: NormalizationResult = {
        originalText: "Titanium Dioxide",
        normalizedName: "titanium dioxide",
        canonicalName: "titanium dioxide",
        confidence: 1.0,
      };

      const result = classifyIngredient(input);
      expect(result.safetyStatus).toBe("unknown");

      // Restore settings
      (useAppStore.getState as any).mockReturnValue({
        restrictionSettings: mockRestrictionSettings
      });
    });

    it("should detect masking terms", async () => {
      (db.maskingTerms.toArray as any).mockResolvedValue([
        {
          term: "natural flavors",
          riskLevel: "high",
          reason: "May contain MSG",
          verificationGuidance: "Ask manufacturer",
        }
      ]);

      await initializeClassifier();

      const input: NormalizationResult = {
        originalText: "Natural Flavors",
        normalizedName: "natural flavors",
        canonicalName: "natural flavors",
        confidence: 1.0,
      };

      const result = classifyIngredient(input);
      expect(result.isMasking).toBe(true);
      expect(result.maskingRiskLevel).toBe("high");
      expect(result.maskingReason).toBe("May contain MSG");
    });

    it("should detect vague phrases", async () => {
      const input: NormalizationResult = {
        originalText: "May contain peanuts",
        normalizedName: "may contain peanuts",
        canonicalName: "may contain peanuts",
        confidence: 1.0,
      };

      const result = classifyIngredient(input);
      expect(result.isMasking).toBe(true);
      expect(result.maskingRiskLevel).toBe("medium");
      expect(result.maskingReason).toContain("Potential cross-contamination");
    });

    it("should classify sub-ingredients and propagate unsafe status", async () => {
      (db.canonicalIngredients.toArray as any).mockResolvedValue([
        {
          canonicalName: "folic acid",
          synonyms: [],
          safetyStatus: "unsafe",
          safetyReason: "Synthetic folate",
        }
      ]);

      await initializeClassifier();

      const input: NormalizationResult = {
        originalText: "Enriched Flour (Wheat Flour, Folic Acid)",
        normalizedName: "enriched flour",
        canonicalName: "enriched flour",
        confidence: 1.0,
        subIngredients: [
          {
            originalText: "Wheat Flour",
            normalizedName: "wheat flour",
            canonicalName: "wheat flour",
            confidence: 1.0,
          },
          {
            originalText: "Folic Acid",
            normalizedName: "folic acid",
            canonicalName: "folic acid",
            confidence: 1.0,
          }
        ]
      };

      const result = classifyIngredient(input);
      expect(result.safetyStatus).toBe("unsafe");
      expect(result.subIngredients?.length).toBe(2);
      expect(result.subIngredients?.[1].safetyStatus).toBe("unsafe");
      expect(result.safetyReason).toContain("Contains unsafe sub-ingredients: folic acid");
    });
  });

  describe("calculateProductSafety", () => {
    it("should return correct summary for safe ingredients", () => {
      const ingredients: ProductIngredient[] = [
        {
          originalText: "Water",
          canonicalName: "water",
          normalizedName: "water",
          confidence: 1.0,
          safetyStatus: "safe",
          isMasking: false,
          sourceProvenance: "api",
        }
      ];

      const summary = calculateProductSafety(ingredients);
      expect(summary.overallStatus).toBe("safe");
      expect(summary.safeCount).toBe(1);
      expect(summary.totalIngredients).toBe(1);
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
        }
      ];

      const summary = calculateProductSafety(ingredients);
      expect(summary.overallStatus).toBe("unsafe");
      expect(summary.unsafeCount).toBe(1);
    });

    it("should return unknown if high risk masking is present", () => {
      const ingredients: ProductIngredient[] = [
        {
          originalText: "Natural Flavors",
          canonicalName: "natural flavors",
          normalizedName: "natural flavors",
          confidence: 1.0,
          safetyStatus: "unknown",
          isMasking: true,
          maskingRiskLevel: "high",
          sourceProvenance: "api",
        }
      ];

      const summary = calculateProductSafety(ingredients);
      expect(summary.overallStatus).toBe("unknown");
    });
  });

  describe("classifyIngredientsList", () => {
    it("should classify a list of ingredients", async () => {
       const inputs: NormalizationResult[] = [
        {
          originalText: "Water",
          normalizedName: "water",
          canonicalName: "water",
          confidence: 1.0,
        },
        {
          originalText: "Sugar",
          normalizedName: "sugar",
          canonicalName: "sugar",
          confidence: 1.0,
        }
      ];

      const results = classifyIngredientsList(inputs);
      expect(results.length).toBe(2);
      expect(results[0].originalText).toBe("Water");
      expect(results[1].originalText).toBe("Sugar");
    });
  });
});
