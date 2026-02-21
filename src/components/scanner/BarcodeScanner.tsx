"use client";

import { useEffect } from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="relative w-full h-full flex flex-col bg-black">
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center pointer-events-none">
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="glass bg-black/50 text-white hover:bg-black/70 pointer-events-auto"
          >
            <X className="w-6 h-6" />
          </Button>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center w-full relative">
        {/* The html5-qrcode library completely takes over this div */}
        <div id="qr-reader" className="w-[100vw] h-[100dvh] object-cover" />
      </div>
    </div>
  );
}
