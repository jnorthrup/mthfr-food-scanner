export type SafetyStatus = "safe" | "unsafe" | "unknown";
export type RiskLevel = "high" | "medium" | "low";
export type SourceProvenance =
  | "api"
  | "ocr"
  | "review"
  | "manual"
  | "community";
export type ConsentType = "location" | "photo" | "review" | "data_contribution";

export interface Product {
  id?: number;
  upc: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  ingredients: ProductIngredient[];
  sourceProvenance: SourceProvenance;
  createdAt: Date;
  updatedAt: Date;
  isFavorite?: boolean;
  lastScannedAt?: Date;
}

export interface ProductIngredient {
  originalText: string;
  canonicalName: string;
  normalizedName: string;
  confidence: number;
  safetyStatus: SafetyStatus;
  safetyReason?: string;
  isMasking: boolean;
  maskingReason?: string;
  maskingRiskLevel?: RiskLevel;
  subIngredients?: ProductIngredient[];
  sourceProvenance: SourceProvenance;
}

export interface CanonicalIngredient {
  id?: number;
  canonicalName: string;
  synonyms: string[];
  safetyStatus: SafetyStatus;
  safetyReason?: string;
  evidence?: string;
  category?: string;
}

export interface MaskingTerm {
  id?: number;
  term: string;
  riskLevel: RiskLevel;
  reason: string;
  verificationGuidance: string;
}

export interface MTHFRClassificationRule {
  id?: number;
  ingredientPattern: string;
  safetyStatus: SafetyStatus;
  reason: string;
  evidence?: string;
  version: number;
  createdAt: Date;
}

export interface UserConsent {
  id?: number;
  consentType: ConsentType;
  granted: boolean;
  grantedAt?: Date;
  withdrawnAt?: Date;
  version: number;
}

export interface ScanHistory {
  id?: number;
  productId: number;
  scannedAt: Date;
  upc: string;
}

export interface ProductSafetySummary {
  overallStatus: SafetyStatus;
  safeCount: number;
  unsafeCount: number;
  unknownCount: number;
  safePercentage: number;
  unsafePercentage: number;
  unknownPercentage: number;
  unsafeIngredients: ProductIngredient[];
  maskingIngredients: ProductIngredient[];
  totalIngredients: number;
}

export interface APIProductResponse {
  upc: string;
  name: string;
  brand?: string;
  ingredients?: string;
  imageUrl?: string;
  source: string;
}

export interface NormalizationResult {
  originalText: string;
  normalizedName: string;
  canonicalName: string;
  confidence: number;
  subIngredients?: NormalizationResult[];
}

export interface OCRResult {
  text: string;
  confidence: number;
  ingredients: string[];
}

export interface AppState {
  currentProduct: Product | null;
  scanHistory: Product[];
  favorites: Product[];
  consents: UserConsent[];
  isLoading: boolean;
  error: string | null;
}
