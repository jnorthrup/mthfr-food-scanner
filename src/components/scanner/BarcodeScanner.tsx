"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose?: () => void;
  isActive?: boolean;
}

export function BarcodeScanner({
  onScan,
  onClose,
  isActive = true,
}: BarcodeScannerProps) {
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualUPC, setManualUPC] = useState("");

  useEffect(() => {
    // We only mount the scanner if active and not showing manual entry.
    // html5-qrcode takes full control of the DOM node so we let it do its thing.
    if (!isActive || showManualEntry) return;

    let scanner: Html5QrcodeScanner | null = null;

    // Slight timeout ensures the DOM node exists before mounting
    const timeout = setTimeout(() => {
      const formatsToSupport = [
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
      ];

      scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 300, height: 150 },
          aspectRatio: 16 / 9,
          // Explictly optimize engine for UPC and EAN barcodes
          formatsToSupport: formatsToSupport
        },
        /* verbose= */ false,
      );

      scanner.render(
        (decodedText) => {
          // Success callback
          onScan(decodedText);
        },
        (errorMessage) => {
          // Failure callback is noisy, we typically ignore it for sweeps
          // console.log("Scan fail:", errorMessage);
        },
      );
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (scanner) {
        // Safe cleanup
        scanner
          .clear()
          .catch((err) => console.error("Failed to clear scanner", err));
      }
    };
  }, [isActive, showManualEntry, onScan]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUPC.trim()) {
      onScan(manualUPC.trim());
      setManualUPC("");
      setShowManualEntry(false);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-background">
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="glass bg-black/30 text-white hover:bg-black/50"
          >
            <X className="w-5 h-5" />
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowManualEntry(!showManualEntry)}
          className="glass bg-black/30 text-white hover:bg-black/50 ml-auto"
        >
          <Keyboard className="w-5 h-5" />
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {showManualEntry ? (
          <motion.div
            key="manual-entry"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-background pt-20"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Keyboard className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-xl font-semibold mb-2">Enter UPC Manually</h2>
            <p className="text-muted-foreground text-center mb-6">
              Type the barcode number found on the product packaging
            </p>

            <form
              onSubmit={handleManualSubmit}
              className="w-full max-w-sm space-y-4"
            >
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter UPC (e.g., 012345678905)"
                value={manualUPC}
                onChange={(e) =>
                  setManualUPC(e.target.value.replace(/[^0-9]/g, ""))
                }
                className="text-center text-lg h-12 tracking-widest"
                autoFocus
              />

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={!manualUPC.trim() || manualUPC.length < 8}
              >
                Look Up Product
              </Button>

              <Button
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex-1 bg-black flex items-center justify-center w-full"
          >
            {/* The html5-qrcode library completely takes over this div */}
            <div id="qr-reader" className="w-full max-w-lg shadow-xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
