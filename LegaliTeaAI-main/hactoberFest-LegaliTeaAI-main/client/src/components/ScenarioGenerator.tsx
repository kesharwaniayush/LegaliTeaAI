import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  RefreshCw,
  Bookmark,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useAudioFeedback } from "@/services/audioFeedback";
import { useAnimations } from "@/hooks/useAnimations";

interface Scenario {
  id: string;
  title: string;
  situation: string;
  consequences: string[];
  severity: "low" | "medium" | "high";
  relatedClause: string;
  tips: string[];
}

interface ScenarioGeneratorProps {
  analysisResult: any;
  originalText: string;
  className?: string;
}

export const ScenarioGenerator: React.FC<ScenarioGeneratorProps> = ({
  analysisResult,
  originalText,
  className = "",
}) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<Set<string>>(new Set());

  const { playClick, playSuccess } = useAudioFeedback();
  const { getAnimationClass } = useAnimations();

  // Generate scenarios based on analysis
  useEffect(() => {
    if (analysisResult && originalText) {
      generateScenarios();
    }
  }, [analysisResult, originalText]);

  const generateScenarios = async () => {
    setIsGenerating(true);

    try {
      // Extract key clauses and risks from analysis
      const riskClauses = analysisResult.riskAssessment?.redFlags || [];
      const keyObligations = analysisResult.keyInformation?.obligations || [];

      const generatedScenarios: Scenario[] = [];

      // Generate scenarios for each risk
      for (let i = 0; i < Math.min(riskClauses.length, 3); i++) {
        const risk = riskClauses[i];
        const scenario: Scenario = {
          id: `risk-${i}`,
          title: `What if you violate: ${risk.clause}`,
          situation: `Imagine you're in a situation where ${risk.explanation.toLowerCase()}. This could happen if you don't carefully follow the terms outlined in the "${
            risk.clause
          }" section.`,
          consequences: [
            risk.risk,
            "Potential legal action from the other party",
            "Financial penalties or damages",
            "Termination of the agreement",
          ],
          severity: risk.severity as "low" | "medium" | "high",
          relatedClause: risk.originalText,
          tips: [
            "Always read this section carefully before signing",
            "Consider consulting a lawyer if unclear",
            "Set up reminders for any deadlines mentioned",
            "Keep detailed records of your compliance",
          ],
        };
        generatedScenarios.push(scenario);
      }

      // Generate scenarios for key obligations
      for (let i = 0; i < Math.min(keyObligations.length, 2); i++) {
        const obligation = keyObligations[i];
        const scenario: Scenario = {
          id: `obligation-${i}`,
          title: `Your responsibility: ${obligation}`,
          situation: `Let's say you need to fulfill this obligation: "${obligation}". Here's what this means in real life and what could go wrong.`,
          consequences: [
            "Breach of contract if not fulfilled",
            "Other party may terminate the agreement",
            "You might lose deposits or payments",
            "Damage to your reputation or credit",
          ],
          severity: "medium",
          relatedClause: obligation,
          tips: [
            "Create a checklist for this obligation",
            "Set calendar reminders well in advance",
            "Understand exactly what constitutes fulfillment",
            "Communicate proactively if issues arise",
          ],
        };
        generatedScenarios.push(scenario);
      }

      setScenarios(generatedScenarios);
    } catch (error) {
      console.error("Error generating scenarios:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const nextScenario = () => {
    playClick();
    setCurrentScenario((prev) => (prev + 1) % scenarios.length);
  };

  const prevScenario = () => {
    playClick();
    setCurrentScenario(
      (prev) => (prev - 1 + scenarios.length) % scenarios.length
    );
  };

  const saveScenario = (scenarioId: string) => {
    playSuccess();
    setSavedScenarios((prev) => new Set([...prev, scenarioId]));
  };

  const shareScenario = (scenario: Scenario) => {
    playClick();
    const text = `Legal Scenario: ${scenario.title}\n\nSituation: ${
      scenario.situation
    }\n\nConsequences:\n${scenario.consequences
      .map((c) => `• ${c}`)
      .join("\n")}`;

    if (navigator.share) {
      navigator.share({
        title: scenario.title,
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      // Could show a toast notification here
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4" />;
      case "low":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  if (isGenerating) {
    return (
      <AnimatedCard className={`p-6 ${className}`} loading>
        <div className="text-center">
          <RefreshCw
            className={`h-8 w-8 mx-auto mb-4 ${getAnimationClass(
              "animate-spin"
            )}`}
          />
          <h3 className="text-lg font-semibold mb-2">
            Generating Real-Life Scenarios
          </h3>
          <p className="text-muted-foreground">
            Creating story examples to help you understand the consequences...
          </p>
        </div>
      </AnimatedCard>
    );
  }

  if (scenarios.length === 0) {
    return (
      <AnimatedCard className={`p-6 text-center ${className}`}>
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Scenarios Available</h3>
        <p className="text-muted-foreground mb-4">
          We couldn't generate scenarios for this document. Try analyzing a
          contract or agreement with specific clauses.
        </p>
        <AnimatedButton
          onClick={generateScenarios}
          animation="scale"
          className="mt-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </AnimatedButton>
      </AnimatedCard>
    );
  }

  const scenario = scenarios[currentScenario];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Real-Life Scenarios</h2>
          <Badge variant="outline" className="ml-2">
            {currentScenario + 1} of {scenarios.length}
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <AnimatedButton
            variant="outline"
            size="sm"
            onClick={prevScenario}
            disabled={scenarios.length <= 1}
            animation="scale"
          >
            <ChevronLeft className="h-4 w-4" />
          </AnimatedButton>
          <AnimatedButton
            variant="outline"
            size="sm"
            onClick={nextScenario}
            disabled={scenarios.length <= 1}
            animation="scale"
          >
            <ChevronRight className="h-4 w-4" />
          </AnimatedButton>
        </div>
      </div>

      {/* Scenario Card */}
      <AnimatedCard className="overflow-hidden" animation="fade-up">
        <CardHeader
          className={`${getSeverityColor(scenario.severity)} border-b`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getSeverityIcon(scenario.severity)}
              <CardTitle className="text-lg">{scenario.title}</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <AnimatedButton
                variant="ghost"
                size="sm"
                onClick={() => saveScenario(scenario.id)}
                animation="scale"
                className={
                  savedScenarios.has(scenario.id) ? "text-primary" : ""
                }
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    savedScenarios.has(scenario.id) ? "fill-current" : ""
                  }`}
                />
              </AnimatedButton>
              <AnimatedButton
                variant="ghost"
                size="sm"
                onClick={() => shareScenario(scenario)}
                animation="scale"
              >
                <Share2 className="h-4 w-4" />
              </AnimatedButton>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Situation */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-blue-500" />
              The Situation
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {scenario.situation}
            </p>
          </div>

          <Separator />

          {/* Consequences */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
              What Could Happen
            </h3>
            <ul className="space-y-2">
              {scenario.consequences.map((consequence, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-muted-foreground">{consequence}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Tips */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-green-500" />
              How to Avoid This
            </h3>
            <ul className="space-y-2">
              {scenario.tips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">✓</span>
                  <span className="text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Clause */}
          {scenario.relatedClause && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  Related Contract Text
                </h3>
                <div className="bg-muted p-4 rounded-lg border-l-4 border-primary">
                  <p className="text-sm italic text-muted-foreground">
                    "{scenario.relatedClause}"
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </AnimatedCard>

      {/* Navigation Dots */}
      {scenarios.length > 1 && (
        <div className="flex justify-center space-x-2">
          {scenarios.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                playClick();
                setCurrentScenario(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentScenario
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
