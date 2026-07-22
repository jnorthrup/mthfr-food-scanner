import { expect, test, spyOn, describe, beforeEach, afterEach, mock } from "bun:test";

// Mock tesseract.js
mock.module("tesseract.js", () => ({
  default: {
    createWorker: async (lang: string, num: number, options: any) => {
      // If logger is provided, we can simulate its call
      if (options?.logger) {
        options.logger({ status: "recognizing text", progress: 0.5 });
      }
      return {
        recognize: async () => ({ data: { text: "test", confidence: 90 } }),
        terminate: async () => {},
      };
    },
  },
}));

import * as ocrService from "../src/lib/services/ocr-service";

describe("OCR Service Security Fix", () => {
  let consoleLogSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleLogSpy = spyOn(console, "log");
    consoleErrorSpy = spyOn(console, "error");
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    // Reset global state if possible
  });

  test("initializeOCR should not call console.log or console.error", async () => {
    await ocrService.initializeOCR();

    expect(consoleLogSpy).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
