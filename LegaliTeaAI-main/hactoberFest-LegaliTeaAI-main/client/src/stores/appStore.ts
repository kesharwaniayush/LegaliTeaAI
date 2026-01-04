import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AnalysisResult, ProcessingStage, DocumentType } from "../types";

interface AppState {
  // Document state
  uploadedFile: File | null;
  extractedText: string;
  documentType: DocumentType;

  // Processing state
  isProcessing: boolean;
  processingStage: ProcessingStage;
  progress: number;
  showPreview: boolean;
  previewText: string;
  previewFileName: string;

  // Results state
  analysisResult: AnalysisResult | null;

  // UI state
  error: string | null;
  showOriginalText: boolean;
  selectedSummaryPoint: number | null;

  // Actions
  setUploadedFile: (file: File | null) => void;
  setExtractedText: (text: string) => void;
  setDocumentType: (type: DocumentType) => void;
  setProcessingStage: (stage: ProcessingStage) => void;
  setProgress: (progress: number) => void;
  setIsProcessing: (processing: boolean) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setError: (error: string | null) => void;
  setShowOriginalText: (show: boolean) => void;
  setSelectedSummaryPoint: (point: number | null) => void;
  setShowPreview: (show: boolean) => void;
  setPreviewText: (text: string) => void;
  setPreviewFileName: (fileName: string) => void;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  uploadedFile: null,
  extractedText: "",
  documentType: null,
  isProcessing: false,
  processingStage: "upload" as ProcessingStage,
  progress: 0,
  analysisResult: null,
  error: null,
  showOriginalText: false,
  selectedSummaryPoint: null,
  showPreview: false,
  previewText: "",
  previewFileName: "",
};

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setUploadedFile: (file) => {
        set({ uploadedFile: file, error: null });
        if (file) {
          // Auto-detect document type
          const extension = file.name.split(".").pop()?.toLowerCase();
          if (extension === "pdf") {
            set({ documentType: "pdf" });
          } else if (extension === "docx") {
            set({ documentType: "docx" });
          }
        }
      },

      setExtractedText: (text) => {
        set({ extractedText: text });
        if (text && !get().uploadedFile) {
          set({ documentType: "text" });
        }
      },

      setDocumentType: (type) => set({ documentType: type }),

      setProcessingStage: (stage) => {
        set({ processingStage: stage });
        // Auto-set processing state based on stage
        if (stage === "upload" || stage === "complete") {
          set({ isProcessing: false });
        } else {
          set({ isProcessing: true });
        }
      },

      setProgress: (progress) => set({ progress }),

      setIsProcessing: (processing) => set({ isProcessing: processing }),

      setAnalysisResult: (result) => {
        set({ analysisResult: result });
        if (result) {
          set({
            processingStage: "complete",
            isProcessing: false,
            progress: 100,
          });
        }
      },

      setError: (error) => set({ error }),

      setShowOriginalText: (show) => set({ showOriginalText: show }),

      setSelectedSummaryPoint: (point) => set({ selectedSummaryPoint: point }),

      setShowPreview: (show) => set({ showPreview: show }),

      setPreviewText: (text) => set({ previewText: text }),

      setPreviewFileName: (fileName) => set({ previewFileName: fileName }),

      clearError: () => set({ error: null }),

      reset: () => set(initialState),
    }),
    {
      name: "legalitea-store",
    }
  )
);

// Placeholder data for development
export const placeholderAnalysis: AnalysisResult = {
  summary: {
    tldr: "This is a sample lease agreement with standard residential terms and some areas that need attention.",
    keyPoints: [
      "12-month lease term starting January 1, 2024",
      "Monthly rent of $2,500 due on the 1st of each month",
      "Security deposit of $2,500 required upfront",
      "Tenant responsible for utilities except water/sewer",
      "30-day notice required for termination",
    ],
    confidence: 0.92,
  },
  keyInformation: {
    parties: ["Landlord: ABC Property Management", "Tenant: John Smith"],
    dates: [
      {
        date: "2024-01-01",
        description: "Lease start date",
        importance: "high",
      },
      {
        date: "2024-12-31",
        description: "Lease end date",
        importance: "high",
      },
      {
        date: "2024-01-15",
        description: "First rent payment due",
        importance: "medium",
      },
    ],
    monetaryAmounts: [
      {
        amount: "$2,500",
        currency: "USD",
        description: "Monthly rent",
        type: "payment",
      },
      {
        amount: "$2,500",
        currency: "USD",
        description: "Security deposit",
        type: "deposit",
      },
      {
        amount: "$100",
        currency: "USD",
        description: "Late fee after 5 days",
        type: "penalty",
      },
    ],
    obligations: [
      "Pay rent by 1st of each month",
      "Maintain property in good condition",
      "No pets without written permission",
      "Provide 30-day notice before moving out",
      "Allow landlord access for inspections with 24hr notice",
    ],
  },
  riskAssessment: {
    overallRisk: "medium",
    redFlags: [
      {
        clause: "Automatic rent increase clause",
        risk: "Rent can increase by up to 10% annually",
        severity: "high",
        explanation:
          "This gives the landlord significant power to raise rent each year without negotiation",
        originalText:
          "Landlord reserves the right to increase rent by up to 10% upon lease renewal...",
      },
      {
        clause: "Limited maintenance responsibility",
        risk: "Tenant may be responsible for major repairs",
        severity: "medium",
        explanation:
          "The lease places unusual maintenance burdens on the tenant",
        originalText:
          "Tenant shall be responsible for all repairs exceeding $500...",
      },
    ],
    recommendations: [
      "Negotiate a cap on annual rent increases",
      "Clarify which repairs are landlord vs tenant responsibility",
      "Request written permission process for reasonable modifications",
      "Understand the security deposit return process",
    ],
  },
  actionPlan: [
    {
      id: "1",
      task: "Negotiate rent increase cap before signing",
      priority: "high",
      deadline: "Before lease signing",
      completed: false,
    },
    {
      id: "2",
      task: "Get clarification on repair responsibilities in writing",
      priority: "high",
      deadline: "Before lease signing",
      completed: false,
    },
    {
      id: "3",
      task: "Document current condition of property with photos",
      priority: "medium",
      deadline: "Move-in day",
      completed: false,
    },
    {
      id: "4",
      task: "Set up automatic rent payment to avoid late fees",
      priority: "medium",
      deadline: "Before first payment",
      completed: false,
    },
    {
      id: "5",
      task: "Review local tenant rights and landlord obligations",
      priority: "low",
      completed: false,
    },
  ],
  originalText: `RESIDENTIAL LEASE AGREEMENT

This lease agreement is entered into on January 1, 2024, between ABC Property Management (Landlord) and John Smith (Tenant) for the property located at 123 Main Street, Anytown, ST 12345.

TERM: This lease shall commence on January 1, 2024, and terminate on December 31, 2024, unless renewed or extended.

RENT: Tenant agrees to pay monthly rent of $2,500.00, due on the 1st day of each month. Late fees of $100.00 will be charged for payments received after the 5th day of the month.

SECURITY DEPOSIT: Tenant shall pay a security deposit of $2,500.00 prior to occupancy.

RENT INCREASES: Landlord reserves the right to increase rent by up to 10% upon lease renewal or extension.

MAINTENANCE: Tenant shall be responsible for all repairs and maintenance exceeding $500.00 in cost.

TERMINATION: Either party may terminate this lease with 30 days written notice.

[Additional standard lease terms and conditions follow...]`,
  documentType: "lease",
  createdAt: new Date(),
};
