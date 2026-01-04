import type { VercelRequest, VercelResponse } from "@vercel/node";

interface AnalysisRequest {
  text: string;
  documentType?: string;
}

interface AnalysisResult {
  summary: {
    tldr: string;
    keyPoints: string[];
    confidence: number;
  };
  keyInformation: {
    parties: string[];
    dates: Array<{
      date: string;
      description: string;
      importance: "high" | "medium" | "low";
    }>;
    monetaryAmounts: Array<{
      amount: string;
      currency: string;
      description: string;
      type: "payment" | "penalty" | "deposit" | "fee";
    }>;
    obligations: string[];
  };
  riskAssessment: {
    overallRisk: "low" | "medium" | "high";
    redFlags: Array<{
      clause: string;
      risk: string;
      severity: "high" | "medium" | "low";
      explanation: string;
      originalText: string;
    }>;
    recommendations: string[];
  };
  actionPlan: Array<{
    id: string;
    task: string;
    priority: "high" | "medium" | "low";
    deadline?: string;
    completed: boolean;
  }>;
}

// Placeholder analysis function - will be replaced with actual DigitalOcean AI call
function generatePlaceholderAnalysis(text: string): AnalysisResult {
  return {
    summary: {
      tldr: "This appears to be a legal document with standard terms and conditions.",
      keyPoints: [
        "Document establishes terms between two parties",
        "Contains standard liability and termination clauses",
        "Includes payment and delivery terms",
        "Specifies dispute resolution procedures",
      ],
      confidence: 0.85,
    },
    keyInformation: {
      parties: ["Company ABC", "Client XYZ"],
      dates: [
        {
          date: "2024-01-15",
          description: "Contract effective date",
          importance: "high",
        },
        {
          date: "2024-12-31",
          description: "Contract expiration",
          importance: "high",
        },
      ],
      monetaryAmounts: [
        {
          amount: "$5,000",
          currency: "USD",
          description: "Monthly service fee",
          type: "payment",
        },
      ],
      obligations: [
        "Provide monthly reports",
        "Maintain confidentiality",
        "Pay invoices within 30 days",
      ],
    },
    riskAssessment: {
      overallRisk: "medium",
      redFlags: [
        {
          clause: "Automatic renewal clause",
          risk: "Contract may renew without notice",
          severity: "medium",
          explanation:
            "This clause could lock you into another term automatically",
          originalText: "This agreement shall automatically renew...",
        },
      ],
      recommendations: [
        "Review termination notice requirements",
        "Clarify payment terms and late fees",
        "Consider adding performance metrics",
      ],
    },
    actionPlan: [
      {
        id: "1",
        task: "Review and understand all payment terms",
        priority: "high",
        deadline: "Before signing",
        completed: false,
      },
      {
        id: "2",
        task: "Clarify termination notice period",
        priority: "medium",
        completed: false,
      },
      {
        id: "3",
        task: "Consult with legal counsel if needed",
        priority: "low",
        completed: false,
      },
    ],
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { text, documentType }: AnalysisRequest = req.body;

    if (!text || text.trim().length === 0) {
      res.status(400).json({ error: "Text is required" });
      return;
    }

    if (text.length > 50000) {
      res
        .status(400)
        .json({ error: "Text too long. Maximum 50,000 characters allowed." });
      return;
    }

    // For now, return placeholder analysis
    // TODO: Replace with actual DigitalOcean AI integration
    const analysis = generatePlaceholderAnalysis(text);

    res.status(200).json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
