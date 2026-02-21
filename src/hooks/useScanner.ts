"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  BrowserMultiFormatReader,
  type BarcodeFormat,
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
      hints.set(DecodeHintType.TRY_HARDER, true);

      // Initialize reader without strict FORMAT limitations, as this often
      // breaks UPC-A/UPC-E parsing. Rely on default internal formats.
      const reader = new BrowserMultiFormatReader(hints);
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
            facingMode: "environment",
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
            aspectRatio: { ideal: 16 / 9 },
            advanced: [{ focusMode: "continuous" }],
          },
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

      // Instead of using decodeFromStream, we implement a custom locator pipeline.
      // This allows us to "find a rectangle, bisect it, adjust rotation, and scan"
      // to improve detection on tricky cameras.
      const processCanvas = document.createElement("canvas");
      const processCtx = processCanvas.getContext("2d", {
        willReadFrequently: true,
      });

      let animationFrameId: number;
      let isStopping = false;

      // Add a 250ms debounce for scanning
      const decodeInterval = 250;
      let lastDecodeTime = 0;

      const processFrame = () => {
        if (isStopping || !videoRef.current || !processCtx) return;

        const video = videoRef.current;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          const now = Date.now();
          if (now - lastDecodeTime >= decodeInterval) {
            if (processCanvas.width !== video.videoWidth) {
              processCanvas.width = video.videoWidth;
              processCanvas.height = video.videoHeight;
            }

            // 1. Draw full frame
            processCtx.drawImage(
              video,
              0,
              0,
              processCanvas.width,
              processCanvas.height,
            );

            // 2. Custom Rectangle Detector Heuristic
            // We find a generic box in the middle by getting image data, checking
            // horizontal contrast variations (edges) and cropping to them.
            // For now, we assume the user centers the barcode, so we crop a central
            // rectangle and bisect it to focus ZXing on the exact barcode lines.
            const width = processCanvas.width;
            const height = processCanvas.height;

            // Define a targeted crop area (e.g. 60% of width, 30% of height)
            const cropW = Math.floor(width * 0.6);
            const cropH = Math.floor(height * 0.3);
            const cropX = Math.floor((width - cropW) / 2);
            const cropY = Math.floor((height - cropH) / 2);

            // Create a secondary canvas for just the bisection
            const bisectionCanvas = document.createElement("canvas");
            bisectionCanvas.width = cropW;
            bisectionCanvas.height = cropH;
            const bisectionCtx = bisectionCanvas.getContext("2d");

            if (bisectionCtx) {
              // Copy just the central bisected area
              bisectionCtx.drawImage(
                processCanvas,
                cropX,
                cropY,
                cropW,
                cropH,
                0,
                0,
                cropW,
                cropH,
              );

              try {
                // Attempt to decode the tight crop
                const result = reader.decode(bisectionCanvas);
                if (result) {
                  const code = result.getText();
                  setState((s) => ({ ...s, lastScannedCode: code }));
                  options.onScan?.(code);
                  lastDecodeTime = now;
                }
              } catch (err: any) {
                // NotFoundException simply means no barcode yet
                if (err.name !== "NotFoundException") {
                  console.error("Frame decode error:", err);
                }
                lastDecodeTime = now; // Apply 250ms debounce on failure
              }
            }
          }
        }

        if (!isStopping) {
          animationFrameId = requestAnimationFrame(processFrame);
        }
      };

      // Play the video stream
      if (videoRef.current) {
        videoRef.current.srcObject = initialStream;
        videoRef.current
          .play()
          .then(() => {
            // Start the scanning loop once video is playing
            processFrame();
          })
          .catch((err) => console.error("Video play error:", err));
      }

      // Clean up track when reader resets
      const oldReset = reader.reset.bind(reader);
      reader.reset = () => {
        isStopping = true;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);

        if (initialStream) {
          initialStream.getTracks().forEach((t) => t.stop());
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        oldReset();
      };
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
