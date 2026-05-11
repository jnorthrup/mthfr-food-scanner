import { describe, it, expect, mock } from "bun:test";

// Mocking the database before importing anything that uses it
mock.module("../src/lib/db", () => {
  return {
    db: {
      scanHistory: {
        orderBy: mock(() => ({
          reverse: mock(() => ({
            limit: mock(() => ({
              toArray: mock(async () => [
                { productId: 1, scannedAt: new Date("2023-01-01T10:00:00Z"), upc: "111" },
                { productId: 2, scannedAt: new Date("2023-01-01T09:00:00Z"), upc: "222" },
                { productId: 1, scannedAt: new Date("2023-01-01T08:00:00Z"), upc: "111" },
              ]),
            })),
          })),
        })),
      },
      products: {
        get: mock(async (id: number) => {
          if (id === 1) return { id: 1, name: "Product 1", upc: "111" };
          if (id === 2) return { id: 2, name: "Product 2", upc: "222" };
          return null;
        }),
        where: mock(() => ({
          anyOf: mock(() => ({
            toArray: mock(async () => [
              { id: 1, name: "Product 1", upc: "111" },
              { id: 2, name: "Product 2", upc: "222" },
            ]),
          })),
        })),
      },
    },
    initializeDatabase: mock(async () => {}),
  };
});

// Mocking other modules to avoid errors
mock.module("../src/lib/engine/normalizer", () => ({
  initializeNormalizer: mock(async () => {}),
}));
mock.module("../src/lib/engine/classifier", () => ({
  initializeClassifier: mock(async () => {}),
}));

import { getProductHistory } from "../src/lib/services/product-service";
import { db } from "../src/lib/db";

describe("product-service getProductHistory", () => {
  it("should return the latest products from scan history with the correct order and deduped", async () => {
    const products = await getProductHistory();

    expect(products).toHaveLength(2);
    expect(products[0].id).toBe(1);
    expect(products[0].lastScannedAt).toEqual(new Date("2023-01-01T10:00:00Z"));
    expect(products[1].id).toBe(2);
    expect(products[1].lastScannedAt).toEqual(new Date("2023-01-01T09:00:00Z"));

    // After optimization, db.products.get should NOT be called.
    // Instead, db.products.where('id').anyOf() should be used.
    expect(db.products.get).not.toHaveBeenCalled();
    expect(db.products.where).toHaveBeenCalledWith("id");
  });
});
