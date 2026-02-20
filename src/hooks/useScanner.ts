'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } from '@zxing/library';

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
      setState(s => ({ ...s, error: 'Video element not available' }));
      return;
    }

    try {
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.CODE_128,
        BarcodeFormat.CODE_39,
        ...(options.formats || []),
      ]);
      hints.set(DecodeHintType.TRY_HARDER, true);

      const reader = new BrowserMultiFormatReader(hints);
      readerRef.current = reader;

      setState(s => ({ ...s, isScanning: true, error: null, hasPermission: true }));

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d): d is MediaDeviceInfo => d.kind === 'videoinput');
      
      const backCamera = videoDevices.find(
        (device: MediaDeviceInfo) =>
          device.label.toLowerCase().includes('back') ||
          device.label.toLowerCase().includes('rear') ||
          device.label.toLowerCase().includes('environment')
      );
      
      const deviceId = backCamera?.deviceId || videoDevices[0]?.deviceId;

      if (!deviceId) {
        throw new Error('No camera found');
      }

      await reader.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            const code = result.getText();
            setState(s => ({ ...s, lastScannedCode: code }));
            options.onScan?.(code);
          }
          if (error && error.name !== 'NotFoundException') {
            console.error('Scan error:', error);
          }
        }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start scanner';
      
      if (errorMessage.includes('Permission denied') || errorMessage.includes('NotAllowedError')) {
        setState(s => ({ ...s, hasPermission: false, error: 'Camera permission denied' }));
      } else {
        setState(s => ({ ...s, error: errorMessage }));
      }
      
      options.onError?.(errorMessage);
    }
  }, [options]);

  const stopScanning = useCallback(() => {
    if (readerRef.current) {
      readerRef.current.reset();
      readerRef.current = null;
    }
    setState(s => ({ ...s, isScanning: false }));
  }, []);

  const resetLastCode = useCallback(() => {
    setState(s => ({ ...s, lastScannedCode: null }));
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
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch {
    return false;
  }
}

export async function getAvailableCameras(): Promise<MediaDeviceInfo[]> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch {
    return [];
  }
}