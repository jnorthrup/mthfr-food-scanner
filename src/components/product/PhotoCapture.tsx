'use client';

import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, X, Loader2, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';
import { performOCRWithProgress, type OCRProgress } from '@/lib/services/ocr-service';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { OCRResult } from '@/types';

interface PhotoCaptureProps {
  onIngredientsExtracted: (ingredients: string[], rawText: string) => void;
  onCancel?: () => void;
}

type CaptureState = 'idle' | 'capturing' | 'processing' | 'success' | 'error';

export function PhotoCapture({ onIngredientsExtracted, onCancel }: PhotoCaptureProps) {
  const [state, setState] = useState<CaptureState>('idle');
  const [progress, setProgress] = useState<OCRProgress>({ status: '', progress: 0 });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { consents } = useAppStore();

  const hasPhotoConsent = consents.photo?.granted;

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setState('processing');
    setError(null);

    try {
      const result = await performOCRWithProgress(file, setProgress);
      setOcrResult(result);
      setState('success');

      if (result.ingredients.length > 0) {
        onIngredientsExtracted(result.ingredients, result.text);
      }
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Failed to process image');
    }
  }, [onIngredientsExtracted]);

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleReset = () => {
    setState('idle');
    setPreviewUrl(null);
    setOcrResult(null);
    setError(null);
    setProgress({ status: '', progress: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!hasPhotoConsent) {
    return (
      <div data-design-id="photo-no-consent" className="p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-amber-600" />
        </div>
        <h3 data-design-id="no-consent-title" className="font-semibold mb-2">Photo Permission Required</h3>
        <p data-design-id="no-consent-desc" className="text-sm text-muted-foreground mb-4">
          Enable photo upload permission in Settings to use OCR ingredient scanning.
        </p>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Go Back
          </Button>
        )}
      </div>
    );
  }

  return (
    <div data-design-id="photo-capture" className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {state === 'idle' && (
        <motion.div
          data-design-id="capture-idle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Camera className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h3 data-design-id="capture-title" className="font-semibold mb-1">Scan Ingredient Label</h3>
            <p data-design-id="capture-desc" className="text-sm text-muted-foreground">
              Take a photo of the ingredient list on the product label
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleCapture} className="gap-2">
              <Camera className="w-4 h-4" />
              Take Photo
            </Button>
            <Button variant="outline" onClick={handleCapture} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Image
            </Button>
          </div>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} className="w-full">
              Cancel
            </Button>
          )}
        </motion.div>
      )}

      {previewUrl && (
        <motion.div
          data-design-id="capture-preview"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-xl overflow-hidden border"
        >
          <img
            src={previewUrl}
            alt="Captured label"
            className="w-full max-h-64 object-contain bg-muted"
          />
          {state === 'idle' && (
            <Button
              data-design-id="remove-preview"
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </motion.div>
      )}

      {state === 'processing' && (
        <motion.div
          data-design-id="capture-processing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="font-medium">{progress.status || 'Processing...'}</span>
          </div>
          <Progress value={progress.progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Extracting text from image using OCR
          </p>
        </motion.div>
      )}

      {state === 'success' && ocrResult && (
        <motion.div
          data-design-id="capture-success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">
              Found {ocrResult.ingredients.length} potential ingredients
            </span>
          </div>
          
          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-medium mb-2">Extracted ingredients:</p>
            <p className="text-muted-foreground">
              {ocrResult.ingredients.join(', ')}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleReset} variant="outline" className="flex-1 gap-2">
              <RotateCcw className="w-4 h-4" />
              Retake
            </Button>
            <Button 
              onClick={() => onIngredientsExtracted(ocrResult.ingredients, ocrResult.text)}
              className="flex-1"
            >
              Use These Ingredients
            </Button>
          </div>
        </motion.div>
      )}

      {state === 'error' && (
        <motion.div
          data-design-id="capture-error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <div className="flex gap-3">
            <Button onClick={handleReset} variant="outline" className="flex-1 gap-2">
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            {onCancel && (
              <Button onClick={onCancel} variant="ghost" className="flex-1">
                Cancel
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}