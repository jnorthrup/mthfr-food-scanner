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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";

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
];

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeOnboarding } = useAppStore();

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
