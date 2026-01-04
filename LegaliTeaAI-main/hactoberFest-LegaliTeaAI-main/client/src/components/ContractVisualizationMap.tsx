import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Maximize2,
  Filter,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedCard } from "@/components/ui/animated-card";
import { useAnimations } from "@/hooks/useAnimations";
import { useAudioFeedback } from "@/services/audioFeedback";
import type { ContractVisualization } from "@/types/advanced";

interface ContractVisualizationMapProps {
  visualization: ContractVisualization;
  onNodeClick?: (nodeId: string) => void;
  onRelationshipClick?: (relationship: any) => void;
  className?: string;
}

export const ContractVisualizationMap: React.FC<
  ContractVisualizationMapProps
> = ({ visualization, onNodeClick, onRelationshipClick, className = "" }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mermaidError, setMermaidError] = useState<string | null>(null);

  const mermaidRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { getAnimationClass } = useAnimations();
  const { playClick, playSuccess, playError } = useAudioFeedback();

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: 14,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: "basis",
        padding: 20,
      },
      themeVariables: {
        primaryColor: "#3b82f6",
        primaryTextColor: "#1f2937",
        primaryBorderColor: "#2563eb",
        lineColor: "#6b7280",
        secondaryColor: "#f3f4f6",
        tertiaryColor: "#ffffff",
      },
    });
  }, []);

  // Render Mermaid diagram
  useEffect(() => {
    if (!mermaidRef.current || !visualization.mermaidDiagram) return;

    const renderDiagram = async () => {
      try {
        setMermaidError(null);

        // Clear previous content
        mermaidRef.current!.innerHTML = "";

        // Generate unique ID for this diagram
        const diagramId = `mermaid-${Date.now()}`;

        // Render the diagram
        const { svg } = await mermaid.render(
          diagramId,
          visualization.mermaidDiagram
        );

        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = svg;

          // Add click handlers to nodes
          const nodes = mermaidRef.current.querySelectorAll(".node");
          nodes.forEach((node) => {
            const nodeId = node.id?.replace(diagramId + "-", "");
            if (nodeId) {
              node.addEventListener("click", () => handleNodeClick(nodeId));
              node.style.cursor = "pointer";
            }
          });

          // Add click handlers to edges
          const edges = mermaidRef.current.querySelectorAll(".edgePath");
          edges.forEach((edge, index) => {
            edge.addEventListener("click", () =>
              handleRelationshipClick(index)
            );
            edge.style.cursor = "pointer";
          });

          playSuccess();
        }
      } catch (error) {
        console.error("Mermaid rendering error:", error);
        setMermaidError(
          "Failed to render contract visualization. Please try again."
        );
        playError();
      }
    };

    renderDiagram();
  }, [visualization.mermaidDiagram, filterType]);

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    playClick();
    setSelectedNode(nodeId);
    onNodeClick?.(nodeId);
  };

  // Handle relationship click
  const handleRelationshipClick = (relationshipIndex: number) => {
    playClick();
    const relationship = visualization.relationships[relationshipIndex];
    onRelationshipClick?.(relationship);
  };

  // Zoom controls
  const handleZoom = (direction: "in" | "out" | "reset") => {
    playClick();

    if (direction === "reset") {
      setZoomLevel(1);
    } else {
      const newZoom =
        direction === "in"
          ? Math.min(zoomLevel * 1.2, 3)
          : Math.max(zoomLevel / 1.2, 0.3);
      setZoomLevel(newZoom);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    playClick();
    setIsFullscreen(!isFullscreen);
  };

  // Export diagram
  const exportDiagram = () => {
    playClick();

    if (!mermaidRef.current) return;

    const svg = mermaidRef.current.querySelector("svg");
    if (!svg) return;

    // Create download link
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "contract-map.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);

    playSuccess();
  };

  // Filter nodes by type
  const filteredNodes = visualization.nodes.filter((node) => {
    const matchesType = filterType === "all" || node.type === filterType;
    const matchesSearch =
      !searchTerm ||
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesSearch;
  });

  // Get node type color
  const getNodeTypeColor = (type: string) => {
    switch (type) {
      case "party":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "obligation":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "deadline":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "payment":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "condition":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "penalty":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (!visualization.mermaidDiagram) {
    return (
      <AnimatedCard className="p-8 text-center">
        <div className="text-muted-foreground">
          <Filter className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            No Visualization Available
          </h3>
          <p>Contract mapping is not available for this document.</p>
        </div>
      </AnimatedCard>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">Contract Visualization</h2>
          <p className="text-sm text-muted-foreground">
            Interactive map showing relationships and dependencies
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-40"
            />
          </div>

          {/* Filter */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="party">Parties</SelectItem>
              <SelectItem value="obligation">Obligations</SelectItem>
              <SelectItem value="deadline">Deadlines</SelectItem>
              <SelectItem value="payment">Payments</SelectItem>
              <SelectItem value="condition">Conditions</SelectItem>
              <SelectItem value="penalty">Penalties</SelectItem>
            </SelectContent>
          </Select>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom("out")}
              disabled={zoomLevel <= 0.3}
              className="h-8 w-8 p-0"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs px-2 min-w-[3rem] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom("in")}
              disabled={zoomLevel >= 3}
              className="h-8 w-8 p-0"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom("reset")}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 w-8 p-0"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={exportDiagram}
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Diagram */}
        <div className="lg:col-span-3">
          <AnimatedCard className="p-4">
            {mermaidError ? (
              <div className="text-center py-8">
                <div className="text-red-500 mb-2">⚠️ Visualization Error</div>
                <p className="text-sm text-muted-foreground">{mermaidError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <div
                ref={containerRef}
                className={`
                  overflow-auto transition-all duration-300
                  ${
                    isFullscreen
                      ? "fixed inset-0 z-50 bg-background p-4"
                      : "h-96 lg:h-[500px]"
                  }
                `}
              >
                <div
                  ref={mermaidRef}
                  className={`
                    transition-transform duration-300 origin-center
                    ${getAnimationClass("animate-fade-in")}
                  `}
                  style={{ transform: `scale(${zoomLevel})` }}
                />
              </div>
            )}
          </AnimatedCard>
        </div>

        {/* Node Details Panel */}
        <div className="space-y-4">
          {/* Legend */}
          <AnimatedCard>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                "party",
                "obligation",
                "deadline",
                "payment",
                "condition",
                "penalty",
              ].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Badge className={getNodeTypeColor(type)}>{type}</Badge>
                  <span className="text-xs text-muted-foreground capitalize">
                    {type}s
                  </span>
                </div>
              ))}
            </CardContent>
          </AnimatedCard>

          {/* Selected Node Details */}
          {selectedNode && (
            <AnimatedCard animation="fade-up">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Node Details</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const node = visualization.nodes.find(
                    (n) => n.id === selectedNode
                  );
                  if (!node)
                    return (
                      <p className="text-sm text-muted-foreground">
                        Node not found
                      </p>
                    );

                  return (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge className={getNodeTypeColor(node.type)}>
                          {node.type}
                        </Badge>
                        {node.importance && (
                          <Badge variant="outline">
                            {node.importance} priority
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-medium">{node.label}</h4>
                      {node.description && (
                        <p className="text-sm text-muted-foreground">
                          {node.description}
                        </p>
                      )}
                    </div>
                  );
                })()}
              </CardContent>
            </AnimatedCard>
          )}

          {/* Statistics */}
          <AnimatedCard animation="fade-up" delay={100}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Nodes:</span>
                <span className="font-medium">
                  {visualization.nodes.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Relationships:</span>
                <span className="font-medium">
                  {visualization.relationships.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Filtered:</span>
                <span className="font-medium">{filteredNodes.length}</span>
              </div>
            </CardContent>
          </AnimatedCard>
        </div>
      </div>

      {/* Mobile Instructions */}
      <div className="lg:hidden p-3 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          💡 Tap nodes and connections to see details. Use pinch gestures to
          zoom on mobile.
        </p>
      </div>
    </div>
  );
};
