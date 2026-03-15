"use client";

import { useEffect } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  useEffect(() => {
    // Only mount if active
    if (!isActive) return;

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
          formatsToSupport: formatsToSupport,
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
  }, [isActive, onScan]);

  return (
    <div className="relative w-full h-full flex flex-col bg-black overflow-hidden">
      {/* Scanner Layer */}
      <div className="flex-1 flex items-center justify-center w-full relative">
        <div id="qr-reader" className="w-[100vw] h-[100dvh] object-cover" />
      </div>

      {/* Viewfinder Overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center">
        {/* Darkening veil */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Cutout area mimicking qrbox */}
        <div className="relative w-[300px] h-[150px] bg-transparent">
          {/* Pulsing Corners */}
          {[
            "top-0 left-0 border-t-4 border-l-4",
            "top-0 right-0 border-t-4 border-r-4",
            "bottom-0 left-0 border-b-4 border-l-4",
            "bottom-0 right-0 border-b-4 border-r-4"
          ].map((style, i) => (
            <motion.div
              key={i}
              className={cn("absolute w-8 h-8 border-primary rounded-sm", style)}
              animate={{
                opacity: [0.5, 1, 0.5],
                scale: [0.95, 1.05, 0.95]
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: i * 0.2 }}
            />
          ))}

          {/* Scanning Laser */}
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-primary/80 shadow-[0_0_15px_rgba(var(--primary),0.8)] z-20"
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2.5,
              ease: "linear"
            }}
          />
        </div>

        {/* Status Text */}
        <motion.div
          className="absolute bottom-[25%] flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="px-4 py-2 rounded-full glass bg-black/60 border border-white/20 flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
            <span className="text-white text-sm font-medium tracking-wide">
              Detecting Barcode...
            </span>
          </div>
        </motion.div>
      </div>

      {/* Control Layer */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="glass bg-black/40 text-white hover:bg-black/60 border border-white/10 rounded-full w-12 h-12 pointer-events-auto"
          >
            <X className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
