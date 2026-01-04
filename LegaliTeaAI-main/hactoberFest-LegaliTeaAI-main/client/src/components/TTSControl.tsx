import React, { useState } from "react";
import { Volume2, VolumeX, Play, Pause, Square, Loader2 } from "lucide-react";
import { AnimatedButton } from "./ui/animated-button";
import { useTextToSpeech } from "@/services/textToSpeech";
import { cn } from "@/lib/utils";

interface TTSControlProps {
  text?: string;
  summary?: { tldr: string; keyPoints: string[] };
  keyPoints?: string[];
  risks?: Array<{ clause: string; risk: string; explanation: string }>;
  actionPlan?: Array<{ task: string; priority: string }>;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "ghost" | "outline" | "default";
  showLabel?: boolean;
}

export const TTSControl: React.FC<TTSControlProps> = ({
  text,
  summary,
  keyPoints,
  risks,
  actionPlan,
  className = "",
  size = "sm",
  variant = "ghost",
  showLabel = false,
}) => {
  const {
    isPlaying,
    isPaused,
    speak,
    speakSummary,
    speakKeyPoints,
    speakRisks,
    speakActionPlan,
    pause,
    resume,
    stop,
    settings,
  } = useTextToSpeech();

  const [isLoading, setIsLoading] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const handleSpeak = async () => {
    if (!settings.enabled) return;

    try {
      setIsLoading(true);

      if (isPlaying && currentlyPlaying === getContentId()) {
        if (isPaused) {
          resume();
        } else {
          pause();
        }
        return;
      }

      // Stop any current speech
      if (isPlaying) {
        stop();
      }

      setCurrentlyPlaying(getContentId());

      // Determine what to speak based on props
      if (summary) {
        await speakSummary(summary);
      } else if (keyPoints) {
        await speakKeyPoints(keyPoints);
      } else if (risks) {
        await speakRisks(risks);
      } else if (actionPlan) {
        await speakActionPlan(actionPlan);
      } else if (text) {
        await speak(text);
      }
    } catch (error) {
      console.error("TTS error:", error);
    } finally {
      setIsLoading(false);
      setCurrentlyPlaying(null);
    }
  };

  const handleStop = () => {
    stop();
    setCurrentlyPlaying(null);
  };

  const getContentId = (): string => {
    if (summary) return `summary-${summary.tldr.slice(0, 20)}`;
    if (keyPoints) return `keypoints-${keyPoints.length}`;
    if (risks) return `risks-${risks.length}`;
    if (actionPlan) return `actions-${actionPlan.length}`;
    if (text) return `text-${text.slice(0, 20)}`;
    return "unknown";
  };

  const isCurrentlyPlaying = currentlyPlaying === getContentId() && isPlaying;
  const hasContent = !!(text || summary || keyPoints || risks || actionPlan);

  if (!settings.enabled || !hasContent) {
    return null;
  }

  const getIcon = () => {
    if (isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    if (isCurrentlyPlaying) {
      if (isPaused) {
        return <Play className="h-4 w-4" />;
      }
      return <Pause className="h-4 w-4" />;
    }

    return <Volume2 className="h-4 w-4" />;
  };

  const getTooltip = () => {
    if (isCurrentlyPlaying) {
      return isPaused ? "Resume reading" : "Pause reading";
    }
    return "Read aloud";
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <AnimatedButton
        variant={variant}
        size={size}
        animation="scale"
        onClick={handleSpeak}
        disabled={isLoading}
        title={getTooltip()}
        className={cn(
          "transition-colors duration-200",
          isCurrentlyPlaying && "text-primary"
        )}
      >
        {getIcon()}
        {showLabel && (
          <span className="ml-2 text-sm">
            {isCurrentlyPlaying ? (isPaused ? "Resume" : "Pause") : "Listen"}
          </span>
        )}
      </AnimatedButton>

      {isCurrentlyPlaying && (
        <AnimatedButton
          variant="ghost"
          size={size}
          animation="scale"
          onClick={handleStop}
          title="Stop reading"
        >
          <Square className="h-4 w-4" />
        </AnimatedButton>
      )}
    </div>
  );
};

// Specialized components for different content types
export const TTSSummaryControl: React.FC<{
  summary: { tldr: string; keyPoints: string[] };
  className?: string;
}> = ({ summary, className }) => (
  <TTSControl summary={summary} className={className} />
);

export const TTSKeyPointsControl: React.FC<{
  keyPoints: string[];
  className?: string;
}> = ({ keyPoints, className }) => (
  <TTSControl keyPoints={keyPoints} className={className} />
);

export const TTSRisksControl: React.FC<{
  risks: Array<{ clause: string; risk: string; explanation: string }>;
  className?: string;
}> = ({ risks, className }) => (
  <TTSControl risks={risks} className={className} />
);

export const TTSActionPlanControl: React.FC<{
  actionPlan: Array<{ task: string; priority: string }>;
  className?: string;
}> = ({ actionPlan, className }) => (
  <TTSControl actionPlan={actionPlan} className={className} />
);

export const TTSTextControl: React.FC<{
  text: string;
  className?: string;
  showLabel?: boolean;
}> = ({ text, className, showLabel }) => (
  <TTSControl text={text} className={className} showLabel={showLabel} />
);
