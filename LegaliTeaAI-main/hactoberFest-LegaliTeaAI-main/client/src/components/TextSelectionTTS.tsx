import React, { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";
import { AnimatedButton } from "./ui/animated-button";
import { useTextToSpeech } from "@/services/textToSpeech";
import { cn } from "@/lib/utils";

interface TextSelectionTTSProps {
  className?: string;
}

export const TextSelectionTTS: React.FC<TextSelectionTTSProps> = ({
  className = "",
}) => {
  const [selectedText, setSelectedText] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const { speak, settings } = useTextToSpeech();

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || "";

      if (text && text.length > 10) {
        // Only show for meaningful selections
        setSelectedText(text);

        // Get selection position
        const range = selection?.getRangeAt(0);
        if (range) {
          const rect = range.getBoundingClientRect();
          setButtonPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 40, // Position above selection
          });
          setShowButton(true);
        }
      } else {
        setShowButton(false);
        setSelectedText("");
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        // Hide button and clear selection if clicking outside of the button and its container
        if (
          buttonRef.current &&
          !buttonRef.current.contains(target) &&
          !target.closest(".text-selection-tts") &&
          !target.closest(".text-selection-tts *")
        ) {
          setShowButton(false);
          setSelectedText("");
        }
      };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSpeak = async () => {
    if (selectedText && settings.enabled) {
      await speak(selectedText);
      // Do NOT hide button or clear selection here. The button should remain visible until user clicks outside.
    }
  };

  const buttonRef = React.useRef<HTMLButtonElement>(null);

  if (!showButton || !settings.enabled) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed z-50 text-selection-tts",
        "animate-fade-in-up",
        className
      )}
      style={{
        left: `${buttonPosition.x}px`,
        top: `${buttonPosition.y}px`,
        transform: "translateX(-50%)",
      }}
    >
      <AnimatedButton
        ref={buttonRef}
        variant="default"
        size="sm"
        onClick={handleSpeak}
        className="shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
        title={`Read selected text: "${selectedText.slice(0, 50)}${
          selectedText.length > 50 ? "..." : ""
        }"`}
      >
        <Volume2 className="h-4 w-4 mr-2" />
        Read Selection
      </AnimatedButton>
    </div>
  );
};
