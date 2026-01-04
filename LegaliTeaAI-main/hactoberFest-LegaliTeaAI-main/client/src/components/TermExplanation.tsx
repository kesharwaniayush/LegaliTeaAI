import React from "react";
import { Search, MousePointer, Construction } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";

interface TermExplanationProps {
  analysisResult: any;
  originalText: string;
  className?: string;
}

export const TermExplanation: React.FC<TermExplanationProps> = ({
  analysisResult,
  originalText,
  className = "",
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <AnimatedCard>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Search className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Smart Term Explanation</CardTitle>
              <p className="text-sm text-muted-foreground">
                Click any legal term for instant, context-aware definitions in
                your language
              </p>
            </div>
          </div>
        </CardHeader>
      </AnimatedCard>

      {/* Coming Soon */}
      <AnimatedCard className="text-center p-12">
        <Construction className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          We're developing an intelligent term explanation system that will
          provide instant, context-aware definitions when you select any legal
          term in your document.
        </p>

        {/* Preview Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-2xl mx-auto">
          <div className="text-left p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <MousePointer className="h-4 w-4 mr-2 text-primary" />
              Click-to-Explain
            </h4>
            <p className="text-sm text-muted-foreground">
              Simply click or select any legal term for instant definitions
            </p>
          </div>
          <div className="text-left p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <Search className="h-4 w-4 mr-2 text-primary" />
              Context-Aware
            </h4>
            <p className="text-sm text-muted-foreground">
              Definitions tailored to how the term is used in your specific
              document
            </p>
          </div>
          <div className="text-left p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <MousePointer className="h-4 w-4 mr-2 text-primary" />
              Multi-Language
            </h4>
            <p className="text-sm text-muted-foreground">
              Get explanations in your preferred language with cultural context
            </p>
          </div>
          <div className="text-left p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <Search className="h-4 w-4 mr-2 text-primary" />
              Smart Popups
            </h4>
            <p className="text-sm text-muted-foreground">
              Intelligent popup positioning that doesn't interfere with reading
            </p>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};
