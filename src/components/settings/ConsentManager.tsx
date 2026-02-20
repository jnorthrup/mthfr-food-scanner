"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  Camera,
  MessageSquare,
  Users,
  Shield,
  Info,
} from "lucide-react";
import type { ConsentType } from "@/types";
import { useAppStore } from "@/lib/store";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface ConsentConfig {
  type: ConsentType;
  title: string;
  description: string;
  howUsed: string;
  icon: typeof MapPin;
  iconColor: string;
}

const consentConfigs: ConsentConfig[] = [
  {
    type: "location",
    title: "Location Access",
    description:
      "Help find local product availability and regional formulations",
    howUsed:
      "Location is used to find nearby stores carrying products and identify region-specific product variations that may have different ingredients.",
    icon: MapPin,
    iconColor: "text-blue-500",
  },
  {
    type: "photo",
    title: "Photo Upload & Analysis",
    description: "Scan ingredient labels using your camera for OCR analysis",
    howUsed:
      "Photos of product labels are processed using OCR to extract ingredient lists. This helps verify or supplement data from product databases.",
    icon: Camera,
    iconColor: "text-purple-500",
  },
  {
    type: "review",
    title: "Review Aggregation",
    description: "Access community reviews for additional ingredient insights",
    howUsed:
      "With your permission, we search public product reviews for mentions of ingredients that may not appear on standard labels.",
    icon: MessageSquare,
    iconColor: "text-amber-500",
  },
  {
    type: "data_contribution",
    title: "Data Contribution",
    description: "Share your findings to improve the database for everyone",
    howUsed:
      "Your manually entered products and OCR corrections help improve ingredient data accuracy for the entire community.",
    icon: Users,
    iconColor: "text-emerald-500",
  },
];

interface ConsentItemProps {
  config: ConsentConfig;
  isGranted: boolean;
  onToggle: (granted: boolean) => void;
}

function ConsentItem({ config, isGranted, onToggle }: ConsentItemProps) {
  const Icon = config.icon;

  return (
    <motion.div
      data-design-id={`consent-item-${config.type}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-xl border transition-colors",
        isGranted ? "bg-primary/5 border-primary/20" : "bg-card border-border",
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            isGranted ? "bg-primary/10" : "bg-muted",
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              isGranted ? config.iconColor : "text-muted-foreground",
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <h4
              data-design-id={`consent-title-${config.type}`}
              className="font-semibold"
            >
              {config.title}
            </h4>
            <Switch
              data-design-id={`consent-toggle-${config.type}`}
              checked={isGranted}
              onCheckedChange={onToggle}
            />
          </div>
          <p
            data-design-id={`consent-desc-${config.type}`}
            className="text-sm text-muted-foreground mt-1"
          >
            {config.description}
          </p>

          {isGranted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 bg-background rounded-lg border border-border/50"
            >
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <p>{config.howUsed}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ConsentManager() {
  const { consents, setConsent } = useAppStore();

  return (
    <div data-design-id="consent-manager" className="space-y-6">
      <Card data-design-id="consent-header-card">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle data-design-id="consent-manager-title">
                Privacy & Permissions
              </CardTitle>
              <CardDescription data-design-id="consent-manager-desc">
                Control how your data is collected and used
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert data-design-id="consent-info-alert">
            <Info className="w-4 h-4" />
            <AlertDescription>
              All data collection is opt-in. The app works fully offline with
              core features. Enable permissions only for features you want to
              use.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <div data-design-id="consent-list" className="space-y-3">
        {consentConfigs.map((config, index) => (
          <motion.div
            key={config.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ConsentItem
              config={config}
              isGranted={consents[config.type]?.granted || false}
              onToggle={(granted) => setConsent(config.type, granted)}
            />
          </motion.div>
        ))}
      </div>

      <Card data-design-id="data-policy-card" className="bg-muted/30">
        <CardContent className="pt-4">
          <h4
            data-design-id="data-policy-title"
            className="font-semibold text-sm mb-2"
          >
            How We Protect Your Data
          </h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li
              data-design-id="data-policy-item-1"
              className="flex items-start gap-2"
            >
              <span className="text-primary">•</span>
              All product data is stored locally on your device using IndexedDB
            </li>
            <li
              data-design-id="data-policy-item-2"
              className="flex items-start gap-2"
            >
              <span className="text-primary">•</span>
              Photos are processed on-device when possible; never stored on
              servers
            </li>
            <li
              data-design-id="data-policy-item-3"
              className="flex items-start gap-2"
            >
              <span className="text-primary">•</span>
              Location data is used only for queries and never logged
            </li>
            <li
              data-design-id="data-policy-item-4"
              className="flex items-start gap-2"
            >
              <span className="text-primary">•</span>
              You can withdraw consent and delete all data at any time
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
