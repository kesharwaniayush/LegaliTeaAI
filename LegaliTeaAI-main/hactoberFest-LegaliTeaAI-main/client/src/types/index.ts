export interface DateInfo {
  date: string;
  description: string;
  importance: 'high' | 'medium' | 'low';
}

export interface MonetaryInfo {
  amount: string;
  currency: string;
  description: string;
  type: 'payment' | 'penalty' | 'deposit' | 'fee';
}

export interface RiskFlag {
  clause: string;
  risk: string;
  severity: 'high' | 'medium' | 'low';
  explanation: string;
  originalText: string;
}

export interface ActionItem {
  id: string;
  task: string;
  priority: 'high' | 'medium' | 'low';
  deadline?: string;
  completed: boolean;
}

export interface AnalysisResult {
  id?: string;
  summary: {
    tldr: string;
    keyPoints: string[];
    confidence: number;
  };
  keyInformation: {
    parties: string[];
    dates: DateInfo[];
    monetaryAmounts: MonetaryInfo[];
    obligations: string[];
  };
  riskAssessment: {
    overallRisk: 'low' | 'medium' | 'high';
    redFlags: RiskFlag[];
    recommendations: string[];
  };
  actionPlan: ActionItem[];
  originalText: string;
  documentType: string;
  createdAt: Date;
}

export type ProcessingStage = 'upload' | 'extract' | 'preview' | 'analyze' | 'complete';
export type DocumentType = 'pdf' | 'docx' | 'text' | null;