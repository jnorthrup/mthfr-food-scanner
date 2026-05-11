"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/store";
import { initializeServices } from "@/lib/services/product-service";
import { BottomNav } from "@/components/navigation/BottomNav";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { LoadingScreen } from "./LoadingScreen";
import { ActiveScreen } from "./ActiveScreen";

export function AppShell() {
  const { activeTab, hasCompletedOnboarding } = useAppStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeServices();
      } catch (error) {
        console.error("Failed to initialize services:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  if (isInitializing) {
    return <LoadingScreen />;
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  return (
    <div
      data-design-id="desktop-frame"
      className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 w-full overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-grid-slate-200/50 dark:bg-grid-white/[0.02] bg-[size:32px_32px]" />
      <div
        data-design-id="app-shell"
        className="relative z-10 flex flex-col bg-background w-full h-[100dvh] pb-[env(safe-area-inset-bottom)] sm:h-[100dvh] sm:max-h-[850px] sm:w-[400px] sm:shadow-[0_0_40px_-10px_rgba(0,0,0,0.2)] sm:border sm:border-border sm:rounded-[2.5rem] overflow-hidden sm:my-8"
      >
        <main data-design-id="main-content" className="flex-1 overflow-hidden relative">
          <ActiveScreen activeTab={activeTab} />
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
