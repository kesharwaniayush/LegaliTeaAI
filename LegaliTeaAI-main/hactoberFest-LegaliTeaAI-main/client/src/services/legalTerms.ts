// Legal Terms Detection and Explanation Service

interface LegalTerm {
  term: string;
  definition: string;
  context: string;
  confidence: number;
  category: "contract" | "property" | "liability" | "general";
  examples?: string[];
}

interface TermExplanation {
  term: string;
  definition: string;
  context: string;
  examples: string[];
  relatedTerms: string[];
  confidence: number;
}

class LegalTermsService {
  private termCache: Map<string, TermExplanation> = new Map();
  private commonLegalTerms: Set<string> = new Set();
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
    this.initializeCommonTerms();
  }

  private initializeCommonTerms(): void {
    // Common legal terms that should be detected
    const terms = [
      // Contract terms
      "indemnify",
      "indemnification",
      "warranty",
      "guarantee",
      "breach",
      "default",
      "consideration",
      "covenant",
      "addendum",
      "amendment",
      "novation",
      "assignment",
      "force majeure",
      "liquidated damages",
      "specific performance",
      "rescission",

      // Property terms
      "easement",
      "encumbrance",
      "lien",
      "mortgage",
      "deed",
      "title",
      "escrow",
      "appraisal",
      "assessment",
      "zoning",
      "variance",
      "covenant",
      "restriction",

      // Liability terms
      "negligence",
      "liability",
      "damages",
      "tort",
      "plaintiff",
      "defendant",
      "jurisdiction",
      "venue",
      "statute of limitations",
      "arbitration",
      "mediation",

      // General legal terms
      "whereas",
      "heretofore",
      "hereinafter",
      "notwithstanding",
      "pursuant",
      "thereunder",
      "thereof",
      "hereby",
      "hereunder",
      "aforesaid",
      "aforementioned",
      "severability",
      "waiver",
      "estoppel",
      "fiduciary",
      "pro rata",
      "bona fide",
    ];

    terms.forEach((term) => this.commonLegalTerms.add(term.toLowerCase()));
  }

  // Detect legal terms in selected text
  detectLegalTerms(selectedText: string): string[] {
    const words = selectedText
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2);

    const detectedTerms: string[] = [];

    // Check for single words
    words.forEach((word) => {
      if (this.commonLegalTerms.has(word)) {
        detectedTerms.push(word);
      }
    });

    // Check for multi-word terms
    for (let i = 0; i < words.length - 1; i++) {
      const twoWord = `${words[i]} ${words[i + 1]}`;
      const threeWord =
        i < words.length - 2
          ? `${words[i]} ${words[i + 1]} ${words[i + 2]}`
          : "";

      if (this.commonLegalTerms.has(twoWord)) {
        detectedTerms.push(twoWord);
      }
      if (threeWord && this.commonLegalTerms.has(threeWord)) {
        detectedTerms.push(threeWord);
      }
    }

    return [...new Set(detectedTerms)]; // Remove duplicates
  }

  // Get explanation for a legal term using DigitalOcean AI
  async explainTerm(
    term: string,
    context: string = "",
    language: string = "en"
  ): Promise<TermExplanation> {
    const cacheKey = `${term}-${language}-${context.slice(0, 50)}`;

    // Check cache first
    if (this.termCache.has(cacheKey)) {
      return this.termCache.get(cacheKey)!;
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/explain-term`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          term,
          context,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get term explanation");
      }

      const explanation: TermExplanation = await response.json();

      // Cache the result
      this.termCache.set(cacheKey, explanation);

      return explanation;
    } catch (error) {
      console.error("Error explaining term:", error);

      // Fallback to basic explanation
      return this.getFallbackExplanation(term, context);
    }
  }

  private getFallbackExplanation(
    term: string,
    context: string
  ): TermExplanation {
    const fallbackDefinitions: Record<string, string> = {
      indemnify:
        "To protect someone from legal or financial harm by taking responsibility for damages or losses.",
      warranty: "A promise or guarantee that something is true or will happen.",
      breach: "Breaking or violating the terms of a contract or agreement.",
      default:
        "Failing to meet the obligations or terms specified in a contract.",
      consideration:
        "Something of value exchanged between parties in a contract.",
      covenant: "A formal promise or agreement to do or not do something.",
      "force majeure":
        "Unforeseeable circumstances that prevent a party from fulfilling a contract.",
      "liquidated damages":
        "A predetermined amount of money to be paid if a contract is breached.",
      easement:
        "The right to use someone else's property for a specific purpose.",
      lien: "A legal claim against property as security for a debt.",
      negligence:
        "Failure to exercise reasonable care, resulting in harm to others.",
      liability: "Legal responsibility for damages, debts, or obligations.",
      jurisdiction: "The authority of a court to hear and decide a case.",
      arbitration:
        "Resolving disputes outside of court with a neutral third party.",
      severability:
        "If one part of a contract is invalid, the rest remains enforceable.",
      waiver: "Voluntarily giving up a right or claim.",
      fiduciary:
        "A person who acts on behalf of another with a duty of trust and loyalty.",
    };

    return {
      term,
      definition:
        fallbackDefinitions[term.toLowerCase()] ||
        `A legal term that appears in your document. Consider consulting a legal professional for specific advice.`,
      context: context.slice(0, 100),
      examples: [],
      relatedTerms: [],
      confidence: 0.7,
    };
  }

  // Highlight legal terms in text
  highlightLegalTerms(text: string): string {
    let highlightedText = text;
    const detectedTerms = this.detectLegalTerms(text);

    // Sort by length (longest first) to avoid partial replacements
    detectedTerms.sort((a, b) => b.length - a.length);

    detectedTerms.forEach((term) => {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        `<span class="legal-term" data-term="${term}">$&</span>`
      );
    });

    return highlightedText;
  }

  // Get all legal terms from a document
  extractAllTerms(documentText: string): LegalTerm[] {
    const detectedTerms = this.detectLegalTerms(documentText);
    const termFrequency: Map<string, number> = new Map();

    // Count frequency of each term
    detectedTerms.forEach((term) => {
      termFrequency.set(term, (termFrequency.get(term) || 0) + 1);
    });

    return Array.from(termFrequency.entries()).map(([term, frequency]) => ({
      term,
      definition: this.getFallbackExplanation(term, documentText).definition,
      context: this.extractTermContext(documentText, term),
      confidence: this.calculateConfidence(term, frequency),
      category: this.categorizeterm(term),
    }));
  }

  private extractTermContext(text: string, term: string): string {
    const regex = new RegExp(`(.{0,50})\\b${term}\\b(.{0,50})`, "i");
    const match = text.match(regex);
    return match ? match[0] : "";
  }

  private calculateConfidence(term: string, frequency: number): number {
    // Higher confidence for more frequent terms and known legal terms
    const baseConfidence = this.commonLegalTerms.has(term.toLowerCase())
      ? 0.8
      : 0.6;
    const frequencyBonus = Math.min(frequency * 0.1, 0.2);
    return Math.min(baseConfidence + frequencyBonus, 1.0);
  }

  private categorizeterm(term: string): LegalTerm["category"] {
    const contractTerms = [
      "breach",
      "default",
      "consideration",
      "covenant",
      "warranty",
    ];
    const propertyTerms = ["easement", "lien", "deed", "title", "mortgage"];
    const liabilityTerms = ["negligence", "liability", "damages", "indemnify"];

    const lowerTerm = term.toLowerCase();

    if (contractTerms.some((t) => lowerTerm.includes(t))) return "contract";
    if (propertyTerms.some((t) => lowerTerm.includes(t))) return "property";
    if (liabilityTerms.some((t) => lowerTerm.includes(t))) return "liability";

    return "general";
  }

  // Clear cache (useful for testing or memory management)
  clearCache(): void {
    this.termCache.clear();
  }
}

// Create singleton instance
export const legalTermsService = new LegalTermsService();

// React hook for legal terms
export const useLegalTerms = () => {
  return {
    detectTerms: (text: string) => legalTermsService.detectLegalTerms(text),
    explainTerm: (term: string, context?: string, language?: string) =>
      legalTermsService.explainTerm(term, context, language),
    highlightTerms: (text: string) =>
      legalTermsService.highlightLegalTerms(text),
    extractAllTerms: (text: string) => legalTermsService.extractAllTerms(text),
  };
};
