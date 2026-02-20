'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, PackageSearch, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { processProductByUPC, processProductFromData } from '@/lib/services/product-service';
import { BarcodeScanner } from '@/components/scanner/BarcodeScanner';
import { ProductCard } from '@/components/product/ProductCard';
import { IngredientList } from '@/components/product/IngredientList';
import { ManualEntryForm } from '@/components/product/ManualEntryForm';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import type { Product, ProductSafetySummary } from '@/types';

type ScanMode = 'scanner' | 'loading' | 'result' | 'not-found' | 'manual-entry';

export function ScanScreen() {
  const [mode, setMode] = useState<ScanMode>('scanner');
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [safety, setSafety] = useState<ProductSafetySummary | null>(null);
  const [lastScannedUPC, setLastScannedUPC] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { addToHistory, setActiveTab, setCurrentProduct, toggleFavorite } = useAppStore();

  const handleScan = useCallback(async (code: string) => {
    if (isProcessing || code === lastScannedUPC) return;
    
    setIsProcessing(true);
    setLastScannedUPC(code);
    setMode('loading');
    
    try {
      const result = await processProductByUPC(code);
      
      if (result.success && result.product) {
        setScannedProduct(result.product);
        setSafety(result.safety);
        addToHistory(result.product);
        setMode('result');
        
        if (result.safety?.overallStatus === 'safe') {
          toast.success('Product is MTHFR Safe!');
        } else if (result.safety?.overallStatus === 'unsafe') {
          toast.warning(`Found ${result.safety.unsafeCount} unsafe ingredient(s)`);
        } else {
          toast.info('Some ingredients require review');
        }
      } else if (result.notFound) {
        setMode('not-found');
      } else {
        throw new Error(result.error || 'Failed to process product');
      }
    } catch (error) {
      console.error('Scan error:', error);
      toast.error('Failed to look up product');
      setMode('scanner');
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, lastScannedUPC, addToHistory]);

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
        'manual'
      );
      
      if (result.success && result.product) {
        setScannedProduct(result.product);
        setSafety(result.safety);
        addToHistory(result.product);
        setMode('result');
        toast.success('Product added successfully!');
      } else {
        throw new Error(result.error || 'Failed to add product');
      }
    } catch (error) {
      console.error('Manual entry error:', error);
      toast.error('Failed to add product');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScanner = () => {
    setMode('scanner');
    setScannedProduct(null);
    setSafety(null);
    setLastScannedUPC('');
  };

  const viewProductDetails = () => {
    if (scannedProduct) {
      setCurrentProduct(scannedProduct);
      setActiveTab('history');
    }
  };

  return (
    <div data-design-id="scan-screen" className="h-full flex flex-col bg-background">
      <AnimatePresence mode="wait">
        {mode === 'scanner' && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1"
          >
            <BarcodeScanner
              onScan={handleScan}
              isActive={mode === 'scanner'}
            />
          </motion.div>
        )}

        {mode === 'loading' && (
          <motion.div
            key="loading"
            data-design-id="scan-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-8"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h2 data-design-id="loading-title" className="text-xl font-semibold mb-2">Looking up product...</h2>
            <p data-design-id="loading-subtitle" className="text-muted-foreground text-center">
              Searching product databases and analyzing ingredients
            </p>
            <p data-design-id="loading-upc" className="font-mono text-sm mt-4 text-muted-foreground">
              UPC: {lastScannedUPC}
            </p>
          </motion.div>
        )}

        {mode === 'result' && scannedProduct && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <div data-design-id="result-header" className="p-4 flex items-center gap-3 border-b">
              <Button
                data-design-id="result-back"
                variant="ghost"
                size="icon"
                onClick={resetScanner}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="font-semibold flex-1">Scan Result</h2>
              <Button
                data-design-id="scan-another"
                variant="outline"
                size="sm"
                onClick={resetScanner}
              >
                Scan Another
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

        {mode === 'not-found' && (
          <motion.div
            key="not-found"
            data-design-id="not-found-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <div data-design-id="not-found-header" className="p-4 flex items-center gap-3 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={resetScanner}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="font-semibold">Product Not Found</h2>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div data-design-id="not-found-icon" className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center mb-6">
                <PackageSearch className="w-12 h-12 text-amber-600 dark:text-amber-400" />
              </div>
              
              <h2 data-design-id="not-found-title" className="text-xl font-semibold mb-2">Product Not in Database</h2>
              <p data-design-id="not-found-desc" className="text-muted-foreground text-center mb-2">
                We couldn't find this product in our databases.
              </p>
              <p data-design-id="not-found-upc" className="font-mono text-sm text-muted-foreground mb-6">
                UPC: {lastScannedUPC}
              </p>
              
              <Alert data-design-id="not-found-alert" className="mb-6 max-w-sm">
                <AlertCircle className="w-4 h-4" />
                <AlertTitle>Help improve the database</AlertTitle>
                <AlertDescription>
                  You can add this product manually by entering its name and ingredient list.
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-3 w-full max-w-sm">
                <Button
                  data-design-id="try-again-btn"
                  variant="outline"
                  onClick={resetScanner}
                  className="flex-1"
                >
                  Scan Again
                </Button>
                <Button
                  data-design-id="add-manually-btn"
                  onClick={() => setMode('manual-entry')}
                  className="flex-1"
                >
                  Add Manually
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {mode === 'manual-entry' && (
          <motion.div
            key="manual-entry"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col"
          >
            <div data-design-id="manual-header" className="p-4 flex items-center gap-3 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={resetScanner}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="font-semibold">Manual Entry</h2>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-5 pb-24">
                <ManualEntryForm
                  initialUPC={lastScannedUPC}
                  onSubmit={handleManualSubmit}
                  onCancel={resetScanner}
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