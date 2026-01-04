import { createContext, useContext } from "react";



interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);


export type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
};



export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
];

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Translations object
export const translations: Record<string, Record<string, string>> = {
  en: {
    "app.title": "LegaliTea",
    "app.subtitle": "Understand any legal document in plain English",
    "upload.title": "Choose how to add your document",
    "upload.description":
      "We support PDF and Word documents, or you can paste text directly",
    "upload.dragDrop": "Drop your contract here",
    "upload.browse": "Browse Files",
    "upload.pasteText": "Paste Text",
    "upload.private": "Your document stays private and secure",
    "processing.reading": "Reading your document...",
    "processing.analyzing": "Analyzing with AI...",
    "results.title": "Analysis Results",
    "results.whatThisMeans": "What This Means",
    "results.importantStuff": "Important Stuff",
    "results.watchOutFor": "Watch Out For",
    "results.whatYouShouldDo": "What You Should Do",
    "disclaimer.text":
      "LegaliTea provides educational guidance, not legal advice. Consult an attorney for serious matters.",
  },
  hi: {
    "app.title": "लीगलीटी",
    "app.subtitle": "किसी भी कानूनी दस्तावेज़ को सरल हिंदी में समझें",
    "upload.title": "अपना दस्तावेज़ जोड़ने का तरीका चुनें",
    "upload.description":
      "हम PDF और Word दस्तावेज़ों का समर्थन करते हैं, या आप सीधे टेक्स्ट पेस्ट कर सकते हैं",
    "upload.dragDrop": "अपना अनुबंध यहाँ छोड़ें",
    "upload.browse": "फ़ाइलें ब्राउज़ करें",
    "upload.pasteText": "टेक्स्ट पेस्ट करें",
    "upload.private": "आपका दस्तावेज़ निजी और सुरक्षित रहता है",
    "processing.reading": "आपका दस्तावेज़ पढ़ा जा रहा है...",
    "processing.analyzing": "AI के साथ विश्लेषण कर रहे हैं...",
    "results.title": "विश्लेषण परिणाम",
    "results.whatThisMeans": "इसका क्या मतलब है",
    "results.importantStuff": "महत्वपूर्ण बातें",
    "results.watchOutFor": "इन बातों का ध्यान रखें",
    "results.whatYouShouldDo": "आपको क्या करना चाहिए",
    "disclaimer.text":
      "लीगलीटी शैक्षिक मार्गदर्शन प्रदान करता है, कानूनी सलाह नहीं। गंभीर मामलों के लिए एक वकील से सलाह लें।",
  },
  kn: {
    "app.title": "ಲೀಗಲೀಟೀ",
    "app.subtitle": "ಯಾವುದೇ ಕಾನೂನು ದಾಖಲೆಯನ್ನು ಸರಳ ಕನ್ನಡದಲ್ಲಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ",
    "upload.title": "ನಿಮ್ಮ ದಾಖಲೆಯನ್ನು ಸೇರಿಸುವ ವಿಧಾನವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "upload.description":
      "ನಾವು PDF ಮತ್ತು Word ದಾಖಲೆಗಳನ್ನು ಬೆಂಬಲಿಸುತ್ತೇವೆ, ಅಥವಾ ನೀವು ನೇರವಾಗಿ ಪಠ್ಯವನ್ನು ಅಂಟಿಸಬಹುದು",
    "upload.dragDrop": "ನಿಮ್ಮ ಒಪ್ಪಂದವನ್ನು ಇಲ್ಲಿ ಬಿಡಿ",
    "upload.browse": "ಫೈಲ್‌ಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ",
    "upload.pasteText": "ಪಠ್ಯವನ್ನು ಅಂಟಿಸಿ",
    "upload.private": "ನಿಮ್ಮ ದಾಖಲೆ ಖಾಸಗಿ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿ ಉಳಿಯುತ್ತದೆ",
    "processing.reading": "ನಿಮ್ಮ ದಾಖಲೆಯನ್ನು ಓದಲಾಗುತ್ತಿದೆ...",
    "processing.analyzing": "AI ಯೊಂದಿಗೆ ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    "results.title": "ವಿಶ್ಲೇಷಣೆ ಫಲಿತಾಂಶಗಳು",
    "results.whatThisMeans": "ಇದರ ಅರ್ಥವೇನು",
    "results.importantStuff": "ಮುಖ್ಯ ವಿಷಯಗಳು",
    "results.watchOutFor": "ಈ ವಿಷಯಗಳಿಗೆ ಗಮನಿಸಿ",
    "results.whatYouShouldDo": "ನೀವು ಏನು ಮಾಡಬೇಕು",
    "disclaimer.text":
      "ಲೀಗಲೀಟೀ ಶೈಕ್ಷಣಿಕ ಮಾರ್ಗದರ್ಶನವನ್ನು ಒದಗಿಸುತ್ತದೆ, ಕಾನೂನು ಸಲಹೆಯಲ್ಲ. ಗಂಭೀರ ವಿಷಯಗಳಿಗೆ ವಕೀಲರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
  },
  gu: {
    "app.title": "લીગલીટી",
    "app.subtitle": "કોઈપણ કાનૂની દસ્તાવેજને સરળ ગુજરાતીમાં સમજો",
    "upload.title": "તમારો દસ્તાવેજ ઉમેરવાની રીત પસંદ કરો",
    "upload.description":
      "અમે PDF અને Word દસ્તાવેજોને સપોર્ટ કરીએ છીએ, અથવા તમે સીધો ટેક્સ્ટ પેસ્ટ કરી શકો છો",
    "upload.dragDrop": "તમારો કરાર અહીં મૂકો",
    "upload.browse": "ફાઈલો બ્રાઉઝ કરો",
    "upload.pasteText": "ટેક્સ્ટ પેસ્ટ કરો",
    "upload.private": "તમારો દસ્તાવેજ ખાનગી અને સુરક્ષિત રહે છે",
    "processing.reading": "તમારો દસ્તાવેજ વાંચવામાં આવી રહ્યો છે...",
    "processing.analyzing": "AI સાથે વિશ્લેષણ કરવામાં આવી રહ્યું છે...",
    "results.title": "વિશ્લેષણ પરિણામો",
    "results.whatThisMeans": "આનો અર્થ શું છે",
    "results.importantStuff": "મહત્વપૂર્ણ બાબતો",
    "results.watchOutFor": "આ બાબતોનું ધ્યાન રાખો",
    "results.whatYouShouldDo": "તમારે શું કરવું જોઈએ",
    "disclaimer.text":
      "લીગલીટી શૈક્ષણિક માર્ગદર્શન પ્રદાન કરે છે, કાનૂની સલાહ નહીં. ગંભીર બાબતો માટે વકીલની સલાહ લો.",
  },
};
