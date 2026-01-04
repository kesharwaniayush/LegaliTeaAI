import type { AnalysisResult } from "../types";

export interface AnalysisRequest {
  text: string;
  documentType?: string;
  language?: string;
}

export class AIAnalyzer {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl || import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
  }

  async analyzeDocument(
    text: string,
    documentType?: string,
    language?: string
  ): Promise<AnalysisResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          documentType,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Analysis failed: ${response.status}`
        );
      }

      const result = await response.json();

      // Add metadata
      return {
        ...result,
        originalText: text,
        documentType: documentType || "unknown",
        createdAt: new Date(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to analyze document");
    }
  }

  // Retry logic with exponential backoff
  async analyzeWithRetry(
    text: string,
    documentType?: string,
    language?: string,
    maxRetries: number = 3
  ): Promise<AnalysisResult> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.analyzeDocument(text, documentType, language);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("Unknown error");

        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  // Generate mock analysis for development
  static generateMockAnalysis(
    text: string,
    documentType?: string
  ): AnalysisResult {
    const wordCount = text.split(/\s+/).length;
    const isLease =
      text.toLowerCase().includes("lease") ||
      text.toLowerCase().includes("rent");
    const isNDA =
      text.toLowerCase().includes("non-disclosure") ||
      text.toLowerCase().includes("confidential");
    const isContract =
      text.toLowerCase().includes("agreement") ||
      text.toLowerCase().includes("contract");

    let detectedType = documentType || "document";
    if (isLease) detectedType = "lease";
    else if (isNDA) detectedType = "nda";
    else if (isContract) detectedType = "contract";

    return {
      summary: {
        tldr: `This ${detectedType} contains ${wordCount} words and appears to be a standard legal document with key terms and obligations.`,
        keyPoints: [
          `Document type: ${detectedType.toUpperCase()}`,
          `Contains standard legal language and clauses`,
          `Establishes rights and obligations between parties`,
          `Includes termination and dispute resolution terms`,
          `May require legal review for complex provisions`,
        ],
        confidence: 0.87,
      },
      keyInformation: {
        parties: ["Party A", "Party B"],
        dates: [
          {
            date: new Date().toISOString().split("T")[0],
            description: "Document effective date",
            importance: "high",
          },
        ],
        monetaryAmounts: [
          {
            amount: "$1,000",
            currency: "USD",
            description: "Sample monetary amount",
            type: "payment",
          },
        ],
        obligations: [
          "Comply with all terms and conditions",
          "Provide required notices",
          "Maintain confidentiality where applicable",
          "Pay amounts when due",
        ],
      },
      riskAssessment: {
        overallRisk: "medium",
        redFlags: [
          {
            clause: "Broad liability clause",
            risk: "May expose you to unexpected liability",
            severity: "medium",
            explanation:
              "This clause could make you responsible for damages beyond your control",
            originalText: "[Sample clause text would appear here]",
          },
        ],
        recommendations: [
          "Review all financial obligations carefully",
          "Understand termination procedures",
          "Consider legal counsel for complex terms",
          "Clarify any ambiguous language before signing",
        ],
      },
      actionPlan: [
        {
          id: "1",
          task: "Review all key terms and obligations",
          priority: "high",
          deadline: "Before signing",
          completed: false,
        },
        {
          id: "2",
          task: "Clarify any unclear provisions",
          priority: "medium",
          completed: false,
        },
        {
          id: "3",
          task: "Consider legal consultation if needed",
          priority: "low",
          completed: false,
        },
      ],
      originalText: text,
      documentType: detectedType,
      createdAt: new Date(),
    };
  }
}

// Structured prompts for DigitalOcean AI (for future implementation)
export const ANALYSIS_PROMPTS = {
  system: `You are a legal document analysis assistant. Analyze legal documents and provide clear, actionable insights for non-lawyers. Always respond in JSON format with the specified structure.`,

  main: `Analyze this legal document and provide a comprehensive analysis in JSON format:

{
  "summary": {
    "tldr": "One sentence summary in plain English",
    "keyPoints": ["3-5 bullet points of main provisions"],
    "confidence": 0.0-1.0
  },
  "keyInformation": {
    "parties": ["List of parties involved"],
    "dates": [{"date": "YYYY-MM-DD", "description": "what this date is for", "importance": "high/medium/low"}],
    "monetaryAmounts": [{"amount": "$X", "currency": "USD", "description": "what this is for", "type": "payment/penalty/deposit/fee"}],
    "obligations": ["List of key obligations and responsibilities"]
  },
  "riskAssessment": {
    "overallRisk": "low/medium/high",
    "redFlags": [{"clause": "clause name", "risk": "what could go wrong", "severity": "high/medium/low", "explanation": "why this is risky", "originalText": "exact text from document"}],
    "recommendations": ["List of recommendations"]
  },
  "actionPlan": [{"id": "1", "task": "specific action to take", "priority": "high/medium/low", "deadline": "when to do this", "completed": false}]
}

Document to analyze:`,

  followUp: `Based on the document analysis, provide additional insights about potential risks and recommended actions. Focus on practical advice for someone without legal training.`,
};
