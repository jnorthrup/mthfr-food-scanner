import { normalizeIngredient, parseIngredientsList } from "./src/lib/engine/normalizer";
import type { NormalizationResult } from "./src/types";

export async function normalizeIngredientsListOptimized(
  rawText: string,
): Promise<NormalizationResult[]> {
  const parsed = parseIngredientsList(rawText);

  const promises = parsed.map(ingredient => {
    const isSubIngredient = ingredient.startsWith("  ");
    const cleanedIngredient = ingredient.trim();
    if (!cleanedIngredient) return Promise.resolve(null);
    return normalizeIngredient(cleanedIngredient).then(result => ({ isSubIngredient, result }));
  });

  const normalizedItems = await Promise.all(promises);

  const results: NormalizationResult[] = [];

  for (let i = 0; i < normalizedItems.length; i++) {
    const item = normalizedItems[i];
    if (!item) continue;

    if (item.isSubIngredient) {
      const lastParent = results[results.length - 1];
      if (lastParent) {
        if (!lastParent.subIngredients) {
          lastParent.subIngredients = [];
        }
        lastParent.subIngredients.push(item.result);
      }
    } else {
      results.push(item.result);
    }
  }

  return results;
}

export async function normalizeIngredientsListOriginal(
  rawText: string,
): Promise<NormalizationResult[]> {
  const parsed = parseIngredientsList(rawText);
  const results: NormalizationResult[] = [];

  for (const ingredient of parsed) {
    const isSubIngredient = ingredient.startsWith("  ");
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

async function runBenchmark() {
  const rawText = "Water, Enriched Wheat Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Sugar, Natural Flavors, Salt, Citric Acid, Ascorbic Acid, Potassium Sorbate, Sodium Benzoate, Calcium Propionate, Yellow 5, Red 40, Blue 1, High Fructose Corn Syrup, Corn Syrup, Dextrose, Maltodextrin, Modified Corn Starch, Soy Lecithin, Mono and Diglycerides, Polysorbate 60, Sodium Stearoyl Lactylate, Xanthan Gum, Guar Gum, Cellulose Gum, Carrageenan";

  // warmup
  for (let i = 0; i < 100; i++) {
    await normalizeIngredientsListOriginal(rawText);
    await normalizeIngredientsListOptimized(rawText);
  }

  const iterations = 10000;

  const startOrig = performance.now();
  for (let i = 0; i < iterations; i++) {
    await normalizeIngredientsListOriginal(rawText);
  }
  const endOrig = performance.now();

  const startOpt = performance.now();
  for (let i = 0; i < iterations; i++) {
    await normalizeIngredientsListOptimized(rawText);
  }
  const endOpt = performance.now();

  console.log(`Original Total time: ${endOrig - startOrig}ms`);
  console.log(`Original Average time: ${(endOrig - startOrig) / iterations}ms`);

  console.log(`Optimized Total time: ${endOpt - startOpt}ms`);
  console.log(`Optimized Average time: ${(endOpt - startOpt) / iterations}ms`);

  console.log(`Improvement: ${(((endOrig - startOrig) - (endOpt - startOpt)) / (endOrig - startOrig) * 100).toFixed(2)}%`);
}

runBenchmark();
