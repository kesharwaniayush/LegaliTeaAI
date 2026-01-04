// Advanced Legal Document Analysis Types

export interface EnhancedAnalysisResult {
  // Basic analysis (existing)
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
    deadline: string | null;
    completed: boolean;
  }>;

  // Advanced features
  interactiveTerms: InteractiveTerm[];
  clauseSimplifications: ClauseSimplification[];
  contractVisualization: ContractVisualization;
  realLifeScenarios: RealLifeScenario[];
  smartGlossary: GlossaryEntry[];

  // Metadata
  originalText: string;
  documentType: string;
  language: string;
  processingTime: number;
}

export interface InteractiveTerm {
  term: string;
  definition: string;
  positions: Array<{
    start: number;
    end: number;
  }>;
  category:
    | "legal"
    | "financial"
    | "temporal"
    | "obligation"
    | "right"
    | "condition";
  complexity: "basic" | "intermediate" | "advanced";
  contextualDefinition?: string;
  examples?: string[];
  relatedTerms?: string[];
  consequences?: string;
}

export interface ClauseSimplification {
  id: string;
  originalClause: string;
  simplifiedClause: string;
  confidence: number;
  clauseType:
    | "obligation"
    | "right"
    | "condition"
    | "penalty"
    | "definition"
    | "procedure";
  complexity: "low" | "medium" | "high";
  position: {
    start: number;
    end: number;
  };
  keyTerms: string[];
  relatedClauses?: string[];
}

export interface ContractVisualization {
  mermaidDiagram: string;
  nodes: Array<{
    id: string;
    label: string;
    type:
      | "party"
      | "obligation"
      | "deadline"
      | "payment"
      | "condition"
      | "penalty";
    description?: string;
    importance?: "high" | "medium" | "low";
  }>;
  relationships: Array<{
    from: string;
    to: string;
    type: "obligation" | "payment" | "dependency" | "condition" | "deadline";
    description: string;
    strength?: "strong" | "medium" | "weak";
  }>;
  layout: "hierarchical" | "network" | "timeline";
}

export interface RealLifeScenario {
  id: string;
  title: string;
  situation: string;
  trigger: string;
  consequences: string[];
  severity: "low" | "medium" | "high";
  likelihood: "low" | "medium" | "high";
  prevention: string;
  proTip: string;
  relatedClauses: string[];
  category: "breach" | "termination" | "payment" | "liability" | "dispute";
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  category:
    | "legal"
    | "financial"
    | "temporal"
    | "obligation"
    | "right"
    | "condition";
  frequency: number;
  importance: "high" | "medium" | "low";
  complexity: "basic" | "intermediate" | "advanced";
  documentReferences: Array<{
    clauseId: string;
    position: { start: number; end: number };
    context: string;
  }>;
  relatedTerms: string[];
  examples?: string[];
}

// Term Explanation API Response
export interface TermExplanation {
  term: string;
  definition: string;
  contextualDefinition: string;
  category:
    | "legal"
    | "financial"
    | "temporal"
    | "obligation"
    | "right"
    | "condition";
  complexity: "basic" | "intermediate" | "advanced";
  examples: string[];
  relatedTerms: string[];
  consequences: string;
}

// Scenario Generation API Response
export interface ScenarioResponse {
  scenarios: Array<{
    id: string;
    title: string;
    situation: string;
    trigger: string;
    consequences: string[];
    severity: "low" | "medium" | "high";
    likelihood: "low" | "medium" | "high";
    prevention: string;
    proTip: string;
  }>;
}

// Quiz System Types
export interface QuizQuestion {
  id: string;
  type: "multiple_choice" | "true_false" | "fill_blank";
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
  category: "terms" | "clauses" | "obligations" | "rights" | "procedures";
  difficulty: "easy" | "medium" | "hard";
}

export interface Quiz {
  id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  questions: QuizQuestion[];
  totalPoints: number;
  timeLimit?: number; // in minutes
  category: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId?: string;
  answers: Record<string, string | number>;
  score: number;
  totalPoints: number;
  completedAt: Date;
  timeSpent: number; // in seconds
  correctAnswers: number;
  totalQuestions: number;
}

// Learning Progress Types
export interface UserLearningProgress {
  userId: string;
  level: number;
  experience: number;
  badges: Badge[];
  completedQuizzes: string[];
  knowledgeAreas: Record<string, number>; // area -> proficiency (0-100)
  learningPath: LearningPathItem[];
  achievements: Achievement[];
  streakDays: number;
  lastActiveDate: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "knowledge" | "engagement" | "achievement" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt: Date;
  requirements: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  unlockedAt: Date;
  category: string;
}

export interface LearningPathItem {
  id: string;
  title: string;
  description: string;
  type: "quiz" | "reading" | "practice" | "assessment";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number; // in minutes
  prerequisites: string[];
  completed: boolean;
  completedAt?: Date;
  score?: number;
}

// UI State Types
export interface AdvancedFeaturesState {
  activeFeature:
    | "summary"
    | "map"
    | "learn"
    | "glossary"
    | "quiz"
    | "scenarios";
  selectedClause?: string;
  selectedTerm?: string;
  showOriginalText: boolean;
  splitViewMode: "side-by-side" | "stacked" | "overlay";
  mapZoomLevel: number;
  glossaryFilter: string;
  quizMode: boolean;
  learningMode: boolean;
}

// API Request/Response Types
export interface AnalyzeDocumentRequest {
  text: string;
  documentType?: string;
  language?: string;
  features?: {
    clauseSimplification: boolean;
    contractMapping: boolean;
    scenarioGeneration: boolean;
    glossaryGeneration: boolean;
    interactiveTerms: boolean;
  };
}

export interface ExplainTermRequest {
  term: string;
  context: string;
  documentType?: string;
  language?: string;
}

export interface GenerateScenariosRequest {
  clause: string;
  documentType?: string;
  language?: string;
}

export interface GenerateQuizRequest {
  documentText: string;
  difficulty?: "easy" | "medium" | "hard";
  language?: string;
  questionCount?: number;
}
