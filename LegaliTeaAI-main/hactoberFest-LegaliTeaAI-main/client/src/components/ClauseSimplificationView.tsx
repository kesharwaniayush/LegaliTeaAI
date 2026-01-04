import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  BookOpen,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatedCard } from "@/components/ui/animated-card";
import { useAnimations } from "@/hooks/useAnimations";
import { useAudioFeedback } from "@/services/audioFeedback";
import type {
  ClauseSimplification,
  EnhancedAnalysisResult,
} from "@/types/advanced";

interface ClauseSimplificationViewProps {
  analysisResult: EnhancedAnalysisResult;
  className?: string;
}

export const ClauseSimplificationView: React.FC<
  ClauseSimplificationViewProps
> = ({ analysisResult, className = "" }) => {
  const [selectedClauseIndex, setSelectedClauseIndex] = useState(0);
  const [viewMode, setViewMode] = useState<
    "side-by-side" | "stacked" | "original-only" | "simplified-only"
  >("side-by-side");
  const [showComplexityIndicators, setShowComplexityIndicators] =
    useState(true);
  const [readingProgress, setReadingProgress] = useState<Set<number>>(
    new Set()
  );

  const originalRef = useRef<HTMLDivElement>(null);
  const simplifiedRef = useRef<HTMLDivElement>(null);

  const { getAnimationClass } = useAnimations();
  const { playClick, playSuccess } = useAudioFeedback();

  const clauses = analysisResult.clauseSimplifications || [];
  const currentClause = clauses[selectedClauseIndex];

  // Mark clause as read when viewed for more than 3 seconds
  useEffect(() => {
    if (currentClause) {
      const timer = setTimeout(() => {
        setReadingProgress((prev) => new Set([...prev, selectedClauseIndex]));
        if (!readingProgress.has(selectedClauseIndex)) {
          playSuccess();
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [selectedClauseIndex, currentClause, readingProgress, playSuccess]);

  // Synchronized scrolling
  const handleScroll = (source: "original" | "simplified") => {
    if (viewMode !== "side-by-side") return;

    const sourceRef = source === "original" ? originalRef : simplifiedRef;
    const targetRef = source === "original" ? simplifiedRef : originalRef;

    if (sourceRef.current && targetRef.current) {
      const scrollPercentage =
        sourceRef.current.scrollTop /
        (sourceRef.current.scrollHeight - sourceRef.current.clientHeight);

      targetRef.current.scrollTop =
        scrollPercentage *
        (targetRef.current.scrollHeight - targetRef.current.clientHeight);
    }
  };

  const navigateClause = (direction: "prev" | "next") => {
    playClick();
    if (direction === "prev" && selectedClauseIndex > 0) {
      setSelectedClauseIndex(selectedClauseIndex - 1);
    } else if (
      direction === "next" &&
      selectedClauseIndex < clauses.length - 1
    ) {
      setSelectedClauseIndex(selectedClauseIndex + 1);
    }
  };

  const getComplexityColor = (complexity: "low" | "medium" | "high") => {
    switch (complexity) {
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getComplexityIcon = (complexity: "low" | "medium" | "high") => {
    switch (complexity) {
      case "low":
        return <BookOpen className="h-3 w-3" />;
      case "medium":
        return <Lightbulb className="h-3 w-3" />;
      case "high":
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <BookOpen className="h-3 w-3" />;
    }
  };

  if (!clauses.length) {
    return (
      <AnimatedCard className="p-8 text-center">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Clauses Available</h3>
        <p className="text-muted-foreground">
          Clause simplification is not available for this document.
        </p>
      </AnimatedCard>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold">Clause Simplification</h2>
          {showComplexityIndicators && currentClause && (
            <Badge className={getComplexityColor(currentClause.complexity)}>
              {getComplexityIcon(currentClause.complexity)}
              <span className="ml-1 capitalize">
                {currentClause.complexity}
              </span>
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="hidden md:flex items-center space-x-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "side-by-side" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("side-by-side")}
              className="h-8 px-3"
            >
              Side by Side
            </Button>
            <Button
              variant={viewMode === "stacked" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("stacked")}
              className="h-8 px-3"
            >
              Stacked
            </Button>
          </div>

          {/* Mobile View Toggle */}
          <div className="md:hidden flex items-center space-x-1">
            <Button
              variant={viewMode.includes("original") ? "default" : "ghost"}
              size="sm"
              onClick={() =>
                setViewMode(
                  viewMode === "original-only"
                    ? "simplified-only"
                    : "original-only"
                )
              }
            >
              {viewMode === "original-only" ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              Original
            </Button>
            <Button
              variant={viewMode.includes("simplified") ? "default" : "ghost"}
              size="sm"
              onClick={() =>
                setViewMode(
                  viewMode === "simplified-only"
                    ? "original-only"
                    : "simplified-only"
                )
              }
            >
              {viewMode === "simplified-only" ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              Simple
            </Button>
          </div>

          {/* Complexity Indicators Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setShowComplexityIndicators(!showComplexityIndicators)
            }
            className="h-8 px-3"
          >
            {showComplexityIndicators ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Clause Navigation */}
      <div className="flex items-center justify-between bg-muted rounded-lg p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateClause("prev")}
          disabled={selectedClauseIndex === 0}
          className={getAnimationClass("hover:scale-105")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">
            Clause {selectedClauseIndex + 1} of {clauses.length}
          </span>
          <div className="flex space-x-1">
            {clauses.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedClauseIndex(index);
                  playClick();
                }}
                className={`
                  w-2 h-2 rounded-full transition-all duration-200
                  ${
                    index === selectedClauseIndex
                      ? "bg-primary scale-125"
                      : readingProgress.has(index)
                      ? "bg-green-500"
                      : "bg-muted-foreground/30"
                  }
                  ${getAnimationClass("hover:scale-110")}
                `}
              />
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateClause("next")}
          disabled={selectedClauseIndex === clauses.length - 1}
          className={getAnimationClass("hover:scale-105")}
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Content Area */}
      <div
        className={`
        grid gap-4
        ${viewMode === "side-by-side" ? "md:grid-cols-2" : "grid-cols-1"}
        ${viewMode === "stacked" ? "space-y-4" : ""}
      `}
      >
        {/* Original Text */}
        {(viewMode === "side-by-side" ||
          viewMode === "stacked" ||
          viewMode === "original-only") && (
          <AnimatedCard
            animation="fade-up"
            className={getAnimationClass("animate-fade-in-up")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Original Text
                {currentClause && (
                  <Badge variant="outline" className="ml-2">
                    {currentClause.clauseType}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea
                className="h-64 md:h-80"
                ref={originalRef}
                onScrollCapture={() => handleScroll("original")}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {currentClause?.originalClause || "No clause selected"}
                  </p>
                </div>
              </ScrollArea>
            </CardContent>
          </AnimatedCard>
        )}

        {/* Simplified Text */}
        {(viewMode === "side-by-side" ||
          viewMode === "stacked" ||
          viewMode === "simplified-only") && (
          <AnimatedCard
            animation="fade-up"
            delay={100}
            className={getAnimationClass("animate-fade-in-up delay-100")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                Plain English
                {currentClause && (
                  <Badge variant="secondary" className="ml-2">
                    {Math.round(currentClause.confidence * 100)}% confident
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea
                className="h-64 md:h-80"
                ref={simplifiedRef}
                onScrollCapture={() => handleScroll("simplified")}
              >
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-green-700 dark:text-green-300">
                    {currentClause?.simplifiedClause ||
                      "No simplified version available"}
                  </p>
                </div>
              </ScrollArea>
            </CardContent>
          </AnimatedCard>
        )}
      </div>

      {/* Key Terms */}
      {currentClause?.keyTerms && currentClause.keyTerms.length > 0 && (
        <AnimatedCard animation="fade-up" delay={200}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Key Terms in This Clause</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentClause.keyTerms.map((term, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`
                    cursor-pointer transition-all duration-200
                    ${getAnimationClass("hover:scale-105 hover:shadow-md")}
                  `}
                  onClick={() => {
                    playClick();
                    // TODO: Trigger term explanation
                  }}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </CardContent>
        </AnimatedCard>
      )}

      {/* Reading Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Progress: {readingProgress.size} of {clauses.length} clauses read
        </span>
        <div className="flex items-center space-x-2">
          <div className="w-32 bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(readingProgress.size / clauses.length) * 100}%`,
              }}
            />
          </div>
          <span>
            {Math.round((readingProgress.size / clauses.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
