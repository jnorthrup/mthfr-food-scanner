
import { describe, it, expect } from "bun:test";
import { checkIngredientContraindication } from "../src/lib/engine/mutations";

describe("checkIngredientContraindication", () => {
  const mockUserMutations = [
    { mutationId: "mthfr_c677t", variant: "T/T", genotype: "homozygous", addedAt: new Date() }
  ];

  it("should detect a contraindication for a known pattern", () => {
    // folic acid is in the mthfr_c677t pattern: "folic acid|folacin|pteroylglutamic acid"
    const result = checkIngredientContraindication("folic acid", mockUserMutations);
    expect(result.contraindication).not.toBeNull();
    expect(result.contraindication?.mutationId).toBe("mthfr_c677t");
    expect(result.mutationId).toBe("mthfr_c677t");
  });

  it("should be case-insensitive", () => {
    const result = checkIngredientContraindication("FOLIC ACID", mockUserMutations);
    expect(result.contraindication).not.toBeNull();
    expect(result.mutationId).toBe("mthfr_c677t");
  });

  it("should return null when no contraindication matches", () => {
    const result = checkIngredientContraindication("methylfolate", mockUserMutations);
    expect(result.contraindication).toBeNull();
    expect(result.mutationId).toBeNull();
  });

  it("should handle ingredients not in user mutations", () => {
    const result = checkIngredientContraindication("folic acid", []);
    expect(result.contraindication).toBeNull();
    expect(result.mutationId).toBeNull();
  });
});
