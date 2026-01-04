import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  BookOpen,
  Download,
  Filter,
  SortAsc,
  SortDesc,
  Hash,
  Eye,
  ExternalLink,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedInput } from "@/components/ui/animated-input";
import { useAudioFeedback } from "@/services/audioFeedback";
import { useAnimations } from "@/hooks/useAnimations";

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  simpleDefinition: string;
  category: "contract" | "property" | "liability" | "general" | "procedure";
  frequency: number;
  complexity: "basic" | "intermediate" | "advanced";
  examples: string[];
  relatedTerms: string[];
  documentReferences: Array<{
    section: string;
    context: string;
  }>;
  synonyms: string[];
}

interface LegalGlossaryProps {
  analysisResult: any;
  originalText: string;
  className?: string;
}

export const LegalGlossary: React.FC<LegalGlossaryProps> = ({
  analysisResult,
  originalText,
  className = "",
}) => {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "alphabetical" | "frequency" | "complexity"
  >("alphabetical");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [favoriteTerms, setFavoriteTerms] = useState<Set<string>>(new Set());

  const { playClick, playSuccess } = useAudioFeedback();
  const { getAnimationClass } = useAnimations();

  // Generate glossary terms from analysis
  useEffect(() => {
    if (analysisResult && originalText) {
      generateGlossary();
    }
  }, [analysisResult, originalText]);

  const generateGlossary = async () => {
    setIsGenerating(true);

    try {
      // Extract terms from the document and analysis
      const extractedTerms: GlossaryTerm[] = [];

      // Common legal terms with definitions
      const commonTerms = [
        {
          id: "indemnify",
          term: "Indemnify",
          definition:
            "To compensate someone for harm or loss, or to protect them from legal responsibility for damages or losses.",
          simpleDefinition:
            "To protect someone from having to pay for damages or losses.",
          category: "liability" as const,
          frequency: countTermOccurrences("indemnify", originalText),
          complexity: "intermediate" as const,
          examples: [
            "The contractor agrees to indemnify the client against any third-party claims.",
            "You must indemnify us for any losses caused by your breach of this agreement.",
          ],
          relatedTerms: [
            "liability",
            "damages",
            "compensation",
            "hold harmless",
          ],
          documentReferences: findTermReferences("indemnify", originalText),
          synonyms: ["hold harmless", "protect", "compensate"],
        },
        {
          id: "warranty",
          term: "Warranty",
          definition:
            "A promise or guarantee made by one party about the quality, condition, or performance of something in the contract.",
          simpleDefinition:
            "A promise that something will work as expected or be of good quality.",
          category: "contract" as const,
          frequency: countTermOccurrences("warranty", originalText),
          complexity: "basic" as const,
          examples: [
            "The seller provides a one-year warranty on all products.",
            "This warranty covers defects in materials and workmanship.",
          ],
          relatedTerms: ["guarantee", "representation", "condition"],
          documentReferences: findTermReferences("warranty", originalText),
          synonyms: ["guarantee", "assurance", "promise"],
        },
        {
          id: "liability",
          term: "Liability",
          definition:
            "Legal responsibility for damages, debts, or obligations. The state of being legally responsible for something.",
          simpleDefinition:
            "Being legally responsible for paying for damages or problems.",
          category: "liability" as const,
          frequency: countTermOccurrences("liability", originalText),
          complexity: "intermediate" as const,
          examples: [
            "The company limits its liability to the amount paid for services.",
            "Personal liability means you could be responsible with your own assets.",
          ],
          relatedTerms: [
            "responsibility",
            "damages",
            "obligation",
            "indemnify",
          ],
          documentReferences: findTermReferences("liability", originalText),
          synonyms: ["responsibility", "obligation", "accountability"],
        },
        {
          id: "breach",
          term: "Breach",
          definition:
            "The failure to fulfill or perform any duty or obligation specified in a contract.",
          simpleDefinition: "Breaking the rules or promises in a contract.",
          category: "contract" as const,
          frequency: countTermOccurrences("breach", originalText),
          complexity: "basic" as const,
          examples: [
            "Late payment constitutes a breach of the payment terms.",
            "Material breach allows the other party to terminate the contract.",
          ],
          relatedTerms: ["violation", "default", "non-performance"],
          documentReferences: findTermReferences("breach", originalText),
          synonyms: ["violation", "breaking", "non-compliance"],
        },
        {
          id: "consideration",
          term: "Consideration",
          definition:
            "Something of value (money, services, goods, or promises) exchanged between parties to make a contract legally binding.",
          simpleDefinition:
            "What each party gives or promises to give to make the contract valid.",
          category: "contract" as const,
          frequency: countTermOccurrences("consideration", originalText),
          complexity: "intermediate" as const,
          examples: [
            "Payment of $1,000 serves as consideration for the services.",
            "Mutual promises can constitute adequate consideration.",
          ],
          relatedTerms: ["payment", "exchange", "value", "quid pro quo"],
          documentReferences: findTermReferences("consideration", originalText),
          synonyms: ["payment", "exchange", "compensation"],
        },
        {
          id: "force-majeure",
          term: "Force Majeure",
          definition:
            "Unforeseeable circumstances that prevent a party from fulfilling a contract, such as natural disasters, wars, or government actions.",
          simpleDefinition:
            "Events beyond anyone's control (like natural disasters) that make it impossible to fulfill the contract.",
          category: "contract" as const,
          frequency: countTermOccurrences("force majeure", originalText),
          complexity: "advanced" as const,
          examples: [
            "The COVID-19 pandemic was considered a force majeure event.",
            "Force majeure clauses excuse performance during extraordinary circumstances.",
          ],
          relatedTerms: [
            "act of god",
            "unforeseeable circumstances",
            "impossibility",
          ],
          documentReferences: findTermReferences("force majeure", originalText),
          synonyms: [
            "act of god",
            "extraordinary circumstances",
            "unforeseeable events",
          ],
        },
        {
          id: "jurisdiction",
          term: "Jurisdiction",
          definition:
            "The authority of a court to hear and decide a case, or the geographic area where laws apply.",
          simpleDefinition:
            "Which court has the power to make decisions about legal disputes.",
          category: "procedure" as const,
          frequency: countTermOccurrences("jurisdiction", originalText),
          complexity: "intermediate" as const,
          examples: [
            "This contract is subject to the jurisdiction of California courts.",
            "Federal courts have jurisdiction over interstate commerce disputes.",
          ],
          relatedTerms: ["venue", "governing law", "court authority"],
          documentReferences: findTermReferences("jurisdiction", originalText),
          synonyms: ["authority", "power", "control"],
        },
      ];

      // Filter terms that appear in the document
      const relevantTerms = commonTerms.filter((term) => term.frequency > 0);

      // Add terms from analysis results
      if (analysisResult.riskAssessment?.redFlags) {
        analysisResult.riskAssessment.redFlags.forEach(
          (risk: any, index: number) => {
            if (risk.clause && risk.explanation) {
              relevantTerms.push({
                id: `analysis-term-${index}`,
                term: risk.clause,
                definition: risk.explanation,
                simpleDefinition: risk.risk,
                category: "contract" as const,
                frequency: 1,
                complexity:
                  risk.severity === "high"
                    ? ("advanced" as const)
                    : ("intermediate" as const),
                examples: [risk.originalText],
                relatedTerms: [],
                documentReferences: [
                  {
                    section: risk.clause,
                    context: risk.originalText,
                  },
                ],
                synonyms: [],
              });
            }
          }
        );
      }

      setTerms(relevantTerms);
    } catch (error) {
      console.error("Error generating glossary:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper functions
  const countTermOccurrences = (term: string, text: string): number => {
    const regex = new RegExp(term, "gi");
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };

  const findTermReferences = (term: string, text: string) => {
    const references = [];
    const sentences = text.split(/[.!?]+/);

    sentences.forEach((sentence, index) => {
      if (sentence.toLowerCase().includes(term.toLowerCase())) {
        references.push({
          section: `Section ${index + 1}`,
          context: sentence.trim(),
        });
      }
    });

    return references.slice(0, 3); // Limit to 3 references
  };

  // Filtered and sorted terms
  const filteredAndSortedTerms = useMemo(() => {
    let filtered = terms.filter((term) => {
      const matchesSearch =
        term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort terms
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "alphabetical":
          comparison = a.term.localeCompare(b.term);
          break;
        case "frequency":
          comparison = a.frequency - b.frequency;
          break;
        case "complexity":
          const complexityOrder = { basic: 1, intermediate: 2, advanced: 3 };
          comparison =
            complexityOrder[a.complexity] - complexityOrder[b.complexity];
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [terms, searchTerm, selectedCategory, sortBy, sortOrder]);

  const categories = [
    { value: "all", label: "All Terms", count: terms.length },
    {
      value: "contract",
      label: "Contract",
      count: terms.filter((t) => t.category === "contract").length,
    },
    {
      value: "liability",
      label: "Liability",
      count: terms.filter((t) => t.category === "liability").length,
    },
    {
      value: "property",
      label: "Property",
      count: terms.filter((t) => t.category === "property").length,
    },
    {
      value: "procedure",
      label: "Procedure",
      count: terms.filter((t) => t.category === "procedure").length,
    },
    {
      value: "general",
      label: "General",
      count: terms.filter((t) => t.category === "general").length,
    },
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "basic":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "contract":
        return "bg-blue-100 text-blue-800";
      case "liability":
        return "bg-red-100 text-red-800";
      case "property":
        return "bg-green-100 text-green-800";
      case "procedure":
        return "bg-purple-100 text-purple-800";
      case "general":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleFavorite = (termId: string) => {
    playClick();
    setFavoriteTerms((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(termId)) {
        newFavorites.delete(termId);
      } else {
        newFavorites.add(termId);
        playSuccess();
      }
      return newFavorites;
    });
  };

  const exportGlossary = () => {
    playClick();
    const glossaryText = filteredAndSortedTerms
      .map(
        (term) =>
          `${term.term}\n${term.simpleDefinition}\n\nDefinition: ${
            term.definition
          }\n\nExamples:\n${term.examples
            .map((ex) => `• ${ex}`)
            .join("\n")}\n\n---\n\n`
      )
      .join("");

    const blob = new Blob([glossaryText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "legal-glossary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isGenerating) {
    return (
      <AnimatedCard className={`p-6 ${className}`} loading>
        <div className="text-center">
          <BookOpen
            className={`h-8 w-8 mx-auto mb-4 ${getAnimationClass(
              "animate-pulse"
            )}`}
          />
          <h3 className="text-lg font-semibold mb-2">
            Building Legal Glossary
          </h3>
          <p className="text-muted-foreground">
            Extracting and defining legal terms from your document...
          </p>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <AnimatedCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Legal Glossary</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {filteredAndSortedTerms.length} terms found in your document
                </p>
              </div>
            </div>
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={exportGlossary}
              animation="scale"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </AnimatedButton>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="space-y-4">
            {/* Search */}
            <AnimatedInput
              placeholder="Search terms or definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              animation="focus-ring"
            />

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      onClick={() => {
                        playClick();
                        setSelectedCategory(category.value);
                      }}
                      className={`
                        px-3 py-1 rounded-full text-sm font-medium transition-all duration-200
                        ${
                          selectedCategory === category.value
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }
                      `}
                    >
                      {category.label} ({category.count})
                    </button>
                  ))}
                </div>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    playClick();
                    setSortBy(e.target.value as any);
                  }}
                  className="px-2 py-1 rounded border bg-background text-sm"
                >
                  <option value="alphabetical">Alphabetical</option>
                  <option value="frequency">Frequency</option>
                  <option value="complexity">Complexity</option>
                </select>
                <button
                  onClick={() => {
                    playClick();
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Terms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedTerms.map((term, index) => (
          <AnimatedCard
            key={term.id}
            delay={index * 50}
            animation="fade-up"
            className="cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => {
              playClick();
              setSelectedTerm(term);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{term.term}</h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge
                      className={getCategoryColor(term.category)}
                      variant="secondary"
                    >
                      {term.category}
                    </Badge>
                    <Badge
                      className={getComplexityColor(term.complexity)}
                      variant="outline"
                    >
                      {term.complexity}
                    </Badge>
                    {term.frequency > 1 && (
                      <Badge
                        variant="outline"
                        className="flex items-center space-x-1"
                      >
                        <Hash className="h-3 w-3" />
                        <span>{term.frequency}</span>
                      </Badge>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(term.id);
                  }}
                  className="p-1 rounded hover:bg-muted transition-colors"
                >
                  <Star
                    className={`h-4 w-4 ${
                      favoriteTerms.has(term.id)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                {term.simpleDefinition}
              </p>

              {term.documentReferences.length > 0 && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>
                    {term.documentReferences.length} reference
                    {term.documentReferences.length !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </CardContent>
          </AnimatedCard>
        ))}
      </div>

      {filteredAndSortedTerms.length === 0 && (
        <AnimatedCard className="p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Terms Found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </AnimatedCard>
      )}

      {/* Term Detail Modal */}
      {selectedTerm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <AnimatedCard className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">
                    {selectedTerm.term}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={getCategoryColor(selectedTerm.category)}
                      variant="secondary"
                    >
                      {selectedTerm.category}
                    </Badge>
                    <Badge
                      className={getComplexityColor(selectedTerm.complexity)}
                      variant="outline"
                    >
                      {selectedTerm.complexity}
                    </Badge>
                    {selectedTerm.frequency > 1 && (
                      <Badge
                        variant="outline"
                        className="flex items-center space-x-1"
                      >
                        <Hash className="h-3 w-3" />
                        <span>{selectedTerm.frequency} occurrences</span>
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleFavorite(selectedTerm.id)}
                    className="p-2 rounded hover:bg-muted transition-colors"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        favoriteTerms.has(selectedTerm.id)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTerm(null)}
                    animation="scale"
                  >
                    ✕
                  </AnimatedButton>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Simple Definition */}
              <div>
                <h4 className="font-semibold mb-2">Simple Explanation</h4>
                <p className="text-muted-foreground">
                  {selectedTerm.simpleDefinition}
                </p>
              </div>

              <Separator />

              {/* Full Definition */}
              <div>
                <h4 className="font-semibold mb-2">Legal Definition</h4>
                <p className="text-muted-foreground">
                  {selectedTerm.definition}
                </p>
              </div>

              {/* Examples */}
              {selectedTerm.examples.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Examples</h4>
                    <ul className="space-y-2">
                      {selectedTerm.examples.map((example, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-muted-foreground italic">
                            "{example}"
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Document References */}
              {selectedTerm.documentReferences.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Found in Document</h4>
                    <div className="space-y-3">
                      {selectedTerm.documentReferences.map((ref, index) => (
                        <div key={index} className="bg-muted p-3 rounded-lg">
                          <div className="font-medium text-sm mb-1">
                            {ref.section}
                          </div>
                          <p className="text-sm text-muted-foreground italic">
                            "{ref.context}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Related Terms */}
              {selectedTerm.relatedTerms.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Related Terms</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.relatedTerms.map((relatedTerm, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-muted"
                        >
                          {relatedTerm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Synonyms */}
              {selectedTerm.synonyms.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Also Known As</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.synonyms.map((synonym, index) => (
                        <Badge key={index} variant="secondary">
                          {synonym}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </AnimatedCard>
        </div>
      )}
    </div>
  );
};
