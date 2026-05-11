"use client";

import { motion } from "framer-motion";

interface OnboardingProgressProps {
  totalSteps: number;
  currentStep: number;
}

export function OnboardingProgress({
  totalSteps,
  currentStep,
}: OnboardingProgressProps) {
  return (
    <div
      data-design-id="onboarding-progress"
      className="flex justify-center gap-2 mb-8"
    >
      {Array.from({ length: totalSteps }).map((_, index) => (
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
  );
}
