import { motion, AnimatePresence } from "framer-motion";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { ScanScreen } from "@/components/screens/ScanScreen";
import { HistoryScreen } from "@/components/screens/HistoryScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";

interface ActiveScreenProps {
  activeTab: "home" | "scan" | "history" | "settings";
}

export function ActiveScreen({ activeTab }: ActiveScreenProps) {
  const screenVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
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
  );
}
