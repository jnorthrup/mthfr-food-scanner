"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  BrowserMultiFormatReader,
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";

export interface ScannerState {
  isScanning: boolean;
  error: string | null;
  lastScannedCode: string | null;
  hasPermission: boolean | null;
}

export interface UseScannerOptions {
  onScan?: (code: string) => void;
  onError?: (error: string) => void;
  formats?: BarcodeFormat[];
}

export function useScanner(options: UseScannerOptions = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [state, setState] = useState<ScannerState>({
    isScanning: false,
    error: null,
    lastScannedCode: null,
    hasPermission: null,
  });

  const startScanning = useCallback(async () => {
    if (!videoRef.current) {
      setState((s) => ({ ...s, error: "Video element not available" }));
      return;
    }

    try {
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.EAN_13,
        BarcodeFormat.CODE_128,
        ...(options.formats || []),
      ]);
      // Try harder helps with blurry barcodes, but we also assume GS1 for retail products
      hints.set(DecodeHintType.TRY_HARDER, true);
      hints.set(DecodeHintType.ASSUME_GS1, true);

      // Initialize with a faster scan interval (300ms instead of 500ms default)
      const reader = new BrowserMultiFormatReader(hints, 300);
      readerRef.current = reader;

      let initialStream: MediaStream | null = null;
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error(
            "Camera implementation not found. Are you in a secure context (HTTPS/localhost)?",
          );
        }

        // Request a higher resolution stream and prevent cropping/zooming.
        // Also request continuous autofocus, which is critical for macro/barcode scanning on phones.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const constraints: any = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
            aspectRatio: { ideal: 16 / 9 },
            advanced: [{ focusMode: "continuous" }]
          }
        };
        initialStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        if (err instanceof Error) {
          if (
            err.name === "NotAllowedError" ||
            err.message.includes("Permission denied")
          ) {
            throw new Error("Camera permission denied");
          }
        }
        throw new Error(
          "Failed to verify camera support or permission was denied",
        );
      }

      setState((s) => ({
        ...s,
        isScanning: true,
        error: null,
        hasPermission: true,
      }));

      if (!initialStream) {
        throw new Error("Failed to acquire camera stream");
      }

      // Use the manually acquired stream directly
      await reader.decodeFromStream(
        initialStream,
        videoRef.current,
        (result, error) => {
          if (result) {
            const code = result.getText();
            setState((s) => ({ ...s, lastScannedCode: code }));
            options.onScan?.(code);
          }
          if (error && error.name !== "NotFoundException") {
            console.error("Scan error:", error);
          }
        },
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to start scanner";

      if (
        errorMessage.includes("Permission denied") ||
        errorMessage.includes("NotAllowedError")
      ) {
        setState((s) => ({
          ...s,
          hasPermission: false,
          error: "Camera permission denied",
        }));
      } else {
        setState((s) => ({ ...s, error: errorMessage }));
      }

      options.onError?.(errorMessage);
    }
  }, [options]);

  const stopScanning = useCallback(() => {
    if (readerRef.current) {
      readerRef.current.reset();
      readerRef.current = null;
    }
    setState((s) => ({ ...s, isScanning: false }));
  }, []);

  const resetLastCode = useCallback(() => {
    setState((s) => ({ ...s, lastScannedCode: null }));
  }, []);

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  return {
    videoRef,
    ...state,
    startScanning,
    stopScanning,
    resetLastCode,
  };
}

export async function checkCameraPermission(): Promise<boolean> {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return false;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
}

export async function getAvailableCameras(): Promise<MediaDeviceInfo[]> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "videoinput");
  } catch {
    return [];
  }
}
