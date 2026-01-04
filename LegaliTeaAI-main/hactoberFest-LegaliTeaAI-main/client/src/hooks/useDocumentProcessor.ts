import { useState, useCallback } from "react";
import { DocumentProcessor } from "../services/documentProcessor";
import { useAppStore } from "../stores/appStore";

interface ProcessingProgress {
  stage: "validating" | "extracting" | "ocr" | "complete";
  progress: number;
  message: string;
}

export const useDocumentProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const {
    setExtractedText,
    setError,
    setProgress,
    setProcessingStage,
    setShowPreview,
    setPreviewText,
    setPreviewFileName
  } = useAppStore();

  const processFile = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setError(null);
      setProgress(0);
      setProcessingStage("extract");

      const processor = new DocumentProcessor(
        (progress: ProcessingProgress) => {
          setProgress(progress.progress);

          // Map processing stages to app stages
          switch (progress.stage) {
            case "validating":
            case "extracting":
              setProcessingStage("extract");
              break;
            case "ocr":
              setProcessingStage("extract");
              break;
            case "complete":
              setProcessingStage("analyze");
              break;
          }
        }
      );

      try {
        const extractedText = await processor.processDocument(file);
        setExtractedText(extractedText);
        setPreviewText(extractedText);
        setPreviewFileName(file.name);
        setShowPreview(true);
        setProgress(100);
        setProcessingStage("preview");
        return extractedText;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to process document";
        setError(errorMessage);
        setProcessingStage("upload");
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [setExtractedText, setError, setProgress, setProcessingStage]
  );

  const processText = useCallback(
    (text: string) => {
      const result = DocumentProcessor.processText(text);

      if (!result.valid) {
        setError(result.error || "Invalid text");
        return false;
      }

      setExtractedText(result.text || "");
      setError(null);
      return true;
    },
    [setExtractedText, setError]
  );

  const validateFile = useCallback((file: File) => {
    const processor = new DocumentProcessor();
    return processor.validateDocument(file);
  }, []);

  return {
    processFile,
    processText,
    validateFile,
    isProcessing,
  };
};
