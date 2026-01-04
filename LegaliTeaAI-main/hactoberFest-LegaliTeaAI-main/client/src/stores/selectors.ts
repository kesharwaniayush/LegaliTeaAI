import { useAppStore } from "./appStore";

// Computed selectors for derived state
export const useCanSubmit = () => {
  return useAppStore((state) => {
    const hasFile = state.uploadedFile !== null;
    const hasText = state.extractedText.trim().length > 0;
    const notProcessing = !state.isProcessing;

    return (hasFile || hasText) && notProcessing;
  });
};

export const useProcessingMessage = () => {
  return useAppStore((state) => {
    switch (state.processingStage) {
      case "upload":
        return "Ready to analyze your document";
      case "extract":
        return "Reading your document...";
      case "analyze":
        return "Analyzing with DigitalOcean's Gradient AI...";
      case "complete":
        return "Analysis complete!";
      default:
        return "Processing...";
    }
  });
};

export const useHighPriorityActions = () => {
  return useAppStore((state) => {
    if (!state.analysisResult) return [];
    return state.analysisResult.actionPlan.filter(
      (action) => action.priority === "high" && !action.completed
    );
  });
};

export const useHighSeverityRisks = () => {
  return useAppStore((state) => {
    if (!state.analysisResult) return [];
    return state.analysisResult.riskAssessment.redFlags.filter(
      (risk) => risk.severity === "high"
    );
  });
};

export const useDocumentStats = () => {
  return useAppStore(
    (state) => {
      if (!state.analysisResult) return null;

      const { keyInformation, riskAssessment, actionPlan } =
        state.analysisResult;

      return {
        totalParties: keyInformation.parties.length,
        totalDates: keyInformation.dates.length,
        totalAmounts: keyInformation.monetaryAmounts.length,
        totalObligations: keyInformation.obligations.length,
        totalRisks: riskAssessment.redFlags.length,
        highRisks: riskAssessment.redFlags.filter((r) => r.severity === "high")
          .length,
        totalActions: actionPlan.length,
        highPriorityActions: actionPlan.filter((a) => a.priority === "high")
          .length,
        overallRisk: riskAssessment.overallRisk,
        confidence: state.analysisResult.summary.confidence,
      };
    },
    (a: unknown, b: unknown): boolean => {
      // Custom equality function to prevent unnecessary re-renders
      if (!a && !b) return true;
      if (!a || !b) return false;
      return JSON.stringify(a) === JSON.stringify(b);
    }
  );
};
