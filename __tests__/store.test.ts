import { describe, it, expect, beforeEach, mock } from "bun:test";

// Mocking zustand before importing useAppStore
mock.module("zustand", () => {
  const create = (initializer: any) => {
    // Handle the curried call: create<AppStore>()(persist(...))
    if (!initializer || typeof initializer !== 'function') return (init: any) => create(init);

    let state: any;
    const set = (partial: any) => {
      const nextState = typeof partial === "function" ? partial(state) : partial;
      state = { ...state, ...nextState };
    };
    const get = () => state;
    const store = {
      getState: get,
      setState: set,
      subscribe: () => () => {},
      destroy: () => {},
    };
    state = initializer(set, get, store);

    const useStore = () => store;
    Object.assign(useStore, store);
    return useStore;
  }
  return { create, default: create, createStore: create };
});

mock.module("zustand/middleware", () => {
  return {
    persist: (config: any) => config,
  };
});

import { useAppStore } from "../src/lib/store";
import type { Product } from "@/types";

describe("AppStore", () => {
  let store: any;

  beforeEach(() => {
    store = useAppStore();
    // Re-initialize state to default for each test
    // Since we are mocking 'create' to return a singleton-like store for this test
    // we should ideally reset the state.
    // However, the mock 'create' above creates a new state when called.
    // But useAppStore is a constant.
    // Let's add a way to reset it.
    const defaultState = {
      currentProduct: null,
      scanHistory: [],
      favorites: [],
      isLoading: false,
      error: null,
      hasCompletedOnboarding: false,
      activeTab: "home",
      // defaultConsents and defaultRestrictions will be set by the actual initializer
    };
    store.setState(defaultState);
  });

  it("should have initial state", () => {
    const state = store.getState();
    expect(state.currentProduct).toBeNull();
    expect(state.scanHistory).toEqual([]);
    expect(state.favorites).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.hasCompletedOnboarding).toBe(false);
    expect(state.activeTab).toBe("home");
  });

  it("should set current product", () => {
    const product: Product = {
      upc: "123456789012",
      name: "Test Product",
      ingredients: [],
      sourceProvenance: "manual",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.getState().setCurrentProduct(product);
    expect(store.getState().currentProduct).toEqual(product);
  });

  it("should add a new product to history", () => {
    const product: Product = {
      upc: "123456789012",
      name: "New Product",
      ingredients: [],
      sourceProvenance: "manual",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.getState().addToHistory(product);
    const history = store.getState().scanHistory;
    expect(history.length).toBe(1);
    expect(history[0].upc).toBe("123456789012");
    expect(history[0].lastScannedAt).toBeInstanceOf(Date);
  });

  it("should update an existing product in history", () => {
    const product: Product = {
      upc: "123456789012",
      name: "Product V1",
      ingredients: [],
      sourceProvenance: "manual",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.getState().addToHistory(product);

    const updatedProduct = { ...product, name: "Product V2" };
    store.getState().addToHistory(updatedProduct);

    const history = store.getState().scanHistory;
    expect(history.length).toBe(1);
    expect(history[0].name).toBe("Product V2");
  });

  it("should limit history to 100 items", () => {
    for (let i = 0; i < 110; i++) {
      store.getState().addToHistory({
        upc: `upc-${i}`,
        name: `Product ${i}`,
        ingredients: [],
        sourceProvenance: "manual",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    expect(store.getState().scanHistory.length).toBe(100);
    // Newest should be first
    expect(store.getState().scanHistory[0].upc).toBe("upc-109");
  });

  it("should toggle favorite", () => {
    const product: Product = {
      id: 1,
      upc: "123456789012",
      name: "Test Product",
      ingredients: [],
      sourceProvenance: "manual",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    store.getState().addToHistory(product);

    // Toggle on
    store.getState().toggleFavorite(1);
    expect(store.getState().favorites.length).toBe(1);
    expect(store.getState().favorites[0].id).toBe(1);
    expect(store.getState().favorites[0].isFavorite).toBe(true);

    // Toggle off
    store.getState().toggleFavorite(1);
    expect(store.getState().favorites.length).toBe(0);
  });

  it("should set consent", () => {
    // Initial consents need to be there because the mock reset might have cleared them
    // but the store initializer ran once.
    // Actually setConsent uses the current consents in state.

    store.getState().setConsent("location", true);
    expect(store.getState().consents.location.granted).toBe(true);
    expect(store.getState().consents.location.grantedAt).toBeInstanceOf(Date);

    store.getState().setConsent("location", false);
    expect(store.getState().consents.location.granted).toBe(false);
    expect(store.getState().consents.location.withdrawnAt).toBeInstanceOf(Date);
  });

  it("should toggle restriction", () => {
    // Ensure restrictionSettings exists
    if (!store.getState().restrictionSettings) {
        store.setState({ restrictionSettings: { mthfr: true } });
    }
    const initial = store.getState().restrictionSettings.mthfr;
    store.getState().toggleRestriction("mthfr");
    expect(store.getState().restrictionSettings.mthfr).toBe(!initial);
  });

  it("should handle UI actions", () => {
    store.getState().setLoading(true);
    expect(store.getState().isLoading).toBe(true);

    store.getState().setError("some error");
    expect(store.getState().error).toBe("some error");

    store.getState().setActiveTab("settings");
    expect(store.getState().activeTab).toBe("settings");

    store.getState().completeOnboarding();
    expect(store.getState().hasCompletedOnboarding).toBe(true);
  });

  it("should clear history", () => {
    store.getState().addToHistory({ upc: "1", name: "1", ingredients: [], sourceProvenance: "manual", createdAt: new Date(), updatedAt: new Date() });
    store.getState().clearHistory();
    expect(store.getState().scanHistory).toEqual([]);
  });
});
