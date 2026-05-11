"use client";

import { motion } from "framer-motion";
import { forwardRef } from "react";
import type { OnboardingStep } from "./OnboardingFlow";
import { PersonalizeSettings } from "./PersonalizeSettings";

interface OnboardingStepContentProps {
  step: OnboardingStep;
}

export const OnboardingStepContent = forwardRef<
  HTMLDivElement,
  OnboardingStepContentProps
>(({ step }, ref) => {
  const Icon = step.icon;

  return (
    <motion.div
      ref={ref}
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

      {step.id === "personalize" && <PersonalizeSettings />}
    </motion.div>
  );
});
OnboardingStepContent.displayName = "OnboardingStepContent";
