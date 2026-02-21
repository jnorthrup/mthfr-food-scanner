"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, PackageSearch, AlertCircle, ScanLine } from "lucide-react";
import { useAppStore } from "@/lib/store";
import {
  processProductByUPC,
  processProductFromData,
} from "@/lib/services/product-service";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { ProductCard } from "@/components/product/ProductCard";
import { IngredientList } from "@/components/product/IngredientList";
import { ManualEntryForm } from "@/components/product/ManualEntryForm";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Product, ProductSafetySummary } from "@/types";

type ScanMode = "idle" | "loading" | "result" | "not-found" | "manual-entry";

export function ScanScreen() {
  const [mode, setMode] = useState<ScanMode>("idle");
  const [isScannerOpen, setIsScannerOpen] = useState(true);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [safety, setSafety] = useState<ProductSafetySummary | null>(null);
  const [lastScannedUPC, setLastScannedUPC] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { addToHistory, setActiveTab, setCurrentProduct, toggleFavorite } =
    useAppStore();

  const handleScan = useCallback(
    async (code: string) => {
      // Prevent rapid double scans from re-triggering while loading
      if (isProcessing || (code === lastScannedUPC && isScannerOpen)) return;

      setIsProcessing(true);
      setLastScannedUPC(code);
      setMode("loading");
      setIsScannerOpen(false); // Instantly dismiss overlay so loading shows in full screen

      try {
        const result = await processProductByUPC(code);

        if (result.success && result.product) {
          setScannedProduct(result.product);
          setSafety(result.safety);
          addToHistory(result.product);
          setMode("result");

          if (result.safety?.overallStatus === "safe") {
            toast.success("Product is MTHFR Safe!");
          } else if (result.safety?.overallStatus === "unsafe") {
            toast.warning(
              `Found ${result.safety.unsafeCount} unsafe ingredient(s)`,
            );
          } else {
            toast.info("Some ingredients require review");
          }
        } else if (result.notFound) {
          setMode("not-found");
        } else {
          throw new Error(result.error || "Failed to process product");
        }
      } catch (error) {
        console.error("Scan error:", error);
        toast.error("Failed to look up product");
        // Optionally reopen scanner on crash
        setIsScannerOpen(true);
        setMode("idle");
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, lastScannedUPC, addToHistory, isScannerOpen],
  );

  const handleManualSubmit = async (data: {
    upc: string;
    name: string;
    brand?: string;
    ingredients: string;
  }) => {
    setIsProcessing(true);

    try {
      const result = await processProductFromData(
        data.upc,
        data.name,
        data.ingredients,
        data.brand,
        undefined,
        "manual",
      );

      if (result.success && result.product) {
        setScannedProduct(result.product);
        setSafety(result.safety);
        addToHistory(result.product);
        setMode("result");
        toast.success("Product added successfully!");
      } else {
        throw new Error(result.error || "Failed to add product");
      }
    } catch (error) {
      console.error("Manual entry error:", error);
      toast.error("Failed to add product");
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScanner = () => {
    setMode("idle");
    setScannedProduct(null);
    setSafety(null);
    setLastScannedUPC("");
    setIsScannerOpen(true);
  };

  const viewProductDetails = () => {
    if (scannedProduct) {
      setCurrentProduct(scannedProduct);
      setActiveTab("history");
    }
  };

  return (
    <div
      data-design-id="scan-screen"
      className="h-full flex flex-col bg-background relative"
    >
      {/* Scanner Modal Overlay */}
      <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
        <DialogContent
          className="p-0 border-none bg-black h-dvh w-screen max-w-none m-0 sm:rounded-none overflow-hidden [&>button]:hidden"
        >
          <DialogTitle className="sr-only">Barcode Scanner</DialogTitle>
          <BarcodeScanner
            onScan={handleScan}
            isActive={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Main Base Layout (Scrolls Naturally!) */}
      <AnimatePresence mode="wait">
        {mode === "idle" && !isScannerOpen && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center p-6"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <ScanLine className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Scanner Paused</h2>
            <p className="text-muted-foreground mb-8">
              Tap below to reopen the camera and resume scanning products.
            </p>
            <Button size="lg" onClick={() => setIsScannerOpen(true)} className="gap-2">
              <ScanLine className="w-5 h-5" /> Open Scanner
            </Button>
          </motion.div>
        )}

        {mode === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Looking up product...</h2>
            <p className="text-muted-foreground text-center">
              Searching product databases and analyzing ingredients
            </p>
            <p className="font-mono text-sm mt-4 text-muted-foreground">
              UPC: {lastScannedUPC}
            </p>
          </motion.div>
        )}

        {mode === "result" && scannedProduct && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            <div className="p-4 flex items-center gap-3 border-b bg-background/80 backdrop-blur z-10 sticky top-0">
              <Button variant="ghost" size="icon" onClick={() => setIsScannerOpen(true)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="font-semibold flex-1 truncate">Scan Result</h2>
              <Button variant="outline" size="sm" onClick={() => setIsScannerOpen(true)} className="gap-2">
                <ScanLine className="w-4 h-4" /> Scan Another
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-5 space-y-6 pb-24">
                <ProductCard
                  product={scannedProduct}
                  onToggleFavorite={() => {
                    if (scannedProduct.id) {
                      toggleFavorite(scannedProduct.id);
                    }
                  }}
                />
                <IngredientList
                  ingredients={scannedProduct.ingredients}
                  showProvenance
                />
              </div>
            </ScrollArea>
          </motion.div>
        )}

        {mode === "not-found" && (
          <motion.div
            key="not-found"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            <div className="p-4 flex items-center gap-3 border-b bg-background/80 backdrop-blur z-10 sticky top-0">
              <Button variant="ghost" size="icon" onClick={() => setIsScannerOpen(true)}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="font-semibold flex-1">Not Found</h2>
            </div>

            <ScrollArea className="flex-1">
              <div className="flex-1 flex flex-col items-center justify-center p-8 pb-24 min-h-[60vh]">
                <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center mb-6">
                  <PackageSearch className="w-12 h-12 text-amber-600 dark:text-amber-400" />
                </div>

                <h2 className="text-xl font-semibold mb-2">Product Not in Database</h2>
                <p className="text-muted-foreground text-center mb-2">
                  We couldn't find this product in our databases.
                </p>
                <p className="font-mono text-sm text-muted-foreground mb-6">
                  UPC: {lastScannedUPC}
                </p>

                <Alert className="mb-6 max-w-sm">
                  <AlertCircle className="w-4 h-4" />
                  <AlertTitle>Help improve the database</AlertTitle>
                  <AlertDescription>
                    You can add this product manually by entering its name and
                    ingredient list.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col gap-3 w-full max-w-sm">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/search?q=UPC+${lastScannedUPC}`,
                        "_blank",
                      )
                    }
                    className="w-full"
                  >
                    Search Web for UPC
                  </Button>
                  <div className="flex gap-3 w-full">
                    <Button variant="outline" onClick={() => setIsScannerOpen(true)} className="flex-1">
                      Scan Again
                    </Button>
                    <Button onClick={() => setMode("manual-entry")} className="flex-1">
                      Add Manually
                    </Button>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}

        {mode === "manual-entry" && (
          <motion.div
            key="manual-entry"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col h-full overflow-hidden"
          >
            <div className="p-4 flex items-center gap-3 border-b bg-background/80 backdrop-blur z-10 sticky top-0">
              <Button variant="ghost" size="icon" onClick={() => setMode("not-found")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="font-semibold">Manual Entry</h2>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-5 pb-24">
                <ManualEntryForm
                  initialUPC={lastScannedUPC}
                  onSubmit={handleManualSubmit}
                  onCancel={() => setMode("not-found")}
                  isLoading={isProcessing}
                />
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
