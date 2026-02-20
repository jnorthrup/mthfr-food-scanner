'use client';

import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Flashlight, FlashlightOff, X, Keyboard } from 'lucide-react';
import { useScanner } from '@/hooks/useScanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose?: () => void;
  isActive?: boolean;
}

export function BarcodeScanner({ onScan, onClose, isActive = true }: BarcodeScannerProps) {
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualUPC, setManualUPC] = useState('');
  const [torch, setTorch] = useState(false);

  const handleScan = useCallback((code: string) => {
    onScan(code);
  }, [onScan]);

  const {
    videoRef,
    isScanning,
    error,
    hasPermission,
    lastScannedCode,
    startScanning,
    stopScanning,
    resetLastCode,
  } = useScanner({
    onScan: handleScan,
  });

  useEffect(() => {
    if (isActive && !showManualEntry) {
      startScanning();
    } else {
      stopScanning();
    }
    
    return () => {
      stopScanning();
    };
  }, [isActive, showManualEntry, startScanning, stopScanning]);

  useEffect(() => {
    if (lastScannedCode) {
      const timer = setTimeout(() => {
        resetLastCode();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastScannedCode, resetLastCode]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUPC.trim()) {
      onScan(manualUPC.trim());
      setManualUPC('');
      setShowManualEntry(false);
    }
  };

  return (
    <div data-design-id="barcode-scanner" className="relative w-full h-full flex flex-col">
      <div data-design-id="scanner-header" className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center">
        {onClose && (
          <Button
            data-design-id="scanner-close-btn"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="glass bg-black/30 text-white hover:bg-black/50"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
        
        <div className="flex gap-2">
          <Button
            data-design-id="scanner-keyboard-btn"
            variant="ghost"
            size="icon"
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="glass bg-black/30 text-white hover:bg-black/50"
          >
            <Keyboard className="w-5 h-5" />
          </Button>
          
          <Button
            data-design-id="scanner-torch-btn"
            variant="ghost"
            size="icon"
            onClick={() => setTorch(!torch)}
            className="glass bg-black/30 text-white hover:bg-black/50"
            disabled={!isScanning}
          >
            {torch ? <Flashlight className="w-5 h-5" /> : <FlashlightOff className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {showManualEntry ? (
          <motion.div
            key="manual-entry"
            data-design-id="manual-entry-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-background"
          >
            <div data-design-id="manual-entry-icon" className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Keyboard className="w-10 h-10 text-primary" />
            </div>
            
            <h2 data-design-id="manual-entry-title" className="text-xl font-semibold mb-2">Enter UPC Manually</h2>
            <p data-design-id="manual-entry-description" className="text-muted-foreground text-center mb-6">
              Type the barcode number found on the product packaging
            </p>
            
            <form onSubmit={handleManualSubmit} className="w-full max-w-sm space-y-4">
              <Input
                data-design-id="manual-entry-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter UPC (e.g., 012345678905)"
                value={manualUPC}
                onChange={(e) => setManualUPC(e.target.value.replace(/[^0-9]/g, ''))}
                className="text-center text-lg h-12 tracking-widest"
                autoFocus
              />
              
              <Button
                data-design-id="manual-entry-submit"
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={!manualUPC.trim() || manualUPC.length < 8}
              >
                Look Up Product
              </Button>
              
              <Button
                data-design-id="manual-entry-cancel"
                type="button"
                variant="ghost"
                onClick={() => setShowManualEntry(false)}
                className="w-full"
              >
                Back to Scanner
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="scanner"
            data-design-id="scanner-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex-1 bg-black overflow-hidden"
          >
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
            />

            <div data-design-id="scanner-overlay" className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-72 h-44">
                <div className="absolute inset-0 border-2 border-white/30 rounded-xl" />
                
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />

                {isScanning && (
                  <motion.div
                    data-design-id="scan-line"
                    className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                    animate={{
                      top: ["10%", "90%", "10%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </div>
            </div>

            <div data-design-id="scanner-status" className="absolute bottom-8 left-0 right-0 px-6">
              <div className="glass bg-black/50 rounded-2xl p-4 text-center">
                {error ? (
                  <div data-design-id="scanner-error" className="text-red-400">
                    <CameraOff className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm">{error}</p>
                    <Button
                      onClick={startScanning}
                      variant="outline"
                      size="sm"
                      className="mt-3 border-white/20 text-white hover:bg-white/10"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : hasPermission === false ? (
                  <div data-design-id="scanner-permission" className="text-yellow-400">
                    <CameraOff className="w-6 h-6 mx-auto mb-2" />
                    <p className="text-sm">Camera access is required to scan barcodes</p>
                    <p className="text-xs text-white/60 mt-1">Please enable camera in your browser settings</p>
                  </div>
                ) : isScanning ? (
                  <div data-design-id="scanner-active" className="text-white">
                    <Camera className="w-6 h-6 mx-auto mb-2 animate-pulse" />
                    <p className="text-sm font-medium">Point camera at barcode</p>
                    <p className="text-xs text-white/60 mt-1">Position barcode within the frame</p>
                  </div>
                ) : (
                  <div data-design-id="scanner-starting" className="text-white/60">
                    <div className="w-6 h-6 mx-auto mb-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <p className="text-sm">Starting camera...</p>
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence>
              {lastScannedCode && (
                <motion.div
                  data-design-id="scan-success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl"
                >
                  <p className="font-mono font-semibold">{lastScannedCode}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}