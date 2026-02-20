import { db } from '@/lib/db';
import type {
  ProductIngredient,
  NormalizationResult,
  SafetyStatus,
  ProductSafetySummary,
  CanonicalIngredient,
  MTHFRClassificationRule,
  MaskingTerm,
  SourceProvenance,
} from '@/types';

let classificationRules: MTHFRClassificationRule[] = [];
let maskingTerms: MaskingTerm[] = [];
let canonicalIngredients: Map<string, CanonicalIngredient> = new Map();

export async function initializeClassifier(): Promise<void> {
  classificationRules = await db.classificationRules.toArray();
  maskingTerms = await db.maskingTerms.toArray();
  
  const ingredients = await db.canonicalIngredients.toArray();
  canonicalIngredients.clear();
  
  for (const ing of ingredients) {
    canonicalIngredients.set(ing.canonicalName.toLowerCase(), ing);
    for (const synonym of ing.synonyms) {
      canonicalIngredients.set(synonym.toLowerCase(), ing);
    }
  }
}

export function classifyIngredient(
  normalizedResult: NormalizationResult,
  sourceProvenance: SourceProvenance = 'api'
): ProductIngredient {
  const canonicalName = normalizedResult.canonicalName.toLowerCase();
  const originalText = normalizedResult.originalText.toLowerCase();
  
  let safetyStatus: SafetyStatus = 'unknown';
  let safetyReason: string | undefined;
  
  const knownIngredient = canonicalIngredients.get(canonicalName);
  if (knownIngredient) {
    safetyStatus = knownIngredient.safetyStatus;
    safetyReason = knownIngredient.safetyReason;
  } else {
    for (const rule of classificationRules) {
      const pattern = new RegExp(rule.ingredientPattern, 'i');
      if (pattern.test(originalText) || pattern.test(canonicalName)) {
        safetyStatus = rule.safetyStatus;
        safetyReason = rule.reason;
        break;
      }
    }
  }
  
  const maskingCheck = checkForMasking(originalText);
  
  const productIngredient: ProductIngredient = {
    originalText: normalizedResult.originalText,
    canonicalName: normalizedResult.canonicalName,
    normalizedName: normalizedResult.normalizedName,
    confidence: normalizedResult.confidence,
    safetyStatus,
    safetyReason,
    isMasking: maskingCheck.isMasking,
    maskingReason: maskingCheck.reason,
    maskingRiskLevel: maskingCheck.riskLevel,
    sourceProvenance,
  };
  
  if (normalizedResult.subIngredients && normalizedResult.subIngredients.length > 0) {
    productIngredient.subIngredients = normalizedResult.subIngredients.map(sub =>
      classifyIngredient(sub, sourceProvenance)
    );
    
    const hasUnsafeSub = productIngredient.subIngredients.some(s => s.safetyStatus === 'unsafe');
    if (hasUnsafeSub && safetyStatus !== 'unsafe') {
      productIngredient.safetyStatus = 'unsafe';
      const unsafeSubs = productIngredient.subIngredients.filter(s => s.safetyStatus === 'unsafe');
      productIngredient.safetyReason = `Contains unsafe sub-ingredients: ${unsafeSubs.map(s => s.canonicalName).join(', ')}`;
    }
  }
  
  return productIngredient;
}

function checkForMasking(text: string): {
  isMasking: boolean;
  reason?: string;
  riskLevel?: 'high' | 'medium' | 'low';
  verificationGuidance?: string;
} {
  const lowerText = text.toLowerCase();
  
  for (const term of maskingTerms) {
    if (lowerText.includes(term.term.toLowerCase())) {
      return {
        isMasking: true,
        reason: term.reason,
        riskLevel: term.riskLevel,
        verificationGuidance: term.verificationGuidance,
      };
    }
  }
  
  const vaguePhrases = [
    { pattern: /and\/or/i, reason: 'Ingredient composition is variable and unspecified' },
    { pattern: /one or more of/i, reason: 'Multiple possible ingredients, exact composition unknown' },
    { pattern: /may contain/i, reason: 'Potential cross-contamination or variable formulation' },
    { pattern: /less than \d+%/i, reason: 'Minor ingredients may not be fully disclosed' },
  ];
  
  for (const phrase of vaguePhrases) {
    if (phrase.pattern.test(text)) {
      return {
        isMasking: true,
        reason: phrase.reason,
        riskLevel: 'medium',
      };
    }
  }
  
  return { isMasking: false };
}

export function classifyIngredientsList(
  normalizedResults: NormalizationResult[],
  sourceProvenance: SourceProvenance = 'api'
): ProductIngredient[] {
  return normalizedResults.map(result => classifyIngredient(result, sourceProvenance));
}

export function calculateProductSafety(ingredients: ProductIngredient[]): ProductSafetySummary {
  const allIngredients = flattenIngredients(ingredients);
  
  const safeCount = allIngredients.filter(i => i.safetyStatus === 'safe').length;
  const unsafeCount = allIngredients.filter(i => i.safetyStatus === 'unsafe').length;
  const unknownCount = allIngredients.filter(i => i.safetyStatus === 'unknown').length;
  const totalIngredients = allIngredients.length;
  
  const unsafeIngredients = allIngredients.filter(i => i.safetyStatus === 'unsafe');
  const maskingIngredients = allIngredients.filter(i => i.isMasking);
  
  let overallStatus: SafetyStatus;
  if (unsafeCount > 0) {
    overallStatus = 'unsafe';
  } else if (unknownCount > totalIngredients * 0.5 || maskingIngredients.some(m => m.maskingRiskLevel === 'high')) {
    overallStatus = 'unknown';
  } else if (unknownCount > 0) {
    overallStatus = 'unknown';
  } else {
    overallStatus = 'safe';
  }
  
  return {
    overallStatus,
    safeCount,
    unsafeCount,
    unknownCount,
    safePercentage: totalIngredients > 0 ? Math.round((safeCount / totalIngredients) * 100) : 0,
    unsafePercentage: totalIngredients > 0 ? Math.round((unsafeCount / totalIngredients) * 100) : 0,
    unknownPercentage: totalIngredients > 0 ? Math.round((unknownCount / totalIngredients) * 100) : 0,
    unsafeIngredients,
    maskingIngredients,
    totalIngredients,
  };
}

function flattenIngredients(ingredients: ProductIngredient[]): ProductIngredient[] {
  const result: ProductIngredient[] = [];
  
  for (const ingredient of ingredients) {
    result.push(ingredient);
    if (ingredient.subIngredients && ingredient.subIngredients.length > 0) {
      result.push(...flattenIngredients(ingredient.subIngredients));
    }
  }
  
  return result;
}

export function getOverallStatusColor(status: SafetyStatus): string {
  switch (status) {
    case 'safe':
      return 'text-emerald-600';
    case 'unsafe':
      return 'text-red-600';
    case 'unknown':
      return 'text-amber-600';
  }
}

export function getOverallStatusBgColor(status: SafetyStatus): string {
  switch (status) {
    case 'safe':
      return 'bg-emerald-500';
    case 'unsafe':
      return 'bg-red-500';
    case 'unknown':
      return 'bg-amber-500';
  }
}

export function getStatusIcon(status: SafetyStatus): string {
  switch (status) {
    case 'safe':
      return '✓';
    case 'unsafe':
      return '✗';
    case 'unknown':
      return '?';
  }
}

export function getRiskLevelColor(level: 'high' | 'medium' | 'low'): string {
  switch (level) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'medium':
      return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'low':
      return 'text-blue-600 bg-blue-50 border-blue-200';
  }
}