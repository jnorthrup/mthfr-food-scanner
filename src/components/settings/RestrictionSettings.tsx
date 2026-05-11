import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/store";
import {
  Beaker,
  Dna,
  Globe,
  MilkOff,
  Stethoscope,
} from "lucide-react";

export function RestrictionSettings() {
  const { restrictionSettings, toggleRestriction } = useAppStore();

  return (
    <Card data-design-id="health-standards-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Stethoscope className="w-4 h-4" />
          Health Standards & Restrictions
        </CardTitle>
        <CardDescription>
          Customize which health standards to apply during scans
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Dna className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-sm">MTHFR Support</p>
              <p className="text-xs text-muted-foreground">
                Avoid synthetic folic acid & B12
              </p>
            </div>
          </div>
          <Switch
            checked={restrictionSettings.mthfr}
            onCheckedChange={() => toggleRestriction("mthfr")}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Globe className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-sm">EU Standards</p>
              <p className="text-xs text-muted-foreground">
                Avoid ingredients banned in the EU
              </p>
            </div>
          </div>
          <Switch
            checked={restrictionSettings.eu_standards}
            onCheckedChange={() => toggleRestriction("eu_standards")}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Stethoscope className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Genetic Mutations</p>
              <p className="text-xs text-muted-foreground">
                G6PD (Favism) & other variants
              </p>
            </div>
          </div>
          <Switch
            checked={restrictionSettings.genetic_mutations}
            onCheckedChange={() => toggleRestriction("genetic_mutations")}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <MilkOff className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Common Allergens</p>
              <p className="text-xs text-muted-foreground">
                Soy, Wheat, Dairy, Nuts, etc.
              </p>
            </div>
          </div>
          <Switch
            checked={restrictionSettings.allergens}
            onCheckedChange={() => toggleRestriction("allergens")}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Beaker className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-sm">Additives & Others</p>
              <p className="text-xs text-muted-foreground">
                Preservatives & synthetic chemicals
              </p>
            </div>
          </div>
          <Switch
            checked={restrictionSettings.additives}
            onCheckedChange={() => toggleRestriction("additives")}
          />
        </div>
      </CardContent>
    </Card>
  );
}
