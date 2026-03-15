"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dna,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Search,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import {
  KNOWN_MUTATIONS,
  getContraindicationsForMutation,
  getMutationCategories,
} from "@/lib/engine/mutations";
import type { MutationDefinition, UserMutation } from "@/types";
import { cn } from "@/lib/utils";

interface MutationInputProps {
  userMutations: UserMutation[];
  onAddMutation: (mutation: {
    mutationId: string;
    variant: string;
    genotype: string;
  }) => void;
  onRemoveMutation: (id: number) => void;
}

export function MutationInput({
  userMutations,
  onAddMutation,
  onRemoveMutation,
}: MutationInputProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [selectedMutation, setSelectedMutation] =
    useState<MutationDefinition | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = getMutationCategories();

  const filteredMutations = searchQuery
    ? KNOWN_MUTATIONS.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.gene.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : KNOWN_MUTATIONS;

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const isMutationAdded = (mutationId: string) => {
    return userMutations.some((m) => m.mutationId === mutationId);
  };

  const getUserVariant = (mutationId: string) => {
    return userMutations.find((m) => m.mutationId === mutationId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Dna className="w-5 h-5 text-violet-600" />
        <h3 className="font-semibold">Your Genetic Variants</h3>
        <span className="text-sm text-muted-foreground">
          ({userMutations.length} added)
        </span>
      </div>

      {userMutations.length > 0 && (
        <div className="space-y-2 mb-6">
          <h4 className="text-sm font-medium text-muted-foreground">
            Added Variants
          </h4>
          <div className="flex flex-wrap gap-2">
            {userMutations.map((um) => {
              const mutation = KNOWN_MUTATIONS.find(
                (m) => m.id === um.mutationId,
              );
              if (!mutation) return null;
              const contraindications =
                getContraindicationsForMutation(um.mutationId);
              return (
                <motion.div
                  key={um.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 rounded-full border border-violet-200 dark:border-violet-800"
                >
                  <span className="text-sm font-medium">{mutation.gene}</span>
                  <span className="text-xs text-muted-foreground">
                    {um.variant}
                  </span>
                  {contraindications.length > 0 && (
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <button
                    onClick={() => um.id && onRemoveMutation(um.id)}
                    className="ml-1 hover:bg-violet-200 dark:hover:bg-violet-800 rounded-full p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search genes or variants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background"
        />
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          Browse by Category
        </h4>
        <div className="space-y-1">
          {!searchQuery
            ? categories.map((category) => {
                const mutationsInCategory = KNOWN_MUTATIONS.filter(
                  (m) => m.category === category.id,
                );
                const isExpanded = expandedCategories.has(category.id);

                return (
                  <div key={category.id} className="border rounded-lg">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between p-3 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <span className="font-medium">{category.name}</span>
                        <span className="text-sm text-muted-foreground">
                          ({category.count})
                        </span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-2 pt-0 space-y-1">
                            {mutationsInCategory.map((mutation) => (
                              <button
                                key={mutation.id}
                                onClick={() => setSelectedMutation(mutation)}
                                className={cn(
                                  "w-full flex items-center justify-between p-2 rounded-lg text-left hover:bg-muted/50",
                                  isMutationAdded(mutation.id) &&
                                    "bg-violet-50 dark:bg-violet-900/20",
                                )}
                              >
                                <div>
                                  <div className="font-medium text-sm">
                                    {mutation.gene}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {mutation.name}
                                  </div>
                                </div>
                                {isMutationAdded(mutation.id) ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <Plus className="w-4 h-4 text-muted-foreground" />
                                )}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            : filteredMutations.map((mutation) => (
                <button
                  key={mutation.id}
                  onClick={() => setSelectedMutation(mutation)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg text-left hover:bg-muted/50 border",
                    isMutationAdded(mutation.id) &&
                      "bg-violet-50 dark:bg-violet-900/20",
                  )}
                >
                  <div>
                    <div className="font-medium">{mutation.gene}</div>
                    <div className="text-sm text-muted-foreground">
                      {mutation.name}
                    </div>
                  </div>
                  {isMutationAdded(mutation.id) ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedMutation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedMutation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">{selectedMutation.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Gene: {selectedMutation.gene}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedMutation(null)}
                  className="p-1 hover:bg-muted rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm">{selectedMutation.description}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Select Your Genotype
                </h4>
                <div className="space-y-2">
                  {selectedMutation.commonVariants.map((variant) => {
                    const contraindications = getContraindicationsForMutation(
                      selectedMutation.id,
                    );
                    const hasIssues =
                      contraindications.length > 0 &&
                      variant.impact !== "normal";

                    return (
                      <button
                        key={variant.variant}
                        onClick={() => {
                          onAddMutation({
                            mutationId: selectedMutation.id,
                            variant: variant.variant,
                            genotype: variant.genotype,
                          });
                          setSelectedMutation(null);
                        }}
                        disabled={isMutationAdded(selectedMutation.id)}
                        className={cn(
                          "w-full p-3 rounded-lg border text-left hover:bg-muted/50 transition-colors",
                          hasIssues &&
                            variant.impact !== "normal" &&
                            "border-amber-300",
                          variant.impact === "normal" && "border-emerald-300",
                          isMutationAdded(selectedMutation.id) &&
                            "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">
                              {variant.shorthand}
                            </span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({variant.variant})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {variant.impact === "normal" ? (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                Normal
                              </span>
                            ) : variant.impact === "reduced" ? (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                                Reduced
                              </span>
                            ) : variant.impact === "increased" ? (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                Increased
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                                {variant.impact}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {variant.frequency}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {getContraindicationsForMutation(selectedMutation.id).length >
                0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-medium flex items-center gap-2 text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="w-4 h-4" />
                    Dietary Considerations
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getContraindicationsForMutation(selectedMutation.id).length}{" "}
                    ingredient concerns for this variant
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}