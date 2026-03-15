/**
 * Product-side data sources for UPC/barcode lookup
 * Including: nutrition, ingredients, GMO status, compliance history, brand violations
 */

export interface ProductDataSource {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  requiresApiKey: boolean;
  rateLimit?: string;
  dataType: "upc_product" | "ingredients" | "nutrition" | "gmo" | "compliance" | "violations" | "brand_history";
  coversEu?: boolean;
  coversUs?: boolean;
  exampleQuery?: string;
}

export const PRODUCT_DATA_SOURCES: ProductDataSource[] = [
  {
    id: "open_food_facts",
    name: "Open Food Facts",
    description:
      "Crowdsourced food database with ingredients, additives, nutrition facts, allergens, Nova processing level, and NutriScore. Global coverage.",
    baseUrl: "https://world.openfoodfacts.org/api/v2",
    requiresApiKey: false,
    rateLimit: "1 req/sec",
    dataType: "upc_product",
    coversEu: true,
    coversUs: true,
  },
  {
    id: "usda_fdc",
    name: "USDA FoodData Central",
    description:
      "Official US government database. Foundation Foods, SR Legacy, Survey FNDDS, Branded Foods. Detailed nutrient profiles.",
    baseUrl: "https://api.nal.usda.gov/fdc/v1",
    requiresApiKey: true,
    rateLimit: "1000/hr free tier",
    dataType: "nutrition",
    coversUs: true,
  },
  {
    id: "fda_open_data",
    name: "FDA Open Data",
    description:
      "FDA recall database, food facility registrations, import refusals. Contains enforcement actions and violations.",
    baseUrl: "https://api.fda.gov",
    requiresApiKey: false,
    rateLimit: "1000/day",
    dataType: "violations",
    coversUs: true,
  },
  {
    id: "fda_recalls",
    name: "FDA Food Safety Recalls",
    description:
      "Food recalls, market withdrawals, and safety alerts. Updated daily.",
    baseUrl: "https://api.fda.gov/food/enforcement.json",
    requiresApiKey: false,
    dataType: "compliance",
    coversUs: true,
  },
  {
    id: "cpsc_recalls",
    name: "CPSC Recalls",
    description:
      "Consumer Product Safety Commission recalls. Cross-reference packaging recalls.",
    baseUrl: "https://www.saferproducts.gov/RestWebServices/Recalls",
    requiresApiKey: false,
    dataType: "violations",
    coversUs: true,
  },
  {
    id: "ftc_enforcement",
    name: "FTC Enforcement Database",
    description:
      "Federal Trade Commission enforcement actions. False advertising, deceptive practices, brand lawsuits.",
    baseUrl: "https://api.ftc.gov/v1",
    requiresApiKey: true,
    dataType: "violations",
    coversUs: true,
  },
  {
    id: "usda_organic_integrity",
    name: "USDA Organic Integrity Database",
    description:
      "Certified organic operations. Verify organic claims, find violations.",
    baseUrl: "https://organic.ams.usda.gov/integrity",
    requiresApiKey: false,
    dataType: "compliance",
    coversUs: true,
  },
  {
    id: "non_gmo_project",
    name: "Non-GMO Project Verified",
    description:
      "Products verified as non-GMO. Contains brand verification status.",
    baseUrl: "https://www.nongmoproject.org/product-portal/search",
    requiresApiKey: false,
    dataType: "gmo",
    coversUs: true,
    coversEu: true,
  },
  {
    id: "ewg_food_scores",
    name: "EWG Food Scores",
    description:
      "Environmental Working Group database. Nutrition, ingredient concerns, processing, contaminants.",
    baseUrl: "https://www.ewg.org/foodscores",
    requiresApiKey: false,
    dataType: "ingredients",
    coversUs: true,
  },
  {
    id: "eu_rapid_alert",
    name: "EU RASFF Portal",
    description:
      "Rapid Alert System for Food and Feed. Border rejections, alerts, violations for EU.",
    baseUrl: "https://ec.europa.eu/food/safety/rasff-food-alert-network_en",
    requiresApiKey: false,
    dataType: "violations",
    coversEu: true,
  },
  {
    id: "eu_additives_database",
    name: "EU Food Additives Database",
    description:
      "E-numbers, additives authorized in EU, safety levels.",
    baseUrl: "https://ec.europa.eu/food/safety/food_improvement_agents/additives_en",
    requiresApiKey: false,
    dataType: "ingredients",
    coversEu: true,
  },
  {
    id: "gs1_upc",
    name: "GS1 UPC Database",
    description:
      "Official UPC registry. Brand info, company prefix, product descriptions.",
    baseUrl: "https://www.gs1.org/services/verified-by-gs1",
    requiresApiKey: false,
    dataType: "upc_product",
    coversUs: true,
    coversEu: true,
  },
  {
    id: "duns_upc",
    name: "Dun & Bradstreet",
    description:
      "Business data. Company lawsuits, financial health, compliance history.",
    baseUrl: "https://developer.dnb.com/api",
    requiresApiKey: true,
    dataType: "brand_history",
  },
  {
    id: "opencorporates",
    name: "OpenCorporates",
    description:
      "Company registry data. Corporate history, filings, subsidiaries. Free tier available.",
    baseUrl: "https://api.opencorporates.com",
    requiresApiKey: false,
    rateLimit: "500/day free",
    dataType: "brand_history",
  },
  {
    id: "good_on_you",
    name: "GoodOnYou",
    description:
      "Brand sustainability and ethics ratings. Environmental, labor, animal welfare scores.",
    baseUrl: "https://goodonyou.eco/api",
    requiresApiKey: true,
    dataType: "brand_history",
  },
  {
    id: "barcode_lookup",
    name: "Barcode Lookup",
    description:
      "UPC/EAN/ISBN product database. Names, descriptions, categories, images.",
    baseUrl: "https://api.barcodelookup.com/v3",
    requiresApiKey: true,
    rateLimit: "100/month free",
    dataType: "upc_product",
  },
  {
    id: "upcitemdb",
    name: "UPC Item DB",
    description:
      "Free UPC database. Product names, descriptions, images, categories.",
    baseUrl: "https://api.upcitemdb.com/prod/trial",
    requiresApiKey: false,
    rateLimit: "100/day trial",
    dataType: "upc_product",
  },
  {
    id: "digit_ssl",
    name: "Digit-Eyes",
    description:
      "UPC database with allergens, ingredients. Created for blind users.",
    baseUrl: "https://www.digit-eyes.com/cgi-bin/digiteyes",
    requiresApiKey: true,
    dataType: "upc_product",
  },
  {
    id: "nutritionix",
    name: "Nutritionix",
    description:
      "Restaurant and branded food nutrition. Natural language search. Label text OCR.",
    baseUrl: "https://trackapi.nutritionix.com/v2",
    requiresApiKey: true,
    rateLimit: "5000/day",
    dataType: "nutrition",
  },
  {
    id: "spoonacular",
    name: "Spoonacular",
    description:
      "Food and recipe API. Ingredients, nutrition, meal planning. Large database.",
    baseUrl: "https://api.spoonacular.com",
    requiresApiKey: true,
    rateLimit: "150/day free",
    dataType: "upc_product",
  },
  {
    id: "fda_sanitary_transport",
    name: "FDA Sanitary Transportation",
    description:
      "Records of sanitary transportation violations and compliance.",
    baseUrl: "https://api.fda.gov/food/sanitarytransportation.json",
    requiresApiKey: false,
    dataType: "violations",
    coversUs: true,
  },
  {
    id: "fda_food_facility",
    name: "FDA Food Facility Registration",
    description:
      "Registered food facilities. Verify manufacturing source compliance.",
    baseUrl: "https://api.fda.gov/food/establishment.json",
    requiresApiKey: false,
    dataType: "compliance",
    coversUs: true,
  },
  {
    id: "fsis_inspections",
    name: "USDA FSIS Inspections",
    description:
      "Meat, poultry, egg product inspection data. Processing plant violations.",
    baseUrl: "https://www.fsis.usda.gov/inspection",
    requiresApiKey: false,
    dataType: "violations",
    coversUs: true,
  },
  {
    id: "epa_toxics_release",
    name: "EPA Toxic Release Inventory",
    description:
      "Facility toxic releases. Manufacturing plant environmental violations.",
    baseUrl: "https://data.epa.gov/eftdownload",
    requiresApiKey: false,
    dataType: "violations",
    coversUs: true,
  },
  {
    id: "epa_enforcement",
    name: "EPA Enforcement & Compliance",
    description:
      "Facility compliance history. Environmental violations by company.",
    baseUrl: "https://echo.epa.gov/api",
    requiresApiKey: false,
    dataType: "violations",
    coversUs: true,
  },
  {
    id: "california_prop65",
    name: "California Prop 65 List",
    description:
      "Chemicals known to cause cancer/reproductive toxicity. Required warnings.",
    baseUrl: "https://oehha.ca.gov/chemicals",
    requiresApiKey: false,
    dataType: "ingredients",
    coversUs: true,
  },
  {
    id: "canada_food_drugs",
    name: "Canada Food & Drug Regulations",
    description:
      "Canadian food additive regulations. Compliance with Health Canada.",
    baseUrl: "https://www.canada.ca/en/health-canada/services/food-nutrition/food-safety",
    requiresApiKey: false,
    dataType: "compliance",
  },
  {
    id: "food_standards_au_nz",
    name: "Food Standards Australia New Zealand",
    description:
      "FSANZ food standards code. Additives, contaminants, labeling requirements.",
    baseUrl: "https://www.foodstandards.gov.au",
    requiresApiKey: false,
    dataType: "compliance",
  },
  {
    id: "qs_foods",
    name: "Quality & Safety Foods",
    description:
      "European food quality standards database. IFS, BRC certifications.",
    baseUrl: "https://www.ifs-certification.com",
    requiresApiKey: false,
    dataType: "compliance",
    coversEu: true,
  },
];

/**
 * Query Open Food Facts for product by UPC
 */
export async function lookupProductOpenFoodFacts(
  upc: string,
): Promise<{
  found: boolean;
  product?: {
    name: string;
    brand?: string;
    ingredients: string[];
    ingredientsText?: string;
    additives: string[];
    allergens: string[];
    nutrition?: Record<string, number>;
    novaGroup?: number;
    nutriscore?: string;
    categories: string[];
    labels: string[];
    imageUrl?: string;
    quantity?: string;
    countries: string[];
    manufacturingPlaces?: string;
    dataSource: string;
  };
}> {
  const url = `${PRODUCT_DATA_SOURCES[0].baseUrl}/product/${upc}.json`;
  const response = await fetch(url);

  if (!response.ok) {
    return { found: false };
  }

  const data = await response.json();

  if (data.status !== 1 || !data.product) {
    return { found: false };
  }

  const product = data.product;
  return {
    found: true,
    product: {
      name: product.product_name || product.product_name_en || "Unknown",
      brand: product.brands,
      ingredients: product.ingredients_tags || [],
      ingredientsText: product.ingredients_text,
      additives: product.additives_tags || [],
      allergens: product.allergens_tags || [],
      nutrition: product.nutriments,
      novaGroup: product.nova_group,
      nutriscore: product.nutriscore_grade,
      categories: product.categories_tags || [],
      labels: product.labels_tags || [],
      imageUrl: product.image_url,
      quantity: product.quantity,
      countries: product.countries_tags || [],
      manufacturingPlaces: product.manufacturing_places,
      dataSource: "openfoodfacts",
    },
  };
}

/**
 * Query USDA FoodData Central
 */
export async function searchUSDAFood(
  query: string,
 apiKey: string,
  pageSize = 10,
): Promise<{
  totalHits: number;
  foods: Array<{
    fdcId: number;
    description: string;
    brandOwner?: string;
    brandName?: string;
    ingredients?: string;
    upc?: string;
    nutrients: Array<{
      nutrientName: string;
      value: number;
      unitName: string;
    }>;
    dataSource: string;
  }>;
}> {
  const url = `${PRODUCT_DATA_SOURCES[1].baseUrl}/foods/search?query=${encodeURIComponent(
    query,
  )}&pageSize=${pageSize}&api_key=${apiKey}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`USDA API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    totalHits: data.totalHits,
    foods: data.foods.map(
      (f: {
        fdcId: number;
        description: string;
        brandOwner?: string;
        brandName?: string;
        ingredients?: string;
        gtinUpc?: string;
        foodNutrients: Array<{
          nutrientName: string;
          value: number;
          unitName: string;
        }>;
      }) => ({
        fdcId: f.fdcId,
        description: f.description,
        brandOwner: f.brandOwner,
        brandName: f.brandName,
        ingredients: f.ingredients,
        upc: f.gtinUpc,
        nutrients: f.foodNutrients.map((n) => ({
          nutrientName: n.nutrientName,
          value: n.value,
          unitName: n.unitName,
        })),
        dataSource: "usda_fdc",
      }),
    ),
  };
}

/**
 * Query FDA Food Recalls
 */
export async function getFDARecalls(
  brand?: string,
  limit = 10,
): Promise<
  Array<{
    recallNumber: string;
    productDescription: string;
    reason: string;
    classification: string;
    recallDate: string;
    company: string;
    status: string;
  }>
> {
  let url = `${PRODUCT_DATA_SOURCES[3].baseUrl}?limit=${limit}`;
  if (brand) {
    url += `&search=brand:"${encodeURIComponent(brand)}"`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return (
    data.results?.map(
      (r: {
        recall_number: string;
        product_description: string;
        reason_for_recall: string;
        classification: string;
        recall_initiation_date: string;
        recalling_firm: string;
        status: string;
      }) => ({
        recallNumber: r.recall_number,
        productDescription: r.product_description,
        reason: r.reason_for_recall,
        classification: r.classification,
        recallDate: r.recall_initiation_date,
        company: r.recalling_firm,
        status: r.status,
      }),
    ) || []
  );
}

/**
 * Query EWG for ingredient safety
 */
export async function getEWGIngredientScore(
  ingredient: string,
): Promise<{
  found: boolean;
  score?: number;
  concerns?: string[];
  data?: Record<string, unknown>;
}> {
  // EWG doesn't have a public API, but their pages can be scraped
  // For now, return not found
  return { found: false };
}

/**
 * Get GMO project verification status
 */
export async function checkNonGMOVerified(
  upcOrBrand: string,
): Promise<{
  verified: boolean;
  productName?: string;
  expirationDate?: string;
}> {
  // Non-GMO Project doesn't have a public API
  // This would require web scraping or partnership
  return { verified: false };
}

/**
 * Query OpenCorporates for company history
 */
export async function getCompanyHistory(
  companyName: string,
): Promise<{
  found: boolean;
  companies?: Array<{
    name: string;
    jurisdiction: string;
    incorporationDate?: string;
    status?: string;
    dissolutionDate?: string;
  }>;
}> {
  const url = `https://api.opencorporates.com/v0.4/companies/search?q=${encodeURIComponent(
    companyName,
  )}&api_token=`;

  const response = await fetch(url);
  if (!response.ok) {
    return { found: false };
  }

  const data = await response.json();
  return {
    found: true,
    companies: data.companies?.companies?.map(
      (c: {
        name: string;
        jurisdiction_code: string;
        incorporation_date?: string;
        current_status?: string;
        dissolution_date?: string;
      }) => ({
        name: c.name,
        jurisdiction: c.jurisdiction_code,
        incorporationDate: c.incorporation_date,
        status: c.current_status,
        dissolutionDate: c.dissolution_date,
      }),
    ),
  };
}