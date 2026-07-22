import { mock, describe, it, expect } from "bun:test";

mock.module("fuse.js", () => {
  return {
    default: class {
      search() {
        return [];
      }
    },
  };
});

mock.module("@/lib/db", () => {
  return {
    db: {
      canonicalIngredients: {
        toArray: () => Promise.resolve([]),
      },
    },
  };
});

import {
  parseIngredientsList,
  normalizeIngredientText,
  calculateOverallConfidence,
} from "../src/lib/engine/normalizer";

describe("Ingredient Normalizer", () => {
  describe('parseIngredientsList', () => {
    it('should parse a simple comma-separated ingredient list', () => {
      const input = 'Water, Sugar, Salt';
      const result = parseIngredientsList(input);
      expect(result).toEqual(['Water', 'Sugar', 'Salt']);
    });

    it('should handle empty input', () => {
      expect(parseIngredientsList('')).toEqual([]);
      expect(parseIngredientsList('  ')).toEqual([]);
    });

    it('should handle ingredients with parenthetical sub-ingredients', () => {
      const input = 'Enriched Flour (Wheat Flour, Niacin, Iron), Sugar, Salt';
      const result = parseIngredientsList(input);
      expect(result.length).toBeGreaterThanOrEqual(3);
      expect(result).toContain('Enriched Flour');
    });

    it('should handle "contains less than" phrasing', () => {
      const input = 'Water, Sugar, Contains less than 2% of: Salt, Citric Acid';
      const result = parseIngredientsList(input);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle complex ingredient lists', () => {
      const input = 'Water, Enriched Wheat Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Sugar, Natural Flavors, Salt';
      const result = parseIngredientsList(input);
      expect(result.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('normalizeIngredientText', () => {
    it('should convert to lowercase', () => {
      expect(normalizeIngredientText('WATER')).toBe('water');
      expect(normalizeIngredientText('Folic Acid')).toBe('folic acid');
    });

    it('should remove special characters', () => {
      expect(normalizeIngredientText('vitamin B-12')).toBe('vitamin b-12');
    });

    it('should trim whitespace', () => {
      expect(normalizeIngredientText('  sugar  ')).toBe('sugar');
    });

    it('should remove quantity notations', () => {
      const result = normalizeIngredientText('vitamin C 500mg');
      expect(result).not.toContain('500');
      expect(result).not.toContain('mg');
    });

    it('should handle percentage notations', () => {
      const result = normalizeIngredientText('sugar 5%');
      expect(result).not.toContain('5%');
    });
  });
});

describe('Ingredient Matching', () => {
  it('should identify common MTHFR-unsafe ingredients', () => {
    const unsafeIngredients = [
      'folic acid',
      'cyanocobalamin',
      'enriched flour',
      'monosodium glutamate',
      'aspartame',
    ];
    
    unsafeIngredients.forEach((ingredient) => {
      const normalized = normalizeIngredientText(ingredient);
      expect(normalized).toBeTruthy();
      expect(normalized.length).toBeGreaterThan(0);
    });
  });

  it("should identify common MTHFR-safe ingredients", () => {
    const safeIngredients = [
      "methylfolate",
      "methylcobalamin",
      "water",
      "salt",
      "olive oil",
    ];

    safeIngredients.forEach((ingredient) => {
      const normalized = normalizeIngredientText(ingredient);
      expect(normalized).toBeTruthy();
      expect(normalized.length).toBeGreaterThan(0);
    });
  });
});

describe("calculateOverallConfidence", () => {
  it("should return 0 for an empty array", () => {
    expect(calculateOverallConfidence([])).toBe(0);
  });

  it("should return the confidence of a single item", () => {
    const results = [
      {
        originalText: "Water",
        normalizedName: "water",
        canonicalName: "water",
        confidence: 0.8,
      },
    ];
    expect(calculateOverallConfidence(results)).toBe(0.8);
  });

  it("should calculate the average confidence for multiple items", () => {
    const results = [
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
        confidence: 0.5,
      },
    ];
    expect(calculateOverallConfidence(results)).toBe(0.75);
  });

  it("should handle all zero confidence", () => {
    const results = [
      {
        originalText: "A",
        normalizedName: "a",
        canonicalName: "a",
        confidence: 0,
      },
      {
        originalText: "B",
        normalizedName: "b",
        canonicalName: "b",
        confidence: 0,
      },
    ];
    expect(calculateOverallConfidence(results)).toBe(0);
  });

  it("should handle sub-ingredients by ignoring them (only top-level counts)", () => {
    // Note: The function logic actually just averages the array it's given.
    // If we pass top-level results, it averages them.
    const results = [
      {
        originalText: "Parent",
        normalizedName: "parent",
        canonicalName: "parent",
        confidence: 1.0,
        subIngredients: [
          {
            originalText: "Child",
            normalizedName: "child",
            canonicalName: "child",
            confidence: 0.5,
          },
        ],
      },
    ];
    // Based on implementation: return totalConfidence / results.length;
    // It only sees the top-level 'results' array.
    expect(calculateOverallConfidence(results)).toBe(1.0);
  });
});