import React, { useState, useMemo, useCallback, memo } from "react";
import { FileText, Check, X, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedButton } from "./ui/animated-button";
import { useAppStore } from "@/stores/appStore";
import { useAnalysis } from "@/hooks/useAnalysis";

interface DocumentPreviewProps {
  extractedText: string;
  fileName: string;
  onConfirm: (editedText: string) => void;
  onCancel: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = memo(({
  extractedText,
  fileName,
  onConfirm,
  onCancel,
}) => {
  const [editedText, setEditedText] = useState(extractedText);
  const [showPreview, setShowPreview] = useState(true);
  const [isTextExpanded, setIsTextExpanded] = useState(true);
  const { setProcessingStage } = useAppStore();
  const { analyzeDocument } = useAnalysis();

  const handleConfirm = useCallback(() => {
    onConfirm(editedText);
    setProcessingStage("analyze");
    // Update the extracted text in the store
    const { setExtractedText } = useAppStore.getState();
    setExtractedText(editedText);
    // Trigger analysis
    analyzeDocument(editedText);
  }, [editedText, onConfirm, setProcessingStage, analyzeDocument]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  // Memoize expensive calculations
  const stats = useMemo(() => {
    const wordCount = editedText.trim().split(/\s+/).length;
    const charCount = editedText.length;
    return { wordCount, charCount };
  }, [editedText]);

  const isTextValid = useMemo(() => editedText.trim().length >= 50, [editedText]);

  return (
    <div className="max-w-4xl mx-auto pt-20">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-xl">Document Preview</CardTitle>
                <CardDescription>
                  Review and edit the extracted text before analysis
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span>{showPreview ? "Hide" : "Show"} Preview</span>
            </Button>
          </div>
        </CardHeader>

        {showPreview && (
          <>
            <CardContent className="space-y-6">
              {/* File Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-muted-foreground">File:</span>
                    <span className="font-medium">{fileName}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <span>{stats.wordCount.toLocaleString()} words</span>
                    <span>{stats.charCount.toLocaleString()} characters</span>
                  </div>
                </div>
              </div>

              {/* Text Editor Accordion */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Extracted Text</label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsTextExpanded(!isTextExpanded)}
                    className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
                  >
                    {isTextExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    <span className="text-xs">
                      {isTextExpanded ? "Collapse" : "Expand"}
                    </span>
                  </Button>
                </div>

                {isTextExpanded && (
                  <Textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="min-h-[300px] resize-none font-mono text-sm leading-relaxed transition-all duration-200"
                    placeholder="Extracted text will appear here..."
                  />
                )}

                {/* Help Text */}
                {!isTextValid && (
                  <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                    ⚠️ Please ensure you have at least 50 characters of text for analysis.
                  </div>
                )}
              </div>
            </CardContent>

            {/* Always Visible Action Buttons */}
            <CardFooter className="flex items-center justify-between pt-4 border-t bg-muted/30">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Text extracted successfully</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <AnimatedButton
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </AnimatedButton>

                <AnimatedButton
                  onClick={handleConfirm}
                  disabled={!isTextValid}
                  className="flex items-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Analyze Document</span>
                </AnimatedButton>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
});

DocumentPreview.displayName = "DocumentPreview";

export { DocumentPreview };