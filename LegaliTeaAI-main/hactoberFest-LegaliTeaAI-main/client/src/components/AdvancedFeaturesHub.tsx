import React, { useState, useEffect } from "react";
import {
  FileText,
  BookOpen,
  Map,
  Lightbulb,
  Trophy,
  Search,
  ChevronRight,
  Star,
  Zap,
  Target,
  Brain,
  Eye,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AnimatedCard, StaggeredCards } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useAudioFeedback } from "@/services/audioFeedback";
import { useAnimations } from "@/hooks/useAnimations";

// Import feature components
import { ClauseSimplification } from "./ClauseSimplification";
import { TermExplanation } from "./TermExplanation";
import { VisualContractMap } from "./VisualContractMap";
import { ScenarioGenerator } from "./ScenarioGenerator";
import { GamifiedLearning } from "./GamifiedLearning";
import { LegalGlossary } from "./LegalGlossary";

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: "analysis" | "learning" | "visualization" | "reference";
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  benefits: string[];
  isNew?: boolean;
  isPopular?: boolean;
}

interface AdvancedFeaturesHubProps {
  analysisResult: any;
  originalText: string;
  className?: string;
}

export const AdvancedFeaturesHub: React.FC<AdvancedFeaturesHubProps> = ({
  analysisResult,
  originalText,
  className = "",
}) => {
  const [activeFeature, setActiveFeature] = useState<string>("overview");
  const [completedFeatures, setCompletedFeatures] = useState<Set<string>>(
    new Set()
  );
  const [favoriteFeatures, setFavoriteFeatures] = useState<Set<string>>(
    new Set()
  );
  const [userProgress, setUserProgress] = useState({
    totalFeaturesUsed: 0,
    timeSpent: 0,
    achievementsUnlocked: 0,
    level: 1,
  });

  const { playClick, playSuccess } = useAudioFeedback();
  const { getAnimationClass } = useAnimations();

  // Available features (fully functional)
  const availableFeatures: FeatureCard[] = [
    
    
    {
      id: "legal-glossary",
      title: "Legal Glossary",
      description:
        "Browse a comprehensive dictionary of terms found in your document",
      icon: <BookOpen className="h-6 w-6" />,
      category: "reference",
      difficulty: "beginner",
      estimatedTime: "5-15 min",
      benefits: [
        "Comprehensive term definitions",
        "Document-specific glossary",
        "Export and share capabilities",
      ],
    },
    {
      id: "scenario-generator",
      title: "Real-Life Scenarios",
      description:
        'Explore "what if" situations with AI-generated story examples',
      icon: <Lightbulb className="h-6 w-6" />,
      category: "learning",
      difficulty: "intermediate",
      estimatedTime: "10-20 min",
      benefits: [
        "Understand consequences through stories",
        "Learn from real-world examples",
        "Better risk assessment",
      ],
      isPopular: true,
    },
    {
      id: "gamified-learning",
      title: "Legal Learning Game",
      description: "Test your knowledge with quizzes and earn achievements",
      icon: <Trophy className="h-6 w-6" />,
      category: "learning",
      difficulty: "beginner",
      estimatedTime: "15-30 min",
      benefits: [
        "Learn through interactive quizzes",
        "Earn points and achievements",
        "Track your progress",
      ],
      isPopular: true,
    },
  ];

  // Coming soon features (future implementation)
  const comingSoonFeatures: FeatureCard[] = [
    {
      id: "term-explanation",
      title: "Smart Term Lookup",
      description:
        "Click any legal term for instant, context-aware definitions",
      icon: <Search className="h-6 w-6" />,
      category: "reference",
      difficulty: "beginner",
      estimatedTime: "2-5 min",
      benefits: [
        "Instant definitions for legal terms",
        "Context-aware explanations",
        "Multi-language support",
      ],
      isNew: true,
    },
    {
      id: "clause-simplification",
      title: "Clause Simplification",
      description:
        "See complex legal text side-by-side with plain English explanations",
      icon: <FileText className="h-6 w-6" />,
      category: "analysis",
      difficulty: "beginner",
      estimatedTime: "5-10 min",
      benefits: [
        "Understand complex clauses instantly",
        "Compare original vs simplified text",
        "Navigate through document sections easily",
      ],
      isPopular: true,
    },
    {
      id: "visual-contract-map",
      title: "Visual Contract Map",
      description:
        "Transform your contract into an interactive flowchart showing relationships",
      icon: <Map className="h-6 w-6" />,
      category: "visualization",
      difficulty: "intermediate",
      estimatedTime: "10-15 min",
      benefits: [
        "See contract structure visually",
        "Understand party relationships",
        "Track deadlines and obligations",
      ],
      isNew: true,
    },
    
  ];

  // Combine features based on selected category
  const features = [...availableFeatures, ...comingSoonFeatures];

  const categories = [
    { id: "all", label: "All Features", icon: <Star className="h-4 w-4" /> },
    { id: "analysis", label: "Analysis", icon: <Eye className="h-4 w-4" /> },
    { id: "learning", label: "Learning", icon: <Brain className="h-4 w-4" /> },
    { id: "visualization", label: "Visual", icon: <Map className="h-4 w-4" /> },
    {
      id: "reference",
      label: "Reference",
      icon: <BookOpen className="h-4 w-4" />,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFeatures = features.filter(
    (feature) =>
      selectedCategory === "all" || feature.category === selectedCategory
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "analysis":
        return "bg-blue-100 text-blue-800";
      case "learning":
        return "bg-purple-100 text-purple-800";
      case "visualization":
        return "bg-green-100 text-green-800";
      case "reference":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleFeatureSelect = (featureId: string) => {
    playClick();
    setActiveFeature(featureId);

    // Mark as used
    setCompletedFeatures((prev) => new Set([...prev, featureId]));

    // Update progress
    setUserProgress((prev) => ({
      ...prev,
      totalFeaturesUsed:
        prev.totalFeaturesUsed + (completedFeatures.has(featureId) ? 0 : 1),
    }));
  };

  const toggleFavorite = (featureId: string) => {
    playSuccess();
    setFavoriteFeatures((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(featureId)) {
        newFavorites.delete(featureId);
      } else {
        newFavorites.add(featureId);
      }
      return newFavorites;
    });
  };

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case "clause-simplification":
        return (
          <ClauseSimplification
            analysisResult={analysisResult}
            originalText={originalText}
          />
        );
      case "term-explanation":
        return (
          <TermExplanation
            analysisResult={analysisResult}
            originalText={originalText}
          />
        );
      case "visual-contract-map":
        return (
          <VisualContractMap
            analysisResult={analysisResult}
            originalText={originalText}
          />
        );
      case "scenario-generator":
        return (
          <ScenarioGenerator
            analysisResult={analysisResult}
            originalText={originalText}
          />
        );
      case "gamified-learning":
        return (
          <GamifiedLearning
            analysisResult={analysisResult}
            originalText={originalText}
          />
        );
      case "legal-glossary":
        return (
          <LegalGlossary
            analysisResult={analysisResult}
            originalText={originalText}
          />
        );
      default:
        return null;
    }
  };

  if (activeFeature !== "overview") {
    return (
      <div className={`space-y-4 ${className}`}>
        {/* Back Navigation */}
        <div className="flex items-center space-x-2">
          <AnimatedButton
            variant="ghost"
            size="sm"
            onClick={() => {
              playClick();
              setActiveFeature("overview");
            }}
            animation="scale"
          >
            ← Back to Features
          </AnimatedButton>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center space-x-2">
            {features.find((f) => f.id === activeFeature)?.icon}
            <span className="font-medium">
              {features.find((f) => f.id === activeFeature)?.title}
            </span>
          </div>
        </div>

        {/* Feature Content */}
        <div className={getAnimationClass("animate-fade-in")}>
          {renderFeatureContent()}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <AnimatedCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Advanced Legal Features</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Unlock powerful tools to understand your document better
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {userProgress.totalFeaturesUsed}
                </div>
                <div className="text-muted-foreground">Features Used</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {completedFeatures.size}
                </div>
                <div className="text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {favoriteFeatures.size}
                </div>
                <div className="text-muted-foreground">Favorites</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </AnimatedCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnimatedCard className="text-center p-4">
          <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
          <div className="text-2xl font-bold">{features.length}</div>
          <div className="text-sm text-muted-foreground">Available Tools</div>
        </AnimatedCard>
        <AnimatedCard className="text-center p-4">
          <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
          <div className="text-2xl font-bold">
            {features.filter((f) => f.category === "learning").length}
          </div>
          <div className="text-sm text-muted-foreground">Learning Tools</div>
        </AnimatedCard>
        <AnimatedCard className="text-center p-4">
          <Eye className="h-8 w-8 mx-auto mb-2 text-green-500" />
          <div className="text-2xl font-bold">
            {features.filter((f) => f.category === "analysis").length}
          </div>
          <div className="text-sm text-muted-foreground">Analysis Tools</div>
        </AnimatedCard>
        <AnimatedCard className="text-center p-4">
          <BookOpen className="h-8 w-8 mx-auto mb-2 text-orange-500" />
          <div className="text-2xl font-bold">
            {features.filter((f) => f.category === "reference").length}
          </div>
          <div className="text-sm text-muted-foreground">Reference Tools</div>
        </AnimatedCard>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <AnimatedButton
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => {
              playClick();
              setSelectedCategory(category.id);
            }}
            animation="scale"
            className="flex items-center space-x-2"
          >
            {category.icon}
            <span>{category.label}</span>
          </AnimatedButton>
        ))}
      </div>

      {/* Features Grid */}
      <StaggeredCards className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeatures.map((feature) => (
          <AnimatedCard
            key={feature.id}
            animation="hover-lift"
            className={`${
              comingSoonFeatures.some(f => f.id === feature.id)
                ? "cursor-not-allowed opacity-75"
                : "cursor-pointer"
            } group relative overflow-hidden`}
            onClick={() => {
              if (!comingSoonFeatures.some(f => f.id === feature.id)) {
                handleFeatureSelect(feature.id);
              }
            }}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${getCategoryColor(
                      feature.category
                    )}`}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        className={getDifficultyColor(feature.difficulty)}
                        variant="outline"
                      >
                        {feature.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {feature.estimatedTime}
                      </Badge>
                      {/* Coming Soon Badge */}
                      {comingSoonFeatures.some(f => f.id === feature.id) && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(feature.id);
                    }}
                    className="p-1 rounded hover:bg-muted transition-colors"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        favoriteFeatures.has(feature.id)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                  {completedFeatures.has(feature.id) && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                {feature.description}
              </p>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">Benefits:</h4>
                  <ul className="space-y-1">
                    {feature.benefits.slice(0, 2).map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-2 text-xs text-muted-foreground"
                      >
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    {feature.isNew && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        New
                      </Badge>
                    )}
                    {feature.isPopular && (
                      <Badge className="bg-orange-100 text-orange-800 text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </CardContent>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </AnimatedCard>
        ))}
      </StaggeredCards>

      {/* Getting Started Tips */}
      <AnimatedCard>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <span>Getting Started Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-green-600">
                For Beginners
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">1.</span>
                  <span>
                    Start with <strong>Smart Term Lookup</strong> to understand
                    key terms
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">2.</span>
                  <span>
                    Try <strong>Clause Simplification</strong> for plain English
                    explanations
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">3.</span>
                  <span>
                    Use the <strong>Legal Glossary</strong> as your reference
                    guide
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-blue-600">
                For Advanced Users
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">1.</span>
                  <span>
                    Explore <strong>Visual Contract Maps</strong> for
                    relationship analysis
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">2.</span>
                  <span>
                    Generate <strong>Real-Life Scenarios</strong> for risk
                    assessment
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-0.5">3.</span>
                  <span>
                    Test knowledge with <strong>Legal Learning Game</strong>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Coming Soon Features */}
      {comingSoonFeatures.length > 0 && (
        <AnimatedCard className="border-2 border-dashed border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-purple-700">
              <Zap className="h-5 w-5" />
              <span>Coming Soon</span>
            </CardTitle>
            <CardDescription className="text-purple-600">
              These exciting features are currently in development and will be available in future updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comingSoonFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="p-4 bg-white/50 rounded-lg border border-purple-200 opacity-75"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${getCategoryColor(feature.category)}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-800">{feature.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className="bg-purple-100 text-purple-700 text-xs">
                          {feature.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {feature.estimatedTime}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-purple-600 mb-3">
                    {feature.description}
                  </p>
                  <div className="text-xs text-purple-500">
                    <strong>Benefits:</strong>
                    <ul className="mt-1 space-y-1">
                      {feature.benefits.slice(0, 2).map((benefit, index) => (
                        <li key={index} className="flex items-start space-x-1">
                          <span className="text-purple-400 mt-0.5">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </AnimatedCard>
      )}
    </div>
  );
};
