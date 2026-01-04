import React, { useEffect, useState } from "react";
import {
  Loader2,
  FileText,
  Brain,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/stores/appStore";
import { useProcessingMessage } from "@/stores/selectors";

// Animated typing text component
const AnimatedText: React.FC<{ text: string; delay?: number }> = ({
  text,
  delay = 0,
}) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        if (currentIndex < text.length) {
          const timeout = setTimeout(() => {
            setDisplayText((prev) => prev + text[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          }, 50);
          return () => clearTimeout(timeout);
        }
      }, delay);
      return () => clearTimeout(timer);
    } else {
      if (currentIndex < text.length) {
        const timeout = setTimeout(() => {
          setDisplayText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, 50);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentIndex, text, delay]);

  return (
    <span className="inline-block">
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse text-primary">|</span>
      )}
    </span>
  );
};

// Rotating messages component
const RotatingMessages: React.FC = () => {
  const messages = [
    "🔍 Scanning your document for key insights...",
    "🧠 Our AI is analyzing complex legal language...",
    "⚡ Identifying potential risks and opportunities...",
    "📊 Extracting actionable recommendations...",
    "✨ Translating legalese into plain English...",
    "🎯 Finding the most important clauses...",
    "🚀 Preparing your comprehensive analysis...",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="h-6 flex items-center justify-center">
      <AnimatedText text={messages[currentMessageIndex]} />
    </div>
  );
};

export const ProcessingPage: React.FC = () => {
  const { processingStage, progress } = useAppStore();
  const message = useProcessingMessage();
  const [pulseIntensity, setPulseIntensity] = useState(1);
  const [showRoundLoader, setShowRoundLoader] = useState(false);

  // Create dynamic pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIntensity((prev) => (prev === 1 ? 1.2 : 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Show round loader after a delay
  useEffect(() => {
    const timer = setTimeout(() => setShowRoundLoader(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Circular progress indicator component
  const CircularProgress: React.FC<{
    progress: number;
    size?: number;
    strokeWidth?: number;
  }> = ({ progress, size = 120, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-muted/20"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-out"
            style={{
              filter: "drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))",
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 bg-primary/20 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  };

  const getStageIcon = () => {
    switch (processingStage) {
      case "extract":
        return (
          <div className="relative">
            <div className="relative">
              <FileText className="h-12 w-12 text-blue-500 animate-pulse" />
              <div className="absolute -top-1 -right-1">
                <div className="w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
            {showRoundLoader && (
              <div className="mt-4">
                <CircularProgress
                  progress={progress}
                  size={80}
                  strokeWidth={6}
                />
              </div>
            )}
          </div>
        );
      case "analyze":
        return (
          <div className="relative">
            <div className="relative">
              <Brain
                className="h-12 w-12 text-purple-500 animate-pulse"
                style={{ transform: `scale(${pulseIntensity})` }}
              />
              <div className="absolute inset-0 bg-purple-400 rounded-full animate-ping opacity-20"></div>
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-bounce" />
            </div>
            <div className="mt-4">
              <CircularProgress progress={progress} size={80} strokeWidth={6} />
            </div>
          </div>
        );
      case "complete":
        return (
          <div className="relative">
            <div className="relative">
              <CheckCircle2 className="h-12 w-12 text-green-500 animate-bounce" />
              <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-30"></div>
            </div>
            <div className="mt-4">
              <CircularProgress progress={100} size={80} strokeWidth={6} />
            </div>
          </div>
        );
      default:
        return (
          <div className="relative">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
              <div className="absolute inset-0 border-4 border-amber-200 rounded-full animate-pulse opacity-50"></div>
            </div>
            <div className="mt-4">
              <CircularProgress progress={progress} size={80} strokeWidth={6} />
            </div>
          </div>
        );
    }
  };

  const getTimeEstimate = () => {
    switch (processingStage) {
      case "extract":
        return "This usually takes 15-30 seconds";
      case "analyze":
        return "This usually takes 30-60 seconds";
      default:
        return "Please wait...";
    }
  };

  const getEducationalTip = () => {
    const tips = [
      "Our AI is trained on thousands of legal documents to provide accurate analysis.",
      "We focus on identifying key terms, risks, and actionable next steps.",
      "The analysis includes confidence scores to help you understand reliability.",
      "Complex legal language is translated into plain English for better understanding.",
      "We highlight potential red flags that might need your attention.",
    ];

    // Rotate tips based on processing stage
    const tipIndex =
      processingStage === "extract" ? 0 : processingStage === "analyze" ? 1 : 2;
    return tips[tipIndex] || tips[0];
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-30"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-20"></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-green-400 rounded-full animate-bounce opacity-25"></div>
        <div className="absolute bottom-10 right-10 w-4 h-4 bg-yellow-400 rounded-full animate-pulse opacity-15"></div>
      </div>

      <Card className="relative backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 border-2 border-gradient-to-r from-blue-200 via-purple-200 to-green-200 dark:from-blue-800 dark:via-purple-800 dark:to-green-800">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-6">
            {/* Engaging rotating messages */}
            <RotatingMessages />

            {/* Enhanced Processing Steps */}
            <div className="flex justify-center space-x-12 text-sm">
              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-700 ${
                    processingStage === "extract"
                      ? "bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 shadow-lg shadow-blue-500/30"
                      : progress > 50
                      ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                      : "bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <FileText
                    className={`h-6 w-6 transition-all duration-500 ${
                      processingStage === "extract"
                        ? "text-blue-600 dark:text-blue-400 animate-bounce"
                        : progress > 50
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  {processingStage === "extract" && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                  )}
                </div>
                <span
                  className={`font-semibold transition-all duration-500 ${
                    processingStage === "extract"
                      ? "text-blue-600 dark:text-blue-400"
                      : progress > 50
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  Reading
                </span>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-700 ${
                    processingStage === "analyze"
                      ? "bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500 shadow-lg shadow-purple-500/30"
                      : progress >= 100
                      ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500"
                      : "bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <Brain
                    className={`h-6 w-6 transition-all duration-500 ${
                      processingStage === "analyze"
                        ? "text-purple-600 dark:text-purple-400 animate-pulse"
                        : progress >= 100
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  {processingStage === "analyze" && (
                    <>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full animate-ping"></div>
                      <Sparkles className="absolute -bottom-1 -left-1 h-4 w-4 text-yellow-400 animate-spin" />
                    </>
                  )}
                </div>
                <span
                  className={`font-semibold transition-all duration-500 ${
                    processingStage === "analyze"
                      ? "text-purple-600 dark:text-purple-400"
                      : progress >= 100
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  Analyzing
                </span>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-700 ${
                    processingStage === "complete"
                      ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-500 shadow-lg shadow-green-500/30"
                      : "bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600"
                  }`}
                >
                  <CheckCircle2
                    className={`h-6 w-6 transition-all duration-500 ${
                      processingStage === "complete"
                        ? "text-green-600 dark:text-green-400 animate-bounce"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  />
                  {processingStage === "complete" && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                  )}
                </div>
                <span
                  className={`font-semibold transition-all duration-500 ${
                    processingStage === "complete"
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                >
                  Complete
                </span>
              </div>
            </div>

            {/* Enhanced Educational Content */}
            <div className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6 max-w-lg mx-auto shadow-lg">
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-white text-sm font-bold">💡</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1">
                    Did you know?
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                    {getEducationalTip()}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Confidence Building with More Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs max-w-lg mx-auto">
              <div className="flex flex-col items-center space-y-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800 transition-all duration-300 hover:scale-105">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400 animate-pulse" />
                </div>
                <p className="text-center text-green-700 dark:text-green-300 font-medium">
                  Secure Processing
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 transition-all duration-300 hover:scale-105">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                  <Brain className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
                </div>
                <p className="text-center text-blue-700 dark:text-blue-300 font-medium">
                  AI-Powered Analysis
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800 transition-all duration-300 hover:scale-105">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                  <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
                </div>
                <p className="text-center text-purple-700 dark:text-purple-300 font-medium">
                  Lightning Fast
                </p>
              </div>
            </div>

            {/* Additional animated elements */}
            <div className="flex justify-center items-center space-x-8 mt-6">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4 text-blue-500 animate-pulse" />
                <span></span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4 text-green-500 animate-bounce" />
                <span>Analyzing</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4 text-yellow-500 animate-spin" />
                <span>Optimizing</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
