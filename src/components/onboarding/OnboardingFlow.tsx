"use client";

import { useAppStore } from "@/lib/store";
import { AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ScanBarcode,
  Settings2,
  Shield,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { OnboardingActions } from "./OnboardingActions";
import { OnboardingHeader } from "./OnboardingHeader";
import { OnboardingProgress } from "./OnboardingProgress";
import { OnboardingStepContent } from "./OnboardingStepContent";

export interface OnboardingStep {
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
  const { completeOnboarding } = useAppStore();

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

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
      <OnboardingHeader onSkip={handleSkip} />

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <OnboardingStepContent key={step.id} step={step} />
        </AnimatePresence>
      </div>

      <OnboardingProgress totalSteps={steps.length} currentStep={currentStep} />

      <OnboardingActions
        currentStep={currentStep}
        isLastStep={isLastStep}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
