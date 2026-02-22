"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanBarcode,
  Shield,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Settings2,
  Dna,
  Globe,
  MilkOff,
  Beaker,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { Switch } from "@/components/ui/switch";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: typeof ScanBarcode;
  iconBg: string;
  iconColor: string;
}

const steps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to MTHFR Scanner",
    description:
      "Your personal guide to finding foods that support healthy methylation. Scan products and get instant safety analysis.",
    icon: Sparkles,
    iconBg: "bg-gradient-to-br from-emerald-400 to-teal-500",
    iconColor: "text-white",
  },
  {
    id: "scan",
    title: "Scan or Enter Products",
    description:
      "Use your camera to scan barcodes or manually enter product information. We'll look up ingredients from trusted databases.",
    icon: ScanBarcode,
    iconBg: "bg-gradient-to-br from-blue-400 to-indigo-500",
    iconColor: "text-white",
  },
  {
    id: "analyze",
    title: "MTHFR Safety Analysis",
    description:
      "Each ingredient is evaluated against MTHFR-safe criteria. We identify synthetic vitamins, additives, and other problematic components.",
    icon: Shield,
    iconBg: "bg-gradient-to-br from-purple-400 to-pink-500",
    iconColor: "text-white",
  },
  {
    id: "masking",
    title: "Detect Hidden Ingredients",
    description:
      'We flag vague terms like "natural flavors" that may mask hazardous ingredients, helping you make informed decisions.',
    icon: AlertTriangle,
    iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
    iconColor: "text-white",
  },
  {
    id: "personalize",
    title: "Personalize Your Scanner",
    description:
      "Select the health standards and restrictions that matter most to you. You can change these anytime in settings.",
    icon: Settings2,
    iconBg: "bg-gradient-to-br from-rose-400 to-red-500",
    iconColor: "text-white",
  },
];

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeOnboarding, restrictionSettings, toggleRestriction } =
    useAppStore();

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const Icon = step.icon;

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <div
      data-design-id="onboarding-flow"
      className="fixed inset-0 bg-background z-50 flex flex-col"
    >
      <div data-design-id="onboarding-header" className="p-4 flex justify-end">
        <Button
          data-design-id="onboarding-skip"
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="text-muted-foreground"
        >
          Skip
        </Button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            <motion.div
              data-design-id={`onboarding-icon-${step.id}`}
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`w-28 h-28 rounded-3xl ${step.iconBg} flex items-center justify-center mb-8 shadow-xl`}
            >
              <Icon className={`w-14 h-14 ${step.iconColor}`} />
            </motion.div>

            <h1
              data-design-id={`onboarding-title-${step.id}`}
              className="text-2xl font-bold mb-4"
            >
              {step.title}
            </h1>

            <p
              data-design-id={`onboarding-desc-${step.id}`}
              className="text-muted-foreground leading-relaxed"
            >
              {step.description}
            </p>

            {step.id === "personalize" && (
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
                    <span className="font-medium text-sm">
                      Genetic Mutations
                    </span>
                  </div>
                  <Switch
                    checked={restrictionSettings.genetic_mutations}
                    onCheckedChange={() =>
                      toggleRestriction("genetic_mutations")
                    }
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
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        data-design-id="onboarding-progress"
        className="flex justify-center gap-2 mb-8"
      >
        {steps.map((_, index) => (
          <motion.div
            key={index}
            data-design-id={`onboarding-dot-${index}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentStep
                ? "w-8 bg-primary"
                : index < currentStep
                  ? "w-2 bg-primary/50"
                  : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      <div data-design-id="onboarding-actions" className="p-6 flex gap-3">
        {currentStep > 0 && (
          <Button
            data-design-id="onboarding-prev"
            variant="outline"
            size="lg"
            onClick={handlePrev}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        )}

        <Button
          data-design-id="onboarding-next"
          size="lg"
          onClick={handleNext}
          className={`${currentStep === 0 ? "w-full" : "flex-1"}`}
        >
          {isLastStep ? (
            <>
              Get Started
              <Sparkles className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
