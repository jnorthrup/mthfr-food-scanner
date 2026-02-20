import type { OCRResult } from '@/types';

let tesseractWorker: Tesseract.Worker | null = null;
let isInitializing = false;

export async function initializeOCR(): Promise<void> {
  if (tesseractWorker || isInitializing) return;
  
  isInitializing = true;
  
  try {
    const Tesseract = await import('tesseract.js');
    tesseractWorker = await Tesseract.createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });
  } catch (error) {
    console.error('Failed to initialize OCR:', error);
  } finally {
    isInitializing = false;
  }
}

export async function performOCR(imageSource: File | Blob | string): Promise<OCRResult> {
  if (!tesseractWorker) {
    await initializeOCR();
  }
  
  if (!tesseractWorker) {
    throw new Error('OCR engine not available');
  }
  
  try {
    const result = await tesseractWorker.recognize(imageSource);
    const text = result.data.text;
    const confidence = result.data.confidence;
    
    const ingredients = extractIngredientsFromOCR(text);
    
    return {
      text,
      confidence,
      ingredients,
    };
  } catch (error) {
    console.error('OCR failed:', error);
    throw new Error('Failed to extract text from image');
  }
}

function extractIngredientsFromOCR(text: string): string[] {
  const ingredientPatterns = [
    /ingredients?[:\s]*(.+?)(?:\.|nutrition|allergen|contains|manufactured|distributed|$)/is,
    /contains?[:\s]*(.+?)(?:\.|nutrition|allergen|manufactured|distributed|$)/is,
  ];
  
  for (const pattern of ingredientPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const ingredientText = match[1].trim();
      return parseOCRIngredients(ingredientText);
    }
  }
  
  return parseOCRIngredients(text);
}

function parseOCRIngredients(text: string): string[] {
  let cleaned = text
    .replace(/[\n\r]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  cleaned = cleaned
    .replace(/[|]/g, 'l')
    .replace(/[0O]/g, (m, offset, str) => {
      const prev = str[offset - 1];
      const next = str[offset + 1];
      if (prev && /[a-zA-Z]/.test(prev)) return 'o';
      if (next && /[a-zA-Z]/.test(next)) return 'o';
      return m;
    });
  
  const ingredients = cleaned
    .split(/,(?![^()]*\))/)
    .map(s => s.trim())
    .filter(s => s.length > 2);
  
  return ingredients;
}

export async function terminateOCR(): Promise<void> {
  if (tesseractWorker) {
    await tesseractWorker.terminate();
    tesseractWorker = null;
  }
}

export function isOCRAvailable(): boolean {
  return typeof window !== 'undefined';
}

export interface OCRProgress {
  status: string;
  progress: number;
}

export async function performOCRWithProgress(
  imageSource: File | Blob | string,
  onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
  if (!tesseractWorker) {
    onProgress?.({ status: 'Initializing OCR engine...', progress: 0 });
    await initializeOCR();
  }
  
  if (!tesseractWorker) {
    throw new Error('OCR engine not available');
  }
  
  try {
    const Tesseract = await import('tesseract.js');
    const worker = await Tesseract.createWorker('eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          onProgress?.({ status: 'Recognizing text...', progress: m.progress * 100 });
        } else if (m.status === 'loading language traineddata') {
          onProgress?.({ status: 'Loading language data...', progress: m.progress * 100 });
        }
      },
    });
    
    const result = await worker.recognize(imageSource);
    await worker.terminate();
    
    const text = result.data.text;
    const confidence = result.data.confidence;
    const ingredients = extractIngredientsFromOCR(text);
    
    onProgress?.({ status: 'Complete', progress: 100 });
    
    return {
      text,
      confidence,
      ingredients,
    };
  } catch (error) {
    console.error('OCR failed:', error);
    throw new Error('Failed to extract text from image');
  }
}