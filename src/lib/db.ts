import Dexie, { type EntityTable } from "dexie";
import type {
  Product,
  CanonicalIngredient,
  MaskingTerm,
  ClassificationRule,
  UserConsent,
  ScanHistory,
} from "@/types";

class MTHFRDatabase extends Dexie {
  products!: EntityTable<Product, "id">;
  canonicalIngredients!: EntityTable<CanonicalIngredient, "id">;
  maskingTerms!: EntityTable<MaskingTerm, "id">;
  classificationRules!: EntityTable<ClassificationRule, "id">;
  userConsents!: EntityTable<UserConsent, "id">;
  scanHistory!: EntityTable<ScanHistory, "id">;

  constructor() {
    super("MTHFRFoodScanner");

    this.version(1).stores({
      products:
        "++id, upc, name, brand, sourceProvenance, createdAt, isFavorite, lastScannedAt",
      canonicalIngredients:
        "++id, canonicalName, *synonyms, safetyStatus, category",
      maskingTerms: "++id, term, riskLevel",
      classificationRules: "++id, ingredientPattern, safetyStatus, version",
      userConsents: "++id, consentType, granted",
      scanHistory: "++id, productId, scannedAt, upc",
    });

    this.version(2).stores({
      products:
        "++id, upc, name, brand, sourceProvenance, createdAt, isFavorite, lastScannedAt",
      canonicalIngredients:
        "++id, canonicalName, *synonyms, safetyStatus, category",
      maskingTerms: "++id, term, riskLevel",
      classificationRules:
        "++id, ingredientPattern, safetyStatus, profile, version",
      userConsents: "++id, consentType, granted",
      scanHistory: "++id, productId, scannedAt, upc",
    });
  }
}

export const db = new MTHFRDatabase();

export async function initializeDatabase(): Promise<void> {
  const ingredientCount = await db.canonicalIngredients.count();
  if (ingredientCount === 0) {
    await seedCanonicalIngredients();
  }

  const maskingCount = await db.maskingTerms.count();
  if (maskingCount === 0) {
    await seedMaskingTerms();
  }

  const rulesCount = await db.classificationRules.count();
  if (rulesCount === 0) {
    await seedClassificationRules();
  }
}

async function seedCanonicalIngredients(): Promise<void> {
  const ingredients: Omit<CanonicalIngredient, "id">[] = [
    {
      canonicalName: "folic acid",
      synonyms: [
        "folacin",
        "vitamin b9",
        "pteroylglutamic acid",
        "synthetic folate",
      ],
      safetyStatus: "unsafe",
      safetyReason:
        "Synthetic folic acid can interfere with methylation in individuals with MTHFR variants. It may block folate receptors and inhibit natural folate metabolism.",
      evidence:
        "Research indicates that unmetabolized folic acid may compete with natural folates for cellular uptake.",
      category: "vitamins",
    },
    {
      canonicalName: "methylfolate",
      synonyms: [
        "5-mthf",
        "l-methylfolate",
        "5-methyltetrahydrofolate",
        "metafolin",
        "quatrefolic",
        "active folate",
      ],
      safetyStatus: "safe",
      safetyReason:
        "Methylfolate is the bioactive form of folate that bypasses the MTHFR enzyme, making it suitable for individuals with MTHFR variants.",
      evidence: "Methylfolate does not require conversion by the MTHFR enzyme.",
      category: "vitamins",
    },
    {
      canonicalName: "cyanocobalamin",
      synonyms: ["vitamin b12 (cyanocobalamin)", "synthetic b12"],
      safetyStatus: "unsafe",
      safetyReason:
        "Cyanocobalamin is a synthetic form of B12 that requires conversion and contains a cyanide molecule. May not be efficiently processed by those with MTHFR variants.",
      evidence:
        "The body must convert cyanocobalamin to methylcobalamin or adenosylcobalamin for use.",
      category: "vitamins",
    },
    {
      canonicalName: "methylcobalamin",
      synonyms: ["methyl b12", "active b12", "coenzyme b12"],
      safetyStatus: "safe",
      safetyReason:
        "Methylcobalamin is the bioactive methylated form of vitamin B12 that supports methylation directly.",
      evidence: "Already in active form, no conversion needed.",
      category: "vitamins",
    },
    {
      canonicalName: "hydroxocobalamin",
      synonyms: ["hydroxycobalamin", "b12a"],
      safetyStatus: "safe",
      safetyReason:
        "Hydroxocobalamin is a natural form of B12 that the body can convert to active forms.",
      evidence: "Natural form found in food, easily converted.",
      category: "vitamins",
    },
    {
      canonicalName: "adenosylcobalamin",
      synonyms: ["dibencozide", "cobamamide", "coenzyme b12"],
      safetyStatus: "safe",
      safetyReason:
        "Adenosylcobalamin is a bioactive form of B12 used directly in cellular energy production.",
      evidence: "Active coenzyme form of B12.",
      category: "vitamins",
    },
    {
      canonicalName: "pyridoxine hydrochloride",
      synonyms: ["vitamin b6 (pyridoxine)", "pyridoxine hcl", "synthetic b6"],
      safetyStatus: "unknown",
      safetyReason:
        "While generally usable, some individuals with MTHFR variants may benefit from pyridoxal-5-phosphate instead.",
      category: "vitamins",
    },
    {
      canonicalName: "pyridoxal-5-phosphate",
      synonyms: ["p5p", "plp", "active b6", "pyridoxal phosphate"],
      safetyStatus: "safe",
      safetyReason:
        "P5P is the active coenzyme form of vitamin B6 that supports methylation reactions.",
      category: "vitamins",
    },
    {
      canonicalName: "riboflavin",
      synonyms: ["vitamin b2", "riboflavin-5-phosphate"],
      safetyStatus: "safe",
      safetyReason:
        "Riboflavin is essential for MTHFR enzyme function and supports methylation.",
      evidence: "B2 is a cofactor for the MTHFR enzyme.",
      category: "vitamins",
    },
    {
      canonicalName: "monosodium glutamate",
      synonyms: ["msg", "glutamate", "e621", "sodium glutamate"],
      safetyStatus: "unsafe",
      safetyReason:
        "MSG is an excitotoxin that may affect neurological function and can be problematic for some with MTHFR variants.",
      category: "additives",
    },
    {
      canonicalName: "aspartame",
      synonyms: ["e951", "nutrasweet", "equal", "canderel"],
      safetyStatus: "unsafe",
      safetyReason:
        "Aspartame breaks down into phenylalanine and can affect neurotransmitter balance. May be problematic for methylation.",
      category: "sweeteners",
    },
    {
      canonicalName: "high fructose corn syrup",
      synonyms: ["hfcs", "glucose-fructose syrup", "isoglucose", "corn sugar"],
      safetyStatus: "unsafe",
      safetyReason:
        "HFCS may deplete nutrients needed for methylation and contribute to inflammation.",
      category: "sweeteners",
    },
    {
      canonicalName: "sodium nitrite",
      synonyms: ["nitrite", "e250", "curing salt"],
      safetyStatus: "unsafe",
      safetyReason:
        "Nitrites can form nitrosamines and may interfere with oxygen transport and methylation processes.",
      category: "preservatives",
    },
    {
      canonicalName: "sodium nitrate",
      synonyms: ["nitrate", "e251", "chile saltpeter"],
      safetyStatus: "unsafe",
      safetyReason:
        "Nitrates convert to nitrites in the body and may affect methylation and overall health.",
      category: "preservatives",
    },
    {
      canonicalName: "bht",
      synonyms: ["butylated hydroxytoluene", "e321"],
      safetyStatus: "unsafe",
      safetyReason:
        "BHT is a synthetic antioxidant that may affect hormones and cellular function.",
      category: "preservatives",
    },
    {
      canonicalName: "bha",
      synonyms: ["butylated hydroxyanisole", "e320"],
      safetyStatus: "unsafe",
      safetyReason:
        "BHA is a synthetic preservative with potential endocrine-disrupting effects.",
      category: "preservatives",
    },
    {
      canonicalName: "tbhq",
      synonyms: ["tertiary butylhydroquinone", "e319"],
      safetyStatus: "unsafe",
      safetyReason:
        "TBHQ is a synthetic preservative derived from petroleum that may affect immune function.",
      category: "preservatives",
    },
    {
      canonicalName: "carrageenan",
      synonyms: ["e407", "irish moss extract"],
      safetyStatus: "unknown",
      safetyReason:
        "Carrageenan may cause gut inflammation in some individuals, which can affect nutrient absorption.",
      category: "additives",
    },
    {
      canonicalName: "potassium bromate",
      synonyms: ["bromate", "e924"],
      safetyStatus: "unsafe",
      safetyReason:
        "Potassium bromate is a possible carcinogen and can affect thyroid function.",
      category: "additives",
    },
    {
      canonicalName: "sodium benzoate",
      synonyms: ["benzoate", "e211"],
      safetyStatus: "unsafe",
      safetyReason:
        "Sodium benzoate can form benzene when combined with vitamin C and may deplete glutathione.",
      category: "preservatives",
    },
    {
      canonicalName: "propyl gallate",
      synonyms: ["e310", "propyl 3,4,5-trihydroxybenzoate"],
      safetyStatus: "unsafe",
      safetyReason:
        "Propyl gallate is a synthetic antioxidant that may have estrogenic effects.",
      category: "preservatives",
    },
    {
      canonicalName: "water",
      synonyms: [
        "purified water",
        "filtered water",
        "spring water",
        "mineral water",
        "aqua",
      ],
      safetyStatus: "safe",
      safetyReason: "Water is essential and does not affect methylation.",
      category: "base",
    },
    {
      canonicalName: "salt",
      synonyms: [
        "sodium chloride",
        "sea salt",
        "table salt",
        "kosher salt",
        "himalayan salt",
      ],
      safetyStatus: "safe",
      safetyReason:
        "Natural salt in moderate amounts does not affect methylation.",
      category: "base",
    },
    {
      canonicalName: "sugar",
      synonyms: ["cane sugar", "beet sugar", "sucrose", "granulated sugar"],
      safetyStatus: "safe",
      safetyReason:
        "Natural sugar in moderate amounts is generally safe for methylation.",
      category: "sweeteners",
    },
    {
      canonicalName: "olive oil",
      synonyms: ["extra virgin olive oil", "evoo", "virgin olive oil"],
      safetyStatus: "safe",
      safetyReason:
        "Olive oil is a healthy fat that does not interfere with methylation.",
      category: "fats",
    },
    {
      canonicalName: "coconut oil",
      synonyms: ["virgin coconut oil", "refined coconut oil"],
      safetyStatus: "safe",
      safetyReason:
        "Coconut oil is a healthy fat that supports cellular function.",
      category: "fats",
    },
  ];

  await db.canonicalIngredients.bulkAdd(ingredients);
}

async function seedMaskingTerms(): Promise<void> {
  const terms: Omit<MaskingTerm, "id">[] = [
    {
      term: "natural flavors",
      riskLevel: "high",
      reason:
        "Natural flavors can contain hundreds of undisclosed ingredients including MSG, preservatives, and synthetic additives. The term is loosely regulated and may hide problematic components.",
      verificationGuidance:
        "Contact the manufacturer to request a complete breakdown of natural flavor components. Ask specifically about MSG, glutamates, and any synthetic processing aids.",
    },
    {
      term: "artificial flavors",
      riskLevel: "high",
      reason:
        "Artificial flavors are synthetic compounds that may contain excitotoxins, preservatives, or other additives that could affect methylation.",
      verificationGuidance:
        "Request the specific artificial flavor compounds from the manufacturer. Consider avoiding products with artificial flavors when possible.",
    },
    {
      term: "spices",
      riskLevel: "medium",
      reason:
        'The term "spices" can hide MSG, anti-caking agents, or preservatives. While often benign, specifics are not disclosed.',
      verificationGuidance:
        "Ask the manufacturer for a complete spice breakdown. Look for products that list specific spices.",
    },
    {
      term: "proprietary blend",
      riskLevel: "high",
      reason:
        "Proprietary blends hide exact ingredient amounts and may contain undisclosed fillers, flow agents, or synthetic additives.",
      verificationGuidance:
        "Contact manufacturer for complete ingredient disclosure. Be cautious of proprietary blends in supplements.",
    },
    {
      term: "other ingredients",
      riskLevel: "high",
      reason:
        "This catch-all term may include unlisted additives, processing aids, or ingredients below labeling thresholds.",
      verificationGuidance:
        "Request complete ingredient list from manufacturer. Consider choosing products with full transparency.",
    },
    {
      term: "processing aids",
      riskLevel: "medium",
      reason:
        "Processing aids may include enzymes, solvents, or chemicals used during manufacturing that remain in trace amounts.",
      verificationGuidance:
        "Ask manufacturer about specific processing aids used. Look for organic or minimally processed alternatives.",
    },
    {
      term: "flavor enhancers",
      riskLevel: "high",
      reason:
        "Flavor enhancers often include MSG or similar glutamate compounds that may affect those with MTHFR variants.",
      verificationGuidance:
        "Request specific flavor enhancer identification. Look for E-numbers (E620-E625 are glutamates).",
    },
    {
      term: "yeast extract",
      riskLevel: "medium",
      reason:
        "Yeast extract naturally contains glutamates (similar to MSG) and may affect sensitive individuals.",
      verificationGuidance:
        "Contains free glutamic acid. May be problematic for MSG-sensitive individuals.",
    },
    {
      term: "hydrolyzed protein",
      riskLevel: "high",
      reason:
        "Hydrolyzed proteins contain free glutamic acid (MSG) created during processing.",
      verificationGuidance:
        "Treat similarly to MSG. Includes hydrolyzed vegetable protein, hydrolyzed soy protein, etc.",
    },
    {
      term: "autolyzed yeast",
      riskLevel: "medium",
      reason:
        "Autolyzed yeast contains naturally occurring MSG-like compounds.",
      verificationGuidance:
        "Contains free glutamates. Consider sensitivity if avoiding MSG.",
    },
    {
      term: "natural colors",
      riskLevel: "low",
      reason:
        "While generally safer than artificial colors, natural colors may come from sources that cause reactions in some individuals.",
      verificationGuidance:
        "Ask for specific color sources. Common sources include carmine (insects), annatto (seeds), turmeric.",
    },
    {
      term: "enzymes",
      riskLevel: "low",
      reason:
        "Enzymes are generally safe but may be derived from sources that concern some individuals (fungal, bacterial, or animal).",
      verificationGuidance:
        "Ask about enzyme sources if you have specific dietary restrictions.",
    },
    {
      term: "modified food starch",
      riskLevel: "medium",
      reason:
        "Modified starches may be chemically treated and could contain residual processing chemicals.",
      verificationGuidance:
        "Ask about the type of modification and source (corn, wheat, tapioca).",
    },
    {
      term: "natural sweeteners",
      riskLevel: "low",
      reason:
        "Term may include various sweeteners with different safety profiles. Could contain stevia, monk fruit, or sugar alcohols.",
      verificationGuidance:
        "Ask for specific sweetener identification to verify individual safety.",
    },
  ];

  await db.maskingTerms.bulkAdd(terms);
}

async function seedClassificationRules(): Promise<void> {
  const rules: Omit<ClassificationRule, "id">[] = [
    // MTHFR Profile
    {
      ingredientPattern: "folic acid",
      safetyStatus: "unsafe",
      reason:
        "Synthetic folic acid requires MTHFR enzyme conversion and may accumulate unmetabolized.",
      evidence:
        "MTHFR C677T and A1298C variants reduce conversion efficiency by 30-70%.",
      profile: "mthfr",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "cyanocobalamin",
      safetyStatus: "unsafe",
      reason:
        "Synthetic B12 form requires conversion and contains cyanide molecule.",
      evidence:
        "Methylcobalamin or adenosylcobalamin are preferred for MTHFR variants.",
      profile: "mthfr",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "enriched|fortified",
      safetyStatus: "unsafe",
      reason:
        "Enriched and fortified foods typically contain synthetic folic acid.",
      evidence:
        "US fortification mandate uses synthetic folic acid in grain products.",
      profile: "mthfr",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "methylfolate|5-mthf|l-methylfolate",
      safetyStatus: "safe",
      reason: "Active form of folate that bypasses MTHFR enzyme.",
      evidence: "Direct cellular uptake without conversion requirement.",
      profile: "mthfr",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "methylcobalamin|adenosylcobalamin|hydroxocobalamin",
      safetyStatus: "safe",
      reason: "Active or easily converted forms of vitamin B12.",
      evidence: "Preferred B12 forms for MTHFR-affected individuals.",
      profile: "mthfr",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "msg|monosodium glutamate|glutamate",
      safetyStatus: "unsafe",
      reason: "Excitotoxin that may affect neurological function.",
      evidence: "May deplete glutathione and affect detoxification pathways.",
      profile: "mthfr",
      version: 1,
      createdAt: new Date(),
    },
    // EU Standards Profile
    {
      ingredientPattern: "titanium dioxide|e171",
      safetyStatus: "unsafe",
      reason:
        "Banned in the EU due to concerns about genotoxicity and its ability to accumulate in the body.",
      profile: "eu_standards",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "potassium bromate|e924",
      safetyStatus: "unsafe",
      reason:
        "Banned in the EU, Canada, and other countries. Classified as a possible carcinogen.",
      profile: "eu_standards",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "azodicarbonamide|e927a",
      safetyStatus: "unsafe",
      reason:
        "Banned in the EU and Australia. May break down into semicarbazide, which is a carcinogen.",
      profile: "eu_standards",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "brominated vegetable oil|bvo",
      safetyStatus: "unsafe",
      reason:
        "Banned in the EU. Contains bromine, which can accumulate in the body and lead to neurological issues.",
      profile: "eu_standards",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "yellow 5|tartrazine|e102",
      safetyStatus: "unknown",
      reason:
        "Requires a warning label in the EU. May cause hyperactivity in children and allergic reactions.",
      profile: "eu_standards",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "yellow 6|sunset yellow|e110",
      safetyStatus: "unknown",
      reason:
        "Requires a warning label in the EU. May cause hyperactivity in children.",
      profile: "eu_standards",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "red 40|allura red|e129",
      safetyStatus: "unknown",
      reason:
        "Requires a warning label in the EU. May cause hyperactivity in children.",
      profile: "eu_standards",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "propylparaben|e216",
      safetyStatus: "unsafe",
      reason:
        "Banned in the EU as a food additive due to endocrine-disrupting potential.",
      profile: "eu_standards",
      version: 1,
      createdAt: new Date(),
    },
    // Genetic Mutations Profile
    {
      ingredientPattern: "fava bean|broad bean|vicia faba",
      safetyStatus: "unsafe",
      reason:
        "Can cause hemolytic anemia in individuals with G6PD deficiency (Favism).",
      profile: "genetic_mutations",
      version: 1,
      createdAt: new Date(),
    },
    // Allergens Profile
    {
      ingredientPattern: "soy|soya|lecithin \\(soy\\)",
      safetyStatus: "unknown",
      reason: "Common allergen. Often genetically modified.",
      profile: "allergens",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "wheat|gluten",
      safetyStatus: "unknown",
      reason: "Common allergen and source of gluten.",
      profile: "allergens",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "milk|lactose|whey|casein",
      safetyStatus: "unknown",
      reason: "Common dairy allergen.",
      profile: "allergens",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "egg",
      safetyStatus: "unknown",
      reason: "Common allergen.",
      profile: "allergens",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "peanut",
      safetyStatus: "unknown",
      reason: "Common high-risk allergen.",
      profile: "allergens",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern:
        "almond|cashew|walnut|hazelnut|pistachio|macadamia|pecan|brazil nut",
      safetyStatus: "unknown",
      reason: "Common tree nut allergen.",
      profile: "allergens",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "fish",
      safetyStatus: "unknown",
      reason: "Common allergen.",
      profile: "allergens",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern:
        "shrimp|prawn|crab|lobster|mussel|clam|oyster|scallop|shellfish",
      safetyStatus: "unknown",
      reason: "Common shellfish allergen.",
      profile: "allergens",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "sesame",
      safetyStatus: "unknown",
      reason: "Common allergen.",
      profile: "allergens",
      version: 1,
      createdAt: new Date(),
    },
    // Additives Profile
    {
      ingredientPattern: "aspartame|e951",
      safetyStatus: "unsafe",
      reason: "Artificial sweetener that may affect neurotransmitter balance.",
      profile: "additives",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "high fructose corn syrup|hfcs",
      safetyStatus: "unsafe",
      reason: "Highly refined sweetener linked to metabolic issues.",
      profile: "additives",
      version: 1,
      createdAt: new Date(),
    },
    {
      ingredientPattern: "sodium nitrite|sodium nitrate|e250|e251",
      safetyStatus: "unsafe",
      reason: "Preservatives that can form nitrosamines.",
      profile: "additives",
      version: 1,
      createdAt: new Date(),
    },
  ];

  await db.classificationRules.bulkAdd(rules);
}

export async function clearAllData(): Promise<void> {
  await db.products.clear();
  await db.scanHistory.clear();
}

export async function exportData(): Promise<string> {
  const data = {
    products: await db.products.toArray(),
    scanHistory: await db.scanHistory.toArray(),
    consents: await db.userConsents.toArray(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}
