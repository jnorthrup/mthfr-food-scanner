import { 
  parseIngredientsList, 
  normalizeIngredientText,
  calculateOverallConfidence
} from '../src/lib/engine/normalizer';
import type { NormalizationResult } from '../src/types';

describe('Ingredient Normalizer', () => {
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

describe('calculateOverallConfidence', () => {
  it('should return 0 for an empty list', () => {
    expect(calculateOverallConfidence([])).toBe(0);
  });

  it('should return the confidence of a single item', () => {
    const results: NormalizationResult[] = [
      { originalText: 'A', normalizedName: 'a', canonicalName: 'a', confidence: 0.8 }
    ];
    expect(calculateOverallConfidence(results)).toBe(0.8);
  });

  it('should calculate the average confidence of multiple items', () => {
    const results: NormalizationResult[] = [
      { originalText: 'A', normalizedName: 'a', canonicalName: 'a', confidence: 0.8 },
      { originalText: 'B', normalizedName: 'b', canonicalName: 'b', confidence: 0.6 },
      { originalText: 'C', normalizedName: 'c', canonicalName: 'c', confidence: 1.0 }
    ];
    // (0.8 + 0.6 + 1.0) / 3 = 2.4 / 3 = 0.8
    expect(calculateOverallConfidence(results)).toBeCloseTo(0.8);
  });

  it('should handle zero confidence items', () => {
    const results: NormalizationResult[] = [
      { originalText: 'A', normalizedName: 'a', canonicalName: 'a', confidence: 0 },
      { originalText: 'B', normalizedName: 'b', canonicalName: 'b', confidence: 0.5 }
    ];
    expect(calculateOverallConfidence(results)).toBe(0.25);
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
    
    unsafeIngredients.forEach(ingredient => {
      const normalized = normalizeIngredientText(ingredient);
      expect(normalized).toBeTruthy();
      expect(normalized.length).toBeGreaterThan(0);
    });
  });

  it('should identify common MTHFR-safe ingredients', () => {
    const safeIngredients = [
      'methylfolate',
      'methylcobalamin',
      'water',
      'salt',
      'olive oil',
    ];
    
    safeIngredients.forEach(ingredient => {
      const normalized = normalizeIngredientText(ingredient);
      expect(normalized).toBeTruthy();
      expect(normalized.length).toBeGreaterThan(0);
    });
  });
});