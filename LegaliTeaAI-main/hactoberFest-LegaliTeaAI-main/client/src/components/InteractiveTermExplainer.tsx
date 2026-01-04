import React, { useState, useRef, useEffect } from "react";
import {
  HelpCircle,
  BookOpen,
  Lightbulb,
  ExternalLink,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AnimatedCard } from "@/components/ui/animated-card";
import { useAnimations } from "@/hooks/useAnimations";
import { useAudioFeedback } from "@/services/audioFeedback";
import type { TermExplanation } from "@/types/advanced";

interface InteractiveTermExplainerProps {
  documentText: string;
  documentType?: string;
  language?: string;
  onTermAddedToGlossary?: (term: string, definition: string) => void;
  className?: string;
}

interface PopupPosition {
  x: number;
  y: number;
  visible: boolean;
}

export const InteractiveTermExplainer: React.FC<
  InteractiveTermExplainerProps
> = ({
  documentText,
  documentType = "legal document",
  language = "en",
  onTermAddedToGlossary,
  className = "",
}) => {
  const [selectedText, setSelectedText] = useState("");
  const [popupPosition, setPopupPosition] = useState<PopupPosition>({
    x: 0,
    y: 0,
    visible: false,
  });
  const [explanation, setExplanation] = useState<TermExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explainedTerms, setExplainedTerms] = useState<Set<string>>(new Set());

  const textRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const { getAnimationClass } = useAnimations();
  const { playClick, playSuccess, playError } = useAudioFeedback();

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length < 2 || selectedText.length > 50) {
      hidePopup();
      return;
    }

    // Check if selection contains only letters, spaces, and common punctuation
    if (!/^[a-zA-Z\s\-']+$/.test(selectedText)) {
      hidePopup();
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = textRef.current?.getBoundingClientRect();

    if (containerRect) {
      const x = rect.left - containerRect.left + rect.width / 2;
      const y = rect.top - containerRect.top - 10;

      setSelectedText(selectedText);
      setPopupPosition({ x, y, visible: true });
      setExplanation(null);
      setError(null);
      playClick();
    }
  };

  // Hide popup
  const hidePopup = () => {
    setPopupPosition((prev) => ({ ...prev, visible: false }));
    setSelectedText("");
    setExplanation(null);
    setError(null);
    window.getSelection()?.removeAllRanges();
  };

  // Fetch term explanation
  const explainTerm = async () => {
    if (!selectedText) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/explain-term", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          term: selectedText,
          context: getContextAroundSelection(),
          documentType,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to explain term");
      }

      const data = await response.json();
      setExplanation(data);
      setExplainedTerms(
        (prev) => new Set([...prev, selectedText.toLowerCase()])
      );
      playSuccess();
    } catch (error) {
      console.error("Term explanation error:", error);
      setError("Failed to explain this term. Please try again.");
      playError();
    } finally {
      setLoading(false);
    }
  };

  // Get context around selected text
  const getContextAroundSelection = (): string => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return "";

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const text = container.textContent || "";

    const startOffset = range.startOffset;
    const endOffset = range.endOffset;

    // Get 100 characters before and after the selection
    const contextStart = Math.max(0, startOffset - 100);
    const contextEnd = Math.min(text.length, endOffset + 100);

    return text.substring(contextStart, contextEnd);
  };

  // Add term to glossary
  const addToGlossary = () => {
    if (explanation && onTermAddedToGlossary) {
      onTermAddedToGlossary(explanation.term, explanation.definition);
      playSuccess();
    }
  };

  // Get complexity color
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "basic":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        hidePopup();
      }
    };

    if (popupPosition.visible) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [popupPosition.visible]);

  // Highlight explained terms in text
  const highlightExplainedTerms = (text: string): React.ReactNode => {
    if (explainedTerms.size === 0) return text;

    const terms = Array.from(explainedTerms);
    const regex = new RegExp(`\\b(${terms.join("|")})\\b`, "gi");

    return text.split(regex).map((part, index) => {
      if (terms.some((term) => term.toLowerCase() === part.toLowerCase())) {
        return (
          <span
            key={index}
            className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1 rounded cursor-help"
            title="Click to see explanation again"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className={`relative ${className}`}>
      {/* Document Text */}
      <div
        ref={textRef}
        className="prose prose-sm dark:prose-invert max-w-none cursor-text select-text"
        onMouseUp={handleTextSelection}
        onTouchEnd={handleTextSelection}
      >
        <div className="whitespace-pre-wrap leading-relaxed">
          {highlightExplainedTerms(documentText)}
        </div>
      </div>

      {/* Selection Popup */}
      {popupPosition.visible && (
        <div
          ref={popupRef}
          className={`
            absolute z-50 transform -translate-x-1/2
            ${getAnimationClass("animate-scale-in")}
          `}
          style={{
            left: popupPosition.x,
            top: popupPosition.y,
          }}
        >
          {!explanation && !loading && !error && (
            <Card className="w-64 shadow-lg border-2 border-primary/20">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium truncate">
                    "{selectedText}"
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={hidePopup}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  onClick={explainTerm}
                  size="sm"
                  className="w-full"
                  disabled={loading}
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  Explain This Term
                </Button>
              </CardContent>
            </Card>
          )}

          {loading && (
            <Card className="w-64 shadow-lg">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Explaining...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="w-64 shadow-lg border-red-200">
              <CardContent className="p-3">
                <div className="text-sm text-red-600 mb-2">{error}</div>
                <div className="flex space-x-2">
                  <Button onClick={explainTerm} size="sm" variant="outline">
                    Try Again
                  </Button>
                  <Button onClick={hidePopup} size="sm" variant="ghost">
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {explanation && (
            <AnimatedCard className="w-80 shadow-lg max-h-96 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    {explanation.term}
                  </CardTitle>
                  <div className="flex items-center space-x-1">
                    <Badge
                      className={getComplexityColor(explanation.complexity)}
                    >
                      {explanation.complexity}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={hidePopup}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                {/* Definition */}
                <div>
                  <h4 className="text-sm font-medium mb-1">Definition</h4>
                  <p className="text-sm text-muted-foreground">
                    {explanation.definition}
                  </p>
                </div>

                {/* Contextual Definition */}
                {explanation.contextualDefinition && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">
                      In This Context
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {explanation.contextualDefinition}
                    </p>
                  </div>
                )}

                {/* Examples */}
                {explanation.examples && explanation.examples.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Examples</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {explanation.examples.map((example, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-1">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Consequences */}
                {explanation.consequences && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Consequences</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      {explanation.consequences}
                    </p>
                  </div>
                )}

                <Separator />

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    onClick={addToGlossary}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add to Glossary
                  </Button>
                  <Button
                    onClick={() => {
                      // TODO: Open detailed explanation
                    }}
                    size="sm"
                    variant="outline"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>

                {/* Related Terms */}
                {explanation.relatedTerms &&
                  explanation.relatedTerms.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Related Terms
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {explanation.relatedTerms.map((term, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs cursor-pointer hover:bg-accent"
                            onClick={() => {
                              setSelectedText(term);
                              explainTerm();
                            }}
                          >
                            {term}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
              </CardContent>
            </AnimatedCard>
          )}
        </div>
      )}

      {/* Instructions */}
      {explainedTerms.size === 0 && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>
              Select any legal term or phrase in the text above to get an
              instant explanation.
            </span>
          </div>
        </div>
      )}

      {/* Explained Terms Counter */}
      {explainedTerms.size > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {explainedTerms.size} term{explainedTerms.size !== 1 ? "s" : ""}{" "}
            explained
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExplainedTerms(new Set())}
          >
            Clear highlights
          </Button>
        </div>
      )}
    </div>
  );
};
