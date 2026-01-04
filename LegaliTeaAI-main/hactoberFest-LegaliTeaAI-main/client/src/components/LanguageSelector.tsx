import React, { useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  useLanguage,
  SUPPORTED_LANGUAGES,
  type Language,
} from "@/constants/languages.ts";

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-9 hover:bg-accent/50 transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">
          {currentLanguage.flag} {currentLanguage.nativeName}
        </span>
        <span className="sm:hidden">{currentLanguage.flag}</span>
        <ChevronDown className="h-3 w-3" />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <Card className="absolute right-0 top-full mt-2 w-64 z-50 shadow-lg border-border bg-card/95 backdrop-blur-sm">
            <CardContent className="p-2">
              <div className="grid gap-1 max-h-64 overflow-y-auto">
                {SUPPORTED_LANGUAGES.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language)}
                    className={`flex items-center gap-3 w-full px-3 py-2 text-left rounded-md transition-all duration-200 hover:bg-accent/50 hover:shadow-sm ${
                      currentLanguage.code === language.code
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-foreground hover:bg-accent/30"
                    }`}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <div className="flex-1">
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-xs text-muted-foreground">
                        {language.name}
                      </div>
                    </div>
                    {currentLanguage.code === language.code && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

// Animated language cycling component for the hero
export const AnimatedLanguageText: React.FC = () => {
  const languages = [
    { text: "English", flag: "🇺🇸" },
    { text: "हिंदी", flag: "🇮🇳" },
    { text: "ಕನ್ನಡ", flag: "🇮🇳" },
    { text: "ગુજરાતી", flag: "🇮🇳" },
    { text: "Español", flag: "🇪🇸" },
    { text: "Français", flag: "🇫🇷" },
    { text: "Deutsch", flag: "🇩🇪" },
    { text: "中文", flag: "🇨🇳" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % languages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex items-center gap-1 text-foreground font-semibold">
      <span className="transition-all duration-500 ease-in-out animate-in slide-in-from-bottom-2">
        {languages[currentIndex].flag}
      </span>
      <span
        key={currentIndex}
        className="inline-block transition-all duration-500 ease-in-out animate-in slide-in-from-bottom-2"
      >
        {languages[currentIndex].text}
      </span>
    </span>
  );
};
