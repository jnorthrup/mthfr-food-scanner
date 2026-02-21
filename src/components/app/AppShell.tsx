"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { initializeServices } from "@/lib/services/product-service";
import { BottomNav } from "@/components/navigation/BottomNav";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { ScanScreen } from "@/components/screens/ScanScreen";
import { HistoryScreen } from "@/components/screens/HistoryScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { Loader2, Shield } from "lucide-react";

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
    return (
      <div
        data-design-id="loading-screen"
        className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div
            data-design-id="loading-icon"
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center mb-8 shadow-2xl shadow-primary/30"
          >
            <Shield className="w-12 h-12 text-white" />
          </div>
          <h1 data-design-id="loading-title" className="text-2xl font-bold mb-3 tracking-tight">
            MTHFR Scanner
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span data-design-id="loading-text">Optimizing Engines...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingFlow />;
  }

  const screenVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

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
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div
                key="home"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <HomeScreen />
              </motion.div>
            )}

            {activeTab === "scan" && (
              <motion.div
                key="scan"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ScanScreen />
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div
                key="history"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <HistoryScreen />
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <SettingsScreen />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
