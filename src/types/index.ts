export type SafetyStatus = "safe" | "unsafe" | "unknown";
export type RiskLevel = "high" | "medium" | "low";
export type SourceProvenance =
  | "api"
  | "ocr"
  | "review"
  | "manual"
  | "community";
export type ConsentType = "location" | "photo" | "review" | "data_contribution";

export type RestrictionProfileId =
  | "mthfr"
  | "eu_standards"
  | "genetic_mutations"
  | "allergens"
  | "additives"
  | "allergy_soy"
  | "allergy_wheat"
  | "allergy_milk"
  | "allergy_egg"
  | "allergy_peanut"
  | "allergy_treenuts"
  | "allergy_fish"
  | "allergy_shellfish"
  | "allergy_sesame"
  | "mutation_g6pd";

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

export interface ClassificationRule {
  id?: number;
  ingredientPattern: string;
  safetyStatus: SafetyStatus;
  reason: string;
  evidence?: string;
  profile: RestrictionProfileId;
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
  userMutations: UserMutation[];
}

export interface MutationDefinition {
  id: string;
  name: string;
  gene: string;
  commonVariants: MutationVariant[];
  description: string;
  category: MutationCategory;
}

export interface MutationVariant {
  variant: string;
  shorthand: string;
  genotype: string;
  impact: "normal" | "reduced" | "increased" | "absent";
  frequency: string;
}

export type MutationCategory =
  | "methylation"
  | "detoxification"
  | "nutrient_absorption"
  | "enzyme_function"
  | "immune"
  | "other";

export interface UserMutation {
  id?: number;
  mutationId: string;
  variant: string;
  genotype: string;
  addedAt: Date;
}

export interface MutationContraindication {
  mutationId: string;
  ingredientPattern: string;
  severity: "avoid" | "limit" | "caution";
  reason: string;
  evidence: string;
  alternative?: string;
}

export interface IngredientContraindication {
  ingredient: string;
  contraindicatedFor: string[];
  severity: "avoid" | "limit" | "caution";
  reason: string;
  alternatives?: string[];
}
