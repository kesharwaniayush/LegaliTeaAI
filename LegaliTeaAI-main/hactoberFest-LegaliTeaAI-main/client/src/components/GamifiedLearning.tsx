import React, { useState, useEffect } from "react";
import {
  Trophy,
  Star,
  Target,
  BookOpen,
  Brain,
  Award,
  Zap,
  CheckCircle,
  XCircle,
  RotateCcw,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { useAudioFeedback } from "@/services/audioFeedback";
import { useAnimations } from "@/hooks/useAnimations";

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  category: "terms" | "clauses" | "consequences" | "general";
  points: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface UserProgress {
  totalPoints: number;
  level: number;
  streak: number;
  correctAnswers: number;
  totalAnswers: number;
  achievements: Achievement[];
}

interface GamifiedLearningProps {
  analysisResult: any;
  originalText: string;
  className?: string;
}

export const GamifiedLearning: React.FC<GamifiedLearningProps> = ({
  analysisResult,
  originalText,
  className = "",
}) => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 0,
    level: 1,
    streak: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    achievements: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(
    null
  );

  const { playClick, playSuccess, playError, playCompletion } =
    useAudioFeedback();
  const { getAnimationClass } = useAnimations();

  // Initialize achievements
  useEffect(() => {
    const initialAchievements: Achievement[] = [
      {
        id: "first-quiz",
        title: "Legal Rookie",
        description: "Complete your first quiz",
        icon: <BookOpen className="h-6 w-6" />,
        unlocked: false,
        progress: 0,
        maxProgress: 1,
        rarity: "common",
      },
      {
        id: "streak-5",
        title: "On Fire!",
        description: "Get 5 questions correct in a row",
        icon: <Zap className="h-6 w-6" />,
        unlocked: false,
        progress: 0,
        maxProgress: 5,
        rarity: "rare",
      },
      {
        id: "points-100",
        title: "Century Club",
        description: "Earn 100 points",
        icon: <Trophy className="h-6 w-6" />,
        unlocked: false,
        progress: 0,
        maxProgress: 100,
        rarity: "epic",
      },
    ];

    setUserProgress((prev) => ({
      ...prev,
      achievements: initialAchievements,
    }));
  }, []);

  // Generate quizzes based on analysis
  useEffect(() => {
    if (analysisResult && originalText) {
      generateQuizzes();
    }
  }, [analysisResult, originalText]);

  const generateQuizzes = async () => {
    setIsGenerating(true);

    try {
      const generatedQuizzes: Quiz[] = [];

      // Generate term definition quizzes
      const riskClauses = analysisResult.riskAssessment?.redFlags || [];

      // Quiz 1: Legal term definition
      generatedQuizzes.push({
        id: "term-1",
        question: 'What does "indemnify" mean in legal terms?',
        options: [
          "To cancel a contract",
          "To protect someone from legal responsibility for damages",
          "To negotiate better terms",
          "To review a document",
        ],
        correctAnswer: 1,
        explanation:
          "Indemnify means to compensate someone for harm or loss, or to protect them from legal responsibility for damages.",
        difficulty: "medium",
        category: "terms",
        points: 15,
      });

      setQuizzes(generatedQuizzes);
      if (generatedQuizzes.length > 0) {
        setCurrentQuiz(generatedQuizzes[0]);
      }
    } catch (error) {
      console.error("Error generating quizzes:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;

    playClick();
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentQuiz) return;

    const correct = selectedAnswer === currentQuiz.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    // Update progress
    const newProgress = { ...userProgress };
    newProgress.totalAnswers += 1;

    if (correct) {
      playSuccess();
      newProgress.correctAnswers += 1;
      newProgress.totalPoints += currentQuiz.points;
      newProgress.streak += 1;
    } else {
      playError();
      newProgress.streak = 0;
    }

    // Calculate level (every 50 points = 1 level)
    newProgress.level = Math.floor(newProgress.totalPoints / 50) + 1;

    setUserProgress(newProgress);
  };

  const nextQuiz = () => {
    if (!currentQuiz) return;

    const currentIndex = quizzes.findIndex((q) => q.id === currentQuiz.id);
    const nextIndex = (currentIndex + 1) % quizzes.length;

    setCurrentQuiz(quizzes[nextIndex]);
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const resetQuiz = () => {
    playClick();
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  if (isGenerating) {
    return (
      <AnimatedCard className={`p-6 ${className}`} loading>
        <div className="text-center">
          <Brain
            className={`h-8 w-8 mx-auto mb-4 ${getAnimationClass(
              "animate-pulse"
            )}`}
          />
          <h3 className="text-lg font-semibold mb-2">
            Generating Learning Quizzes
          </h3>
          <p className="text-muted-foreground">
            Creating personalized questions based on your document...
          </p>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Header */}
      <AnimatedCard>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <div>
                <CardTitle>Legal Learning Challenge</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Level {userProgress.level} • {userProgress.totalPoints} points
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {userProgress.correctAnswers}
              </div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {userProgress.streak}
              </div>
              <div className="text-sm text-muted-foreground">Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {userProgress.totalAnswers > 0
                  ? Math.round(
                      (userProgress.correctAnswers /
                        userProgress.totalAnswers) *
                        100
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {userProgress.achievements.filter((a) => a.unlocked).length}
              </div>
              <div className="text-sm text-muted-foreground">Badges</div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level {userProgress.level}</span>
              <span>{userProgress.totalPoints % 50}/50 XP</span>
            </div>
            <Progress
              value={(userProgress.totalPoints % 50) * 2}
              className="h-2"
            />
          </div>
        </CardContent>
      </AnimatedCard>

      {/* Quiz Section */}
      {currentQuiz && (
        <AnimatedCard>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>Quiz Time!</CardTitle>
                <Badge variant="outline">{currentQuiz.points} pts</Badge>
              </div>
              <AnimatedButton
                variant="ghost"
                size="sm"
                onClick={resetQuiz}
                animation="scale"
              >
                <RotateCcw className="h-4 w-4" />
              </AnimatedButton>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {currentQuiz.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`
                      w-full p-4 text-left rounded-lg border-2 transition-all duration-200
                      ${
                        selectedAnswer === index
                          ? showResult
                            ? index === currentQuiz.correctAnswer
                              ? "border-green-500 bg-green-50 text-green-800"
                              : "border-red-500 bg-red-50 text-red-800"
                            : "border-primary bg-primary/10"
                          : showResult && index === currentQuiz.correctAnswer
                          ? "border-green-500 bg-green-50 text-green-800"
                          : "border-border hover:border-primary/50 hover:bg-accent/50"
                      }
                      ${showResult ? "cursor-default" : "cursor-pointer"}
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold
                        ${
                          selectedAnswer === index
                            ? showResult
                              ? index === currentQuiz.correctAnswer
                                ? "border-green-500 bg-green-500 text-white"
                                : "border-red-500 bg-red-500 text-white"
                              : "border-primary bg-primary text-white"
                            : showResult && index === currentQuiz.correctAnswer
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-muted-foreground"
                        }
                      `}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span>{option}</span>
                      {showResult &&
                        selectedAnswer === index &&
                        (index === currentQuiz.correctAnswer ? (
                          <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 ml-auto" />
                        ))}
                      {showResult &&
                        selectedAnswer !== index &&
                        index === currentQuiz.correctAnswer && (
                          <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                        )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit/Next Button */}
            <div className="flex justify-center">
              {!showResult ? (
                <AnimatedButton
                  onClick={submitAnswer}
                  disabled={selectedAnswer === null}
                  animation="scale"
                  className="px-8"
                >
                  Submit Answer
                </AnimatedButton>
              ) : (
                <AnimatedButton
                  onClick={nextQuiz}
                  animation="scale"
                  className="px-8"
                >
                  Next Question
                </AnimatedButton>
              )}
            </div>

            {/* Explanation */}
            {showResult && (
              <AnimatedCard
                className={`${
                  isCorrect
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500 mt-0.5" />
                    )}
                    <div>
                      <h4
                        className={`font-semibold mb-2 ${
                          isCorrect ? "text-green-800" : "text-red-800"
                        }`}
                      >
                        {isCorrect ? "Correct!" : "Not quite right"}
                      </h4>
                      <p
                        className={`text-sm ${
                          isCorrect ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {currentQuiz.explanation}
                      </p>
                      {isCorrect && (
                        <div className="mt-2 flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium text-green-700">
                            +{currentQuiz.points} points earned!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </AnimatedCard>
            )}
          </CardContent>
        </AnimatedCard>
      )}
    </div>
  );
};
