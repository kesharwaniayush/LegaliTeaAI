import React, { useState } from "react";
import {translations, SUPPORTED_LANGUAGES, LanguageContext} from "@/constants/languages";

export type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    SUPPORTED_LANGUAGES[0]
  );

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem("legalitea-language", language.code);
  };

  const t = (key: string): string => {
    return (
      translations[currentLanguage.code]?.[key] || translations.en[key] || key
    );
  };

  // Load saved language on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem("legalitea-language");
    if (savedLanguage) {
      const language = SUPPORTED_LANGUAGES.find(
        (lang) => lang.code === savedLanguage
      );
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
