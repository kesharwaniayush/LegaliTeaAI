import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AIAnalyzer } from "../services/aiAnalyzer";
import { useAppStore } from "../stores/appStore";
import { useLanguage } from "../constants/languages";
import { audioFeedback } from "../services/audioFeedback";
import type { AnalysisResult } from "../types";

export const useAnalysis = () => {
  const queryClient = useQueryClient();
  const { setAnalysisResult, setError, setProcessingStage } = useAppStore();
  const { currentLanguage } = useLanguage();

  const analyzer = new AIAnalyzer(import.meta.env.VITE_API_BASE_URL);

  const analysisMutation = useMutation({
    mutationFn: async ({
      text,
      documentType,
    }: {
      text: string;
      documentType?: string;
    }) => {
      setProcessingStage("analyze");
      setError(null);

      // Always use real API now with current language
      return analyzer.analyzeWithRetry(
        text,
        documentType,
        currentLanguage.code
      );
    },
    onSuccess: (result: AnalysisResult) => {
      setAnalysisResult(result);
      setProcessingStage("complete");

      // Play completion sound
      audioFeedback.completion();

      // Cache the result
      queryClient.setQueryData(["analysis", result.originalText], result);
    },
    onError: (error: Error) => {
      setError(error.message);
      setProcessingStage("upload");

      // Play error sound
      audioFeedback.error();
    },
  });

  const analyzeDocument = (text: string, documentType?: string) => {
    return analysisMutation.mutate({ text, documentType });
  };

  return {
    analyzeDocument,
    isAnalyzing: analysisMutation.isPending,
    error: analysisMutation.error,
    reset: analysisMutation.reset,
  };
};

// Hook for saving analysis results
export const useSaveAnalysis = () => {
  const saveMutation = useMutation({
    mutationFn: async ({
      email,
      analysis,
    }: {
      email: string;
      analysis: AnalysisResult;
    }) => {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, analysis }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save analysis");
      }

      return response.json();
    },
    onError: (error: Error) => {
      console.error("Save error:", error);
    },
  });

  return {
    saveAnalysis: saveMutation.mutate,
    isSaving: saveMutation.isPending,
    saveError: saveMutation.error,
    saveSuccess: saveMutation.isSuccess,
  };
};
