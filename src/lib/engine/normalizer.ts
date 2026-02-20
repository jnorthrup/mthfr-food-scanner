import Fuse from 'fuse.js';
import { db } from '@/lib/db';
import type { NormalizationResult, CanonicalIngredient } from '@/types';

let fuseIndex: Fuse<CanonicalIngredient> | null = null;
let ingredientCache: Map<string, CanonicalIngredient> = new Map();

export async function initializeNormalizer(): Promise<void> {
  const ingredients = await db.canonicalIngredients.toArray();
  
  ingredientCache.clear();
  for (const ing of ingredients) {
    ingredientCache.set(ing.canonicalName.toLowerCase(), ing);
    for (const synonym of ing.synonyms) {
      ingredientCache.set(synonym.toLowerCase(), ing);
    }
  }
  
  const searchableIngredients = ingredients.flatMap(ing => [
    { ...ing, searchName: ing.canonicalName },
    ...ing.synonyms.map(syn => ({ ...ing, searchName: syn })),
  ]);
  
  fuseIndex = new Fuse(searchableIngredients, {
    keys: ['searchName'],
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
  });
}

export function parseIngredientsList(rawText: string): string[] {
  if (!rawText || rawText.trim() === '') {
    return [];
  }
  
  let text = rawText;
  
  text = text.replace(/contains\s*(?:less\s*than\s*)?[\d.]+%\s*(?:of\s*)?:?/gi, ',');
  text = text.replace(/contains\s*(?:one\s*or\s*more\s*of\s*)?:?/gi, ',');
  text = text.replace(/may\s*contain:?/gi, ',');
  text = text.replace(/ingredients:?/gi, '');
  
  text = text.replace(/\s*\([^()]*\)/g, (match) => {
    const inner = match.slice(1, -1);
    if (inner.includes(',')) {
      return ` [${inner}]`;
    }
    return match;
  });
  
  const mainIngredients = text.split(/,(?![^[]*\])/).map(s => s.trim()).filter(Boolean);
  
  const result: string[] = [];
  
  for (const ing of mainIngredients) {
    if (ing.includes('[')) {
      const match = ing.match(/^([^[]+)\s*\[([^\]]+)\]/);
      if (match) {
        const parent = match[1].trim();
        const subIngredients = match[2].split(',').map(s => s.trim());
        result.push(parent);
        for (const sub of subIngredients) {
          result.push(`  ${sub}`);
        }
      } else {
        result.push(ing.replace(/[\[\]]/g, ''));
      }
    } else if (ing.includes('(')) {
      const match = ing.match(/^([^(]+)\s*\(([^)]+)\)/);
      if (match) {
        result.push(match[1].trim());
      } else {
        result.push(ing);
      }
    } else {
      result.push(ing);
    }
  }
  
  return result.map(s => s.trim()).filter(s => s.length > 0);
}

export function normalizeIngredientText(text: string): string {
  let normalized = text.toLowerCase().trim();
  
  normalized = normalized.replace(/[^\w\s\-']/g, ' ');
  normalized = normalized.replace(/\s+/g, ' ');
  normalized = normalized.replace(/^\s+|\s+$/g, '');
  
  normalized = normalized.replace(/\d+(\.\d+)?\s*(mg|g|ml|mcg|iu|%)/gi, '').trim();
  
  return normalized;
}

export async function normalizeIngredient(rawText: string): Promise<NormalizationResult> {
  const normalized = normalizeIngredientText(rawText);
  
  const cachedIngredient = ingredientCache.get(normalized);
  if (cachedIngredient) {
    return {
      originalText: rawText,
      normalizedName: normalized,
      canonicalName: cachedIngredient.canonicalName,
      confidence: 1.0,
    };
  }
  
  if (fuseIndex) {
    const results = fuseIndex.search(normalized);
    if (results.length > 0 && results[0].score !== undefined) {
      const confidence = 1 - results[0].score;
      if (confidence >= 0.7) {
        return {
          originalText: rawText,
          normalizedName: normalized,
          canonicalName: results[0].item.canonicalName,
          confidence,
        };
      }
    }
  }
  
  return {
    originalText: rawText,
    normalizedName: normalized,
    canonicalName: normalized,
    confidence: 0.5,
  };
}

export async function normalizeIngredientsList(rawText: string): Promise<NormalizationResult[]> {
  const parsed = parseIngredientsList(rawText);
  const results: NormalizationResult[] = [];
  
  for (const ingredient of parsed) {
    const isSubIngredient = ingredient.startsWith('  ');
    const cleanedIngredient = ingredient.trim();
    
    if (cleanedIngredient) {
      const result = await normalizeIngredient(cleanedIngredient);
      
      if (isSubIngredient) {
        const lastParent = results[results.length - 1];
        if (lastParent && !lastParent.subIngredients) {
          lastParent.subIngredients = [];
        }
        if (lastParent) {
          lastParent.subIngredients!.push(result);
        }
      } else {
        results.push(result);
      }
    }
  }
  
  return results;
}

export function calculateOverallConfidence(results: NormalizationResult[]): number {
  if (results.length === 0) return 0;
  
  const totalConfidence = results.reduce((sum, r) => sum + r.confidence, 0);
  return totalConfidence / results.length;
}