import React, { useState } from "react";
import { X, Mail, History, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/stores/appStore";
import { storageService } from "@/services/supabaseClient";
import { fetchAnalysesRateLimiter, createEmailIdentifier } from "@/services/rateLimiter";
import type { SummaryRecord } from "@/services/supabaseClient";

interface SavedAnalysesSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const SavedAnalysesSidebar: React.FC<SavedAnalysesSidebarProps> = ({
  isOpen,
  onToggle,
}) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [savedAnalyses, setSavedAnalyses] = useState<SummaryRecord[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SummaryRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAnalyses, setIsLoadingAnalyses] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFetchAnalyses = async () => {
    setEmailError("");
    setSavedAnalyses([]);
    setSelectedAnalysis(null);

    if (!email.trim()) {
      setEmailError("Email address is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Check rate limit
    const emailIdentifier = createEmailIdentifier(email.trim());
    const rateLimitInfo = fetchAnalysesRateLimiter.getRateLimitInfo(emailIdentifier);

    if (!rateLimitInfo.isAllowed) {
      const resetTime = new Date(rateLimitInfo.resetTime);
      const timeUntilReset = Math.ceil((resetTime.getTime() - Date.now()) / 1000 / 60);
      setEmailError(
        `Rate limit exceeded. Please wait ${timeUntilReset} minute(s) before trying again.`
      );
      return;
    }

    setIsLoadingAnalyses(true);
    try {
      const analyses = await storageService.getAnalysesByEmail(email.trim());
      setSavedAnalyses(analyses);
    } catch (error) {
      console.error("Failed to fetch analyses:", error);
      setEmailError("Failed to fetch saved analyses. Please try again.");
    } finally {
      setIsLoadingAnalyses(false);
    }
  };

  const handleViewAnalysis = (analysis: SummaryRecord) => {
    setSelectedAnalysis(analysis);
  };

  const handleDeleteAnalysis = async (id: string) => {
    try {
      await storageService.deleteAnalysis(id);
      setSavedAnalyses(prev => prev.filter(a => a.id !== id));
      if (selectedAnalysis?.id === id) {
        setSelectedAnalysis(null);
      }
    } catch (error) {
      console.error("Failed to delete analysis:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-background border-l border-border z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Saved Analyses</h2>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {!selectedAnalysis ? (
              <div className="p-4 space-y-4">
                {/* Email Input */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Enter Your Email
                    </CardTitle>
                    <CardDescription className="text-xs">
                      View your saved document analyses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      className={emailError ? "border-red-300" : ""}
                    />
                    {emailError && (
                      <p className="text-sm text-red-600">{emailError}</p>
                    )}
                    <Button
                      onClick={handleFetchAnalyses}
                      disabled={isLoadingAnalyses}
                      className="w-full"
                    >
                      {isLoadingAnalyses ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Loading...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <History className="h-4 w-4" />
                          View Saved Analyses
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Analyses List */}
                {savedAnalyses.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">
                        Your Analyses ({savedAnalyses.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="max-h-96 overflow-y-auto">
                        {savedAnalyses.map((analysis) => (
                          <div
                            key={analysis.id}
                            className="p-3 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {analysis.analysis_result.summary.tldr}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDate(analysis.created_at)} • {analysis.document_type}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewAnalysis(analysis)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAnalysis(analysis.id)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Empty State */}
                {savedAnalyses.length === 0 && !isLoadingAnalyses && email && (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <div className="text-muted-foreground">
                        <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No saved analyses found</p>
                        <p className="text-xs mt-1">
                          Your analyses will appear here after you save them
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              /* Analysis Detail View */
              <div className="p-4 h-full flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedAnalysis(null)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="font-medium">Analysis Details</h3>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedAnalysis.analysis_result.summary.tldr}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Key Points</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {selectedAnalysis.analysis_result.summary.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Document Type</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {selectedAnalysis.document_type}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Saved On</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedAnalysis.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};