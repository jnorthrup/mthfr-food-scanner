import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Product,
  UserConsent,
  ConsentType,
  RestrictionProfileId,
  UserMutation,
} from "@/types";

interface AppStore {
  currentProduct: Product | null;
  scanHistory: Product[];
  favorites: Product[];
  consents: Record<ConsentType, UserConsent>;
  restrictionSettings: Record<RestrictionProfileId, boolean>;
  userMutations: UserMutation[];
  isLoading: boolean;
  error: string | null;
  hasCompletedOnboarding: boolean;
  activeTab: "home" | "scan" | "history" | "settings";

  setCurrentProduct: (product: Product | null) => void;
  addToHistory: (product: Product) => void;
  toggleFavorite: (productId: number) => void;
  setConsent: (type: ConsentType, granted: boolean) => void;
  toggleRestriction: (profileId: RestrictionProfileId) => void;
  addUserMutation: (mutation: Omit<UserMutation, "id" | "addedAt">) => void;
  removeUserMutation: (id: number) => void;
  clearUserMutations: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  completeOnboarding: () => void;
  setActiveTab: (tab: "home" | "scan" | "history" | "settings") => void;
  clearHistory: () => void;
}

const defaultConsents: Record<ConsentType, UserConsent> = {
  location: { consentType: "location", granted: false, version: 1 },
  photo: { consentType: "photo", granted: false, version: 1 },
  review: { consentType: "review", granted: false, version: 1 },
  data_contribution: {
    consentType: "data_contribution",
    granted: false,
    version: 1,
  },
};

const defaultRestrictions: Record<RestrictionProfileId, boolean> = {
  mthfr: true,
  eu_standards: true,
  genetic_mutations: true,
  allergens: true,
  additives: true,
  allergy_soy: false,
  allergy_wheat: false,
  allergy_milk: false,
  allergy_egg: false,
  allergy_peanut: false,
  allergy_treenuts: false,
  allergy_fish: false,
  allergy_shellfish: false,
  allergy_sesame: false,
  mutation_g6pd: false,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentProduct: null,
      scanHistory: [],
      favorites: [],
      consents: defaultConsents,
      restrictionSettings: defaultRestrictions,
      userMutations: [],
      isLoading: false,
      error: null,
      hasCompletedOnboarding: false,
      activeTab: "home",

      setCurrentProduct: (product) => set({ currentProduct: product }),

      addToHistory: (product) => {
        const history = get().scanHistory;
        const existingIndex = history.findIndex((p) => p.upc === product.upc);

        if (existingIndex >= 0) {
          const updatedHistory = [...history];
          updatedHistory[existingIndex] = {
            ...product,
            lastScannedAt: new Date(),
          };
          set({ scanHistory: updatedHistory });
        } else {
          set({
            scanHistory: [
              { ...product, lastScannedAt: new Date() },
              ...history,
            ].slice(0, 100),
          });
        }
      },

      toggleFavorite: (productId) => {
        const history = get().scanHistory;
        const favorites = get().favorites;
        const product = history.find((p) => p.id === productId);

        if (!product) return;

        const isFavorite = favorites.some((f) => f.id === productId);

        if (isFavorite) {
          set({ favorites: favorites.filter((f) => f.id !== productId) });
        } else {
          set({ favorites: [...favorites, { ...product, isFavorite: true }] });
        }
      },

      setConsent: (type, granted) => {
        const consents = get().consents;
        set({
          consents: {
            ...consents,
            [type]: {
              ...consents[type],
              granted,
              grantedAt: granted ? new Date() : undefined,
              withdrawnAt: !granted ? new Date() : undefined,
            },
          },
        });
      },

      toggleRestriction: (profileId) => {
        const settings = get().restrictionSettings;
        set({
          restrictionSettings: {
            ...settings,
            [profileId]: !settings[profileId],
          },
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      clearHistory: () => set({ scanHistory: [] }),

      addUserMutation: (mutation) => {
        const mutations = get().userMutations;
        const existing = mutations.find(
          (m) => m.mutationId === mutation.mutationId,
        );
        if (existing) {
          set({
            userMutations: mutations.map((m) =>
              m.mutationId === mutation.mutationId
                ? { ...m, variant: mutation.variant, genotype: mutation.genotype }
                : m,
            ),
          });
        } else {
          set({
            userMutations: [
              ...mutations,
              { ...mutation, addedAt: new Date() },
            ],
          });
        }
      },

      removeUserMutation: (id) => {
        set({
          userMutations: get().userMutations.filter((m) => m.id !== id),
        });
      },

      clearUserMutations: () => set({ userMutations: [] }),
    }),
    {
      name: "mthfr-scanner-storage",
      partialize: (state) => ({
        scanHistory: state.scanHistory,
        favorites: state.favorites,
        consents: state.consents,
        restrictionSettings: state.restrictionSettings,
        userMutations: state.userMutations,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    },
  ),
);
