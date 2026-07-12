"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose?: () => void;
  isActive?: boolean;
}

const SUPPORTED_FORMATS = [
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
];

export function BarcodeScanner({
  onScan,
  onClose,
  isActive = true,
}: BarcodeScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);

  // Update the ref whenever the onScan callback changes to avoid restarting the scanner
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!isActive) return;

    let isMounted = true;
    const elementId = "qr-reader";

    // Initialize scanner
    const startScanner = async () => {
      try {
        // Ensure the DOM element is ready and has dimensions (important for Dialog animations)
        let element = document.getElementById(elementId);
        let attempts = 0;

        while ((!element || element.clientWidth === 0) && attempts < 10) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          element = document.getElementById(elementId);
          attempts++;
        }

        if (!element || !isMounted) return;

        // Create new instance
        const html5QrCode = new Html5Qrcode(elementId);
        scannerRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 300, height: 150 },
          aspectRatio: 16 / 9,
          // Explictly optimize engine for UPC and EAN barcodes
          formatsToSupport: SUPPORTED_FORMATS,
        };

        // Ensure camera is fully ready before scanning
        // html5QrCode.start returns a promise that resolves once the camera is ready and video is playing
        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            onScanRef.current(decodedText);
          },
          () => {
            // onScanFailure - noisy, we typically ignore it for sweeps
          }
        );

        // If the component unmounted while start() was pending, stop the scanner immediately
        if (!isMounted) {
          html5QrCode.stop().catch((err) => console.error("Failed to stop scanner after unmount", err));
        }
      } catch (err) {
        // Only log error if we're still mounted
        if (isMounted) {
          console.error("Failed to start scanner", err);
        }
      }
    };

    startScanner();

    return () => {
      isMounted = false;
      if (scannerRef.current) {
        const scanner = scannerRef.current;
        scannerRef.current = null;
        if (scanner.isScanning) {
          scanner.stop().catch((err) => console.error("Failed to stop scanner", err));
        }
      }
    };
  }, [isActive]);

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
