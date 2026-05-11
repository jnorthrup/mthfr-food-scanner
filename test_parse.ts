import { parseIngredientsList } from "./src/lib/engine/normalizer";

const res = parseIngredientsList("Enriched Flour (Wheat Flour, Niacin, Iron)");
console.log(JSON.stringify(res));

const res2 = parseIngredientsList("Water, Enriched Wheat Flour (Wheat Flour, Niacin, Reduced Iron, Thiamine Mononitrate, Riboflavin, Folic Acid), Sugar, Natural Flavors, Salt");
console.log(JSON.stringify(res2));
