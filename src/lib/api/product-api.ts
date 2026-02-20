import type { APIProductResponse, SourceProvenance } from "@/types";

interface ProductAPIConfig {
  name: string;
  priority: number;
  fetchProduct: (upc: string) => Promise<APIProductResponse | null>;
}

const OPEN_FOOD_FACTS_BASE = "https://world.openfoodfacts.org/api/v2";

async function fetchFromOpenFoodFacts(
  upc: string,
): Promise<APIProductResponse | null> {
  try {
    const response = await fetch(
      `${OPEN_FOOD_FACTS_BASE}/product/${upc}.json`,
      {
        headers: {
          "User-Agent": "MTHFRFoodScanner/1.0 (contact@example.com)",
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (data.status !== 1 || !data.product) {
      return null;
    }

    const product = data.product;

    return {
      upc: upc,
      name:
        product.product_name || product.product_name_en || "Unknown Product",
      brand: product.brands || undefined,
      ingredients:
        product.ingredients_text || product.ingredients_text_en || undefined,
      imageUrl: product.image_front_url || product.image_url || undefined,
      source: "open_food_facts",
    };
  } catch (error) {
    console.error("Open Food Facts API error:", error);
    return null;
  }
}

async function fetchFromUPCItemDB(
  upc: string,
): Promise<APIProductResponse | null> {
  try {
    const response = await fetch(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${upc}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const item = data.items[0];

    return {
      upc: upc,
      name: item.title || "Unknown Product",
      brand: item.brand || undefined,
      ingredients: item.description || undefined,
      imageUrl: item.images?.[0] || undefined,
      source: "upc_item_db",
    };
  } catch (error) {
    console.error("UPC Item DB API error:", error);
    return null;
  }
}

const API_PROVIDERS: ProductAPIConfig[] = [
  {
    name: "Open Food Facts",
    priority: 1,
    fetchProduct: fetchFromOpenFoodFacts,
  },
  {
    name: "UPC Item DB",
    priority: 2,
    fetchProduct: fetchFromUPCItemDB,
  },
];

export interface ProductLookupResult {
  success: boolean;
  product: APIProductResponse | null;
  source: SourceProvenance;
  error?: string;
  searchedAPIs: string[];
}

export async function lookupProductByUPC(
  upc: string,
): Promise<ProductLookupResult> {
  const normalizedUPC = normalizeUPC(upc);
  const searchedAPIs: string[] = [];

  for (const provider of API_PROVIDERS.sort(
    (a, b) => a.priority - b.priority,
  )) {
    searchedAPIs.push(provider.name);

    try {
      const result = await provider.fetchProduct(normalizedUPC);

      if (result) {
        return {
          success: true,
          product: result,
          source: "api",
          searchedAPIs,
        };
      }
    } catch (error) {
      console.error(`Error fetching from ${provider.name}:`, error);
    }
  }

  return {
    success: false,
    product: null,
    source: "api",
    error: "Product not found in any database",
    searchedAPIs,
  };
}

export function normalizeUPC(upc: string): string {
  const cleaned = upc.replace(/[^0-9]/g, "");

  if (cleaned.length === 12) {
    return cleaned;
  }

  if (cleaned.length === 13 && cleaned.startsWith("0")) {
    return cleaned.substring(1);
  }

  if (cleaned.length === 13) {
    return cleaned;
  }

  if (cleaned.length < 12) {
    return cleaned.padStart(12, "0");
  }

  return cleaned;
}

export function validateUPC(upc: string): { valid: boolean; message?: string } {
  const cleaned = upc.replace(/[^0-9]/g, "");

  if (cleaned.length === 0) {
    return { valid: false, message: "UPC is required" };
  }

  if (cleaned.length < 8) {
    return { valid: false, message: "UPC must be at least 8 digits" };
  }

  if (cleaned.length > 14) {
    return { valid: false, message: "UPC cannot exceed 14 digits" };
  }

  if (!/^\d+$/.test(cleaned)) {
    return { valid: false, message: "UPC must contain only numbers" };
  }

  return { valid: true };
}

export function generateMockProduct(upc: string): APIProductResponse {
  return {
    upc,
    name: "Demo Product",
    brand: "Demo Brand",
    ingredients:
      "Water, Enriched Wheat Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Sugar, Natural Flavors, Salt, Yeast Extract, Citric Acid",
    imageUrl: undefined,
    source: "demo",
  };
}
