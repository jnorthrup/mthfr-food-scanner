import { generateMockProduct, lookupProductByUPC } from "@/lib/api/product-api";
import { db, initializeDatabase } from "@/lib/db";
import {
  calculateProductSafety,
  classifyIngredientsList,
  initializeClassifier,
} from "@/lib/engine/classifier";
import {
  initializeNormalizer,
  normalizeIngredientsList,
} from "@/lib/engine/normalizer";
import type {
  Product,
  ProductIngredient,
  ProductSafetySummary,
  SourceProvenance,
} from "@/types";

let isInitialized = false;

export async function initializeServices(): Promise<void> {
  if (isInitialized) return;

  await initializeDatabase();
  await initializeNormalizer();
  await initializeClassifier();

  isInitialized = true;
}

export interface ProcessProductResult {
  success: boolean;
  product: Product | null;
  safety: ProductSafetySummary | null;
  error?: string;
  source: SourceProvenance;
  notFound?: boolean;
}

export interface ProcessProductOptions {
  upc: string;
  name: string;
  ingredientsText: string;
  brand?: string;
  imageUrl?: string;
  source?: SourceProvenance;
}

export async function processProductByUPC(
  upc: string,
  useMockOnFail = false,
): Promise<ProcessProductResult> {
  await initializeServices();

  const existingProduct = await db.products.where("upc").equals(upc).first();
  if (existingProduct) {
    const safety = calculateProductSafety(existingProduct.ingredients);

    await db.scanHistory.add({
      productId: existingProduct.id!,
      scannedAt: new Date(),
      upc,
    });

    return {
      success: true,
      product: { ...existingProduct, lastScannedAt: new Date() },
      safety,
      source: existingProduct.sourceProvenance,
    };
  }

  const apiResult = await lookupProductByUPC(upc);

  if (!apiResult.success || !apiResult.product) {
    if (useMockOnFail) {
      const mockData = generateMockProduct(upc);
      return processProductFromData({
        upc: mockData.upc,
        name: mockData.name,
        ingredientsText: mockData.ingredients || "",
        brand: mockData.brand,
        imageUrl: mockData.imageUrl,
        source: "manual",
      });
    }

    return {
      success: false,
      product: null,
      safety: null,
      error: apiResult.error || "Product not found",
      source: "api",
      notFound: true,
    };
  }

  const apiProduct = apiResult.product;

  return processProductFromData({
    upc: apiProduct.upc,
    name: apiProduct.name,
    ingredientsText: apiProduct.ingredients || "",
    brand: apiProduct.brand,
    imageUrl: apiProduct.imageUrl,
    source: "api",
  });
}

export async function processProductFromData({
  upc,
  name,
  ingredientsText,
  brand,
  imageUrl,
  source = "manual",
}: ProcessProductOptions): Promise<ProcessProductResult> {
  await initializeServices();

  try {
    const normalizedIngredients =
      await normalizeIngredientsList(ingredientsText);
    const classifiedIngredients = classifyIngredientsList(
      normalizedIngredients,
      source,
    );
    const safety = calculateProductSafety(classifiedIngredients);

    const product: Omit<Product, "id"> = {
      upc,
      name,
      brand,
      imageUrl,
      ingredients: classifiedIngredients,
      sourceProvenance: source,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastScannedAt: new Date(),
    };

    const id = await db.products.add(product as Product);
    const savedProduct = { ...product, id } as Product;

    if (id !== undefined) {
      await db.scanHistory.add({
        productId: id as number,
        scannedAt: new Date(),
        upc,
      });
    }

    return {
      success: true,
      product: savedProduct,
      safety,
      source,
    };
  } catch (error) {
    console.error("Error processing product:", error);
    return {
      success: false,
      product: null,
      safety: null,
      error:
        error instanceof Error ? error.message : "Failed to process product",
      source,
    };
  }
}

export async function updateProductIngredients(
  productId: number,
  ingredientsText: string,
  source: SourceProvenance,
): Promise<ProcessProductResult> {
  await initializeServices();

  try {
    const product = await db.products.get(productId);
    if (!product) {
      return {
        success: false,
        product: null,
        safety: null,
        error: "Product not found",
        source,
      };
    }

    const normalizedIngredients =
      await normalizeIngredientsList(ingredientsText);
    const classifiedIngredients = classifyIngredientsList(
      normalizedIngredients,
      source,
    );
    const safety = calculateProductSafety(classifiedIngredients);

    const updateData = {
      ingredients: JSON.parse(JSON.stringify(classifiedIngredients)),
      updatedAt: new Date(),
    };
    await db.products.update(productId, updateData);

    const updatedProduct = await db.products.get(productId);

    return {
      success: true,
      product: updatedProduct!,
      safety,
      source,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      product: null,
      safety: null,
      error:
        error instanceof Error ? error.message : "Failed to update product",
      source,
    };
  }
}

export async function getProductHistory(limit = 50): Promise<Product[]> {
  const history = await db.scanHistory
    .orderBy("scannedAt")
    .reverse()
    .limit(limit)
    .toArray();

  const uniqueIds = Array.from(new Set(history.map((e) => e.productId)));
  const productsArray = await db.products.bulkGet(uniqueIds);

  const productMap = new Map();
  for (let i = 0; i < uniqueIds.length; i++) {
    const p = productsArray[i];
    if (p && p.id !== undefined) {
      productMap.set(p.id, p);
    }
  }

  const products: Product[] = [];
  const seen = new Set<number>();

  for (const entry of history) {
    if (!seen.has(entry.productId)) {
      const product = productMap.get(entry.productId);
      if (product) {
        products.push({ ...product, lastScannedAt: entry.scannedAt });
        seen.add(entry.productId);
      }
    }
  }

  return products;
}

export async function getFavoriteProducts(): Promise<Product[]> {
  return db.products.where("isFavorite").equals(1).toArray();
}

export async function toggleProductFavorite(
  productId: number,
): Promise<boolean> {
  const product = await db.products.get(productId);
  if (!product) return false;

  const newFavoriteStatus = !product.isFavorite;
  await db.products.update(productId, {
    isFavorite: newFavoriteStatus,
  });

  return newFavoriteStatus;
}

export async function deleteProduct(productId: number): Promise<void> {
  await db.products.delete(productId);
  await db.scanHistory.where("productId").equals(productId).delete();
}

export async function searchProducts(query: string): Promise<Product[]> {
  const lowerQuery = query.toLowerCase();

  const allProducts = await db.products.toArray();

  return allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.brand?.toLowerCase().includes(lowerQuery) ||
      p.upc.includes(query),
  );
}

export function recalculateProductSafety(
  ingredients: ProductIngredient[],
): ProductSafetySummary {
  return calculateProductSafety(ingredients);
}
