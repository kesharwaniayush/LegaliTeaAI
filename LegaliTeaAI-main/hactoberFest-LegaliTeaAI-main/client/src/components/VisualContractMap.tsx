import React from "react";
import { Map, GitBranch, Construction } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCard } from "@/components/ui/animated-card";

interface VisualContractMapProps {
  analysisResult: any;
  originalText: string;
  className?: string;
}

export const VisualContractMap: React.FC<VisualContractMapProps> = ({
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
            <Map className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Visual Contract Map</CardTitle>
              <p className="text-sm text-muted-foreground">
                Transform your contract into an interactive flowchart showing
                relationships and obligations
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
          We're creating an advanced visualization system using Mermaid.js that
          will transform your contract into interactive flowcharts and
          relationship diagrams.
        </p>

        {/* Preview Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-2xl mx-auto">
          <div className="text-left p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <GitBranch className="h-4 w-4 mr-2 text-primary" />
              Party Relationships
            </h4>
            <p className="text-sm text-muted-foreground">
              Visual representation of all parties and their connections
            </p>
          </div>
          <div className="text-left p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <Map className="h-4 w-4 mr-2 text-primary" />
              Obligation Flow
            </h4>
            <p className="text-sm text-muted-foreground">
              See how responsibilities and obligations flow between parties
            </p>
          </div>
          <div className="text-left p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <GitBranch className="h-4 w-4 mr-2 text-primary" />
              Timeline View
            </h4>
            <p className="text-sm text-muted-foreground">
              Interactive timeline showing deadlines and key dates
            </p>
          </div>
          <div className="text-left p-4 border rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center">
              <Map className="h-4 w-4 mr-2 text-primary" />
              Interactive Nodes
            </h4>
            <p className="text-sm text-muted-foreground">
              Click on diagram elements to highlight related document sections
            </p>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
};
