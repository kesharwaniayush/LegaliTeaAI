import { useAppStore, placeholderAnalysis } from "./appStore";

// Development helpers for testing the app
export const useDevHelpers = () => {
  const store = useAppStore();

  return {
    // Load placeholder data for testing
    loadPlaceholderData: () => {
      store.setExtractedText(placeholderAnalysis.originalText);
      store.setAnalysisResult(placeholderAnalysis);
      store.setProcessingStage("complete");
    },

    // Simulate processing flow
    simulateProcessing: async () => {
      store.setProcessingStage("extract");
      store.setProgress(20);

      await new Promise((resolve) => setTimeout(resolve, 1000));
      store.setProgress(50);

      store.setProcessingStage("analyze");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      store.setProgress(80);

      await new Promise((resolve) => setTimeout(resolve, 500));
      store.setAnalysisResult(placeholderAnalysis);
      store.setProgress(100);
    },

    // Simulate error
    simulateError: (message: string = "Something went wrong") => {
      store.setError(message);
      store.setIsProcessing(false);
      store.setProcessingStage("upload");
    },

    // Reset everything
    resetApp: () => {
      store.reset();
    },

    // Quick file simulation
    simulateFileUpload: (fileName: string = "sample-lease.pdf") => {
      const mockFile = new File(["mock content"], fileName, {
        type: fileName.endsWith(".pdf")
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      store.setUploadedFile(mockFile);
    },
  };
};

// Console helpers for development (only in dev mode)
if (import.meta.env.DEV) {
  (window as any).legaliteaDevHelpers = {
    getState: () => useAppStore.getState(),
    loadPlaceholder: () => {
      const state = useAppStore.getState();
      state.setExtractedText(placeholderAnalysis.originalText);
      state.setAnalysisResult(placeholderAnalysis);
      state.setProcessingStage("complete");
    },
    reset: () => useAppStore.getState().reset(),
    simulateError: (msg?: string) =>
      useAppStore.getState().setError(msg || "Test error"),
  };

  console.log(
    "🔧 LegaliTea dev helpers available at window.legaliteaDevHelpers"
  );
}
