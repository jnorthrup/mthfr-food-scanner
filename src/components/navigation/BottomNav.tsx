"use client";

import { motion } from "framer-motion";
import { Home, ScanBarcode, History, Settings } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type TabType = "home" | "scan" | "history" | "settings";

interface NavItem {
  id: TabType;
  label: string;
  icon: typeof Home;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "scan", label: "Scan", icon: ScanBarcode },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <nav
      data-design-id="bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-50 glass bg-card/90 border-t border-border"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto mobile-safe-area">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              data-design-id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "relative flex flex-col items-center justify-center w-16 h-full transition-all duration-200",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-lg",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 w-8 h-1 rounded-full safe-bg"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span
                className={cn(
                  "text-[10px] mt-0.5 font-medium",
                  isActive ? "font-semibold" : "",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
