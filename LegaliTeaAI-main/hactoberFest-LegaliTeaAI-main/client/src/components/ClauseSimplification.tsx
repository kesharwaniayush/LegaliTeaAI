import React from "react";
import { FileText, ArrowRight, Construction } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";

interface ClauseSimplificationProps {
  analysisResult: any;
  originalText: string;
  className?: string;
}

export const ClauseSimplification: React.FC<ClauseSimplificationProps> = ({
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
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Clause-by-Clause Simplification</CardTitle>
              <p className="text-sm text-muted-foreground">
                Compare complex legal text with plain English explanations
                side-by-side
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
          We're building an advanced clause simplification system that will show
          your document side-by-side with plain English explanations,
          synchronized scrolling, and interactive highlighting.
        </p>

        {/* Preview Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-2xl mx-auto">
          <div className="text-left p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-primary" />
              Split-Screen View
            </h4>
            <p className="text-sm text-muted-foreground">
              Original legal text on the left, simplified version on the right
            </p>
          </div>
          <div className="text-left p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-primary" />
              Synchronized Scrolling
            </h4>
            <p className="text-sm text-muted-foreground">
              Navigate both versions together with automatic highlighting
            </p>
          </div>
          <div className="text-left p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-primary" />
              Complexity Indicators
            </h4>
            <p className="text-sm text-muted-foreground">
              Visual cues showing difficulty levels of different sections
            </p>
          </div>
          <div className="text-left p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <ArrowRight className="h-4 w-4 mr-2 text-primary" />
              Mobile Optimized
            </h4>
            <p className="text-sm text-muted-foreground">
              Stacked layout with swipe navigation for mobile devices
            </p>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};
