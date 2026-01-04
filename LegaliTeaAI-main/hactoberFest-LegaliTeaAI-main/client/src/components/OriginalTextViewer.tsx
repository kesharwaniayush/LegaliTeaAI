import React, { useState, useRef, useEffect } from "react";
import { Eye, EyeOff, Search, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OriginalTextViewerProps {
  text: string;
  highlightText?: string;
  onClose?: () => void;
  className?: string;
}

export const OriginalTextViewer: React.FC<OriginalTextViewerProps> = ({
  text,
  highlightText,
  onClose,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  // Highlight search terms and specific text
  const getHighlightedText = (text: string) => {
    if (!searchTerm && !highlightText) return text;

    let highlightedText = text;

    // Highlight search term
    if (searchTerm) {
      const regex = new RegExp(`(${searchTerm})`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-yellow-200 px-1 rounded">$1</mark>'
      );
    }

    // Highlight specific text (like referenced clauses)
    if (highlightText && highlightText !== searchTerm) {
      const regex = new RegExp(
        `(${highlightText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi"
      );
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-blue-200 px-1 rounded border border-blue-300">$1</mark>'
      );
    }

    return highlightedText;
  };

  // Copy text to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  // Scroll to highlighted text
  useEffect(() => {
    if (highlightText && textRef.current) {
      const element = textRef.current.querySelector("mark");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [highlightText]);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Original Document Text
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <EyeOff className="h-4 w-4" />
                Hide
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search in document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
          <div
            ref={textRef}
            className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: getHighlightedText(text),
            }}
          />
        </div>

        {/* Text Stats */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>
            {text.split(/\s+/).length.toLocaleString()} words •{" "}
            {text.length.toLocaleString()} characters
          </span>
          {searchTerm && (
            <span>
              {(text.match(new RegExp(searchTerm, "gi")) || []).length} matches
              found
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Hook for managing original text references
export const useOriginalTextReferences = () => {
  const [activeReference, setActiveReference] = useState<string | null>(null);
  const [showOriginalText, setShowOriginalText] = useState(false);

  const showReference = (text: string) => {
    setActiveReference(text);
    setShowOriginalText(true);
  };

  const hideReference = () => {
    setActiveReference(null);
    setShowOriginalText(false);
  };

  return {
    activeReference,
    showOriginalText,
    showReference,
    hideReference,
    setShowOriginalText,
  };
};
