import { normalizeIngredientsList } from "./src/lib/engine/normalizer";

async function runBenchmark() {
  const rawText = "Water, Enriched Wheat Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Sugar, Natural Flavors, Salt, Citric Acid, Ascorbic Acid, Potassium Sorbate, Sodium Benzoate, Calcium Propionate, Yellow 5, Red 40, Blue 1, High Fructose Corn Syrup, Corn Syrup, Dextrose, Maltodextrin, Modified Corn Starch, Soy Lecithin, Mono and Diglycerides, Polysorbate 60, Sodium Stearoyl Lactylate, Xanthan Gum, Guar Gum, Cellulose Gum, Carrageenan";

  // warmup
  for (let i = 0; i < 100; i++) {
    await normalizeIngredientsList(rawText);
  }

  const start = performance.now();
  const iterations = 10000;
  for (let i = 0; i < iterations; i++) {
    await normalizeIngredientsList(rawText);
  }
  const end = performance.now();
  console.log(`Total time: ${end - start}ms`);
  console.log(`Average time: ${(end - start) / iterations}ms`);
}

runBenchmark();
