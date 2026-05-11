"use client";

import { Button } from "@/components/ui/button";

interface OnboardingHeaderProps {
  onSkip: () => void;
}

export function OnboardingHeader({ onSkip }: OnboardingHeaderProps) {
  return (
    <div data-design-id="onboarding-header" className="p-4 flex justify-end">
      <Button
        data-design-id="onboarding-skip"
        variant="ghost"
        size="sm"
        onClick={onSkip}
        className="text-muted-foreground"
      >
        Skip
      </Button>
    </div>
  );
}
