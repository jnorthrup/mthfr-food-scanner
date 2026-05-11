"use client";

import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Beaker, Dna, Globe, MilkOff, Stethoscope } from "lucide-react";

export function PersonalizeSettings() {
  const { restrictionSettings, toggleRestriction } = useAppStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full mt-8 space-y-3 text-left"
    >
      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center gap-3">
          <Dna className="w-5 h-5 text-emerald-600" />
          <span className="font-medium text-sm">MTHFR Support</span>
        </div>
        <Switch
          checked={restrictionSettings.mthfr}
          onCheckedChange={() => toggleRestriction("mthfr")}
        />
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-sm">EU Standards</span>
        </div>
        <Switch
          checked={restrictionSettings.eu_standards}
          onCheckedChange={() => toggleRestriction("eu_standards")}
        />
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center gap-3">
          <Stethoscope className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-sm">Genetic Mutations</span>
        </div>
        <Switch
          checked={restrictionSettings.genetic_mutations}
          onCheckedChange={() => toggleRestriction("genetic_mutations")}
        />
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center gap-3">
          <MilkOff className="w-5 h-5 text-orange-600" />
          <span className="font-medium text-sm">Allergens</span>
        </div>
        <Switch
          checked={restrictionSettings.allergens}
          onCheckedChange={() => toggleRestriction("allergens")}
        />
      </div>
      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
        <div className="flex items-center gap-3">
          <Beaker className="w-5 h-5 text-amber-600" />
          <span className="font-medium text-sm">Additives</span>
        </div>
        <Switch
          checked={restrictionSettings.additives}
          onCheckedChange={() => toggleRestriction("additives")}
        />
      </div>
    </motion.div>
  );
}
