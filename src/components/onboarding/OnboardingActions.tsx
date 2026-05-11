"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface OnboardingActionsProps {
  currentStep: number;
  isLastStep: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function OnboardingActions({
  currentStep,
  isLastStep,
  onPrev,
  onNext,
}: OnboardingActionsProps) {
  return (
    <div data-design-id="onboarding-actions" className="p-6 flex gap-3">
      {currentStep > 0 && (
        <Button
          data-design-id="onboarding-prev"
          variant="outline"
          size="lg"
          onClick={onPrev}
          className="flex-1"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      )}

      <Button
        data-design-id="onboarding-next"
        size="lg"
        onClick={onNext}
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
  );
}
