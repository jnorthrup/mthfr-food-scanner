import { motion } from "framer-motion";
import { ScanBarcode, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeQuickActionsProps {
  setActiveTab: (tab: "home" | "scan" | "history" | "settings") => void;
}

export function HomeQuickActions({ setActiveTab }: HomeQuickActionsProps) {
  return (
    <motion.div
      data-design-id="quick-actions"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 gap-3"
    >
      <Button
        data-design-id="action-scan"
        onClick={() => setActiveTab("scan")}
        className="h-28 flex-col gap-2 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/20"
      >
        <ScanBarcode className="w-8 h-8" />
        <span className="font-semibold">Scan Product</span>
      </Button>

      <Button
        data-design-id="action-manual"
        variant="outline"
        onClick={() => setActiveTab("scan")}
        className="h-28 flex-col gap-2 rounded-2xl border-2 hover:bg-secondary/50"
      >
        <Plus className="w-8 h-8" />
        <span className="font-semibold">Add Manually</span>
      </Button>
    </motion.div>
  );
}
