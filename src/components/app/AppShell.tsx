'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { initializeServices } from '@/lib/services/product-service';
import { BottomNav } from '@/components/navigation/BottomNav';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { HomeScreen } from '@/components/screens/HomeScreen';
import { ScanScreen } from '@/components/screens/ScanScreen';
import { HistoryScreen } from '@/components/screens/HistoryScreen';
import { SettingsScreen } from '@/components/screens/SettingsScreen';
import { Loader2, Shield } from 'lucide-react';

export function AppShell() {
  const { activeTab, hasCompletedOnboarding } = useAppStore();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeServices();
      } catch (error) {
        console.error('Failed to initialize services:', error);
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
        className="fixed inset-0 flex flex-col items-center justify-center bg-background"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div 
            data-design-id="loading-icon"
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center mb-6 shadow-xl shadow-primary/30"
          >
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 data-design-id="loading-title" className="text-xl font-bold mb-2">MTHFR Scanner</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span data-design-id="loading-text">Loading...</span>
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
    <div data-design-id="app-shell" className="fixed inset-0 flex flex-col bg-background">
      <main data-design-id="main-content" className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
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
          
          {activeTab === 'scan' && (
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
          
          {activeTab === 'history' && (
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
          
          {activeTab === 'settings' && (
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
  );
}