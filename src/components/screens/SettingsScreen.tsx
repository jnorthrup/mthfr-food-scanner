"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  Database,
  Trash2,
  Download,
  Info,
  Moon,
  Sun,
  HelpCircle,
  BookOpen,
  Mail,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { exportData, clearAllData } from "@/lib/db";
import { ConsentManager } from "@/components/settings/ConsentManager";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

export function SettingsScreen() {
  const { clearHistory, scanHistory } = useAppStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleExportData = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mthfr-scanner-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully!");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  const handleClearData = async () => {
    try {
      await clearAllData();
      clearHistory();
      setShowClearDialog(false);
      toast.success("All data cleared");
    } catch (error) {
      toast.error("Failed to clear data");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <ScrollArea className="h-full">
      <div
        data-design-id="settings-screen"
        className="pb-24 px-5 pt-4 space-y-6"
      >
        <motion.div
          data-design-id="settings-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            data-design-id="settings-title"
            className="text-2xl font-bold flex items-center gap-2"
          >
            <Settings className="w-6 h-6" />
            Settings
          </h1>
          <p
            data-design-id="settings-subtitle"
            className="text-muted-foreground"
          >
            Manage your preferences and data
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ConsentManager />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card data-design-id="appearance-card">
            <CardHeader className="pb-3">
              <CardTitle
                data-design-id="appearance-title"
                className="text-base flex items-center gap-2"
              >
                {isDarkMode ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Sun className="w-4 h-4" />
                )}
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p data-design-id="dark-mode-label" className="font-medium">
                    Dark Mode
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme for reduced eye strain
                  </p>
                </div>
                <Switch
                  data-design-id="dark-mode-toggle"
                  checked={isDarkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card data-design-id="data-card">
            <CardHeader className="pb-3">
              <CardTitle
                data-design-id="data-title"
                className="text-base flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                Data Management
              </CardTitle>
              <CardDescription>
                {scanHistory.length} products in history
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                data-design-id="export-btn"
                variant="outline"
                className="w-full justify-between"
                onClick={handleExportData}
              >
                <span className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Button>

              <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
                <DialogTrigger asChild>
                  <Button
                    data-design-id="clear-btn"
                    variant="outline"
                    className="w-full justify-between text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <span className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Clear All Data
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Clear All Data?</DialogTitle>
                    <DialogDescription>
                      This will permanently delete all your scanned products,
                      history, and favorites. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      variant="outline"
                      onClick={() => setShowClearDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleClearData}>
                      Yes, Clear All
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card data-design-id="about-card">
            <CardHeader className="pb-3">
              <CardTitle
                data-design-id="about-title"
                className="text-base flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4" />
                About MTHFR & This App
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-is-mthfr">
                  <AccordionTrigger data-design-id="faq-mthfr">
                    What is MTHFR?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      MTHFR (methylenetetrahydrofolate reductase) is an enzyme
                      that plays a crucial role in processing folate and
                      supporting methylation—a vital biochemical process
                      affecting DNA repair, detoxification, and neurotransmitter
                      production. Genetic variants (like C677T and A1298C) can
                      reduce enzyme efficiency by 30-70%, making it important to
                      avoid synthetic folic acid and other problematic
                      ingredients.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="classification">
                  <AccordionTrigger data-design-id="faq-classification">
                    How are ingredients classified?
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground space-y-3">
                      <p>
                        <strong className="text-foreground">
                          Safe (Green):
                        </strong>{" "}
                        Ingredients that support methylation or have no negative
                        impact. Includes methylated vitamins, whole foods, and
                        natural ingredients.
                      </p>
                      <p>
                        <strong className="text-foreground">
                          Unsafe (Red):
                        </strong>{" "}
                        Ingredients that may interfere with methylation.
                        Includes synthetic folic acid, cyanocobalamin, MSG, and
                        certain preservatives.
                      </p>
                      <p>
                        <strong className="text-foreground">
                          Unknown (Yellow):
                        </strong>{" "}
                        Ingredients without enough research to classify, or
                        ingredients that may affect individuals differently.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="masking">
                  <AccordionTrigger data-design-id="faq-masking">
                    What are masking ingredients?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Masking ingredients are vague terms like "natural
                      flavors," "spices," or "proprietary blend" that can hide
                      undisclosed components. These may contain MSG, synthetic
                      additives, or other problematic ingredients. We flag these
                      for your awareness so you can investigate further or
                      contact the manufacturer for clarification.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="accuracy">
                  <AccordionTrigger data-design-id="faq-accuracy">
                    How accurate is this app?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      This app is a tool for awareness, not medical advice.
                      While we strive for accuracy using product databases and
                      research-backed classifications, ingredient lists can
                      change, regional variations exist, and individual
                      sensitivities vary. Always consult healthcare providers
                      for personalized guidance, especially regarding
                      MTHFR-related dietary changes.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card data-design-id="app-info-card" className="bg-muted/30">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 data-design-id="app-name" className="font-semibold">
                    MTHFR Food Scanner
                  </h3>
                  <p
                    data-design-id="app-version"
                    className="text-sm text-muted-foreground"
                  >
                    Version 1.0.0
                  </p>
                </div>
              </div>
              <p
                data-design-id="app-description"
                className="text-xs text-muted-foreground"
              >
                A local-first PWA for MTHFR-conscious individuals to evaluate
                food product safety. All data is stored locally on your device.
                No account required.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ScrollArea>
  );
}
