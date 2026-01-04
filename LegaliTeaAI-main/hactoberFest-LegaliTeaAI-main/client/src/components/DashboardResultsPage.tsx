import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Eye,
  EyeOff,
  ArrowLeft,
  Download,
  Share2,
  FileText,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/stores/appStore";
import { useLanguage } from "@/constants/languages";
import { OriginalTextViewer } from "./OriginalTextViewer";
import {
  TTSSummaryControl,
  TTSKeyPointsControl,
  TTSRisksControl,
  TTSActionPlanControl,
} from "./TTSControl";
import { AdvancedFeaturesHub } from "./AdvancedFeaturesHub";
import type { RiskFlag, ActionItem, DateInfo, MonetaryInfo } from "@/types";

export const DashboardResultsPage: React.FC = () => {
  const { analysisResult, reset } = useAppStore();
  const { t } = useLanguage();
  const [showOriginalText, setShowOriginalText] = useState(false);
  const [selectedReference, setSelectedReference] = useState<string | null>(
    null
  );

  if (!analysisResult) return null;

  // Calculate stats directly
  const stats = {
    totalParties: analysisResult.keyInformation.parties.length,
    totalDates: analysisResult.keyInformation.dates.length,
    totalAmounts: analysisResult.keyInformation.monetaryAmounts.length,
    totalObligations: analysisResult.keyInformation.obligations.length,
    totalRisks: analysisResult.riskAssessment.redFlags.length,
    highRisks: analysisResult.riskAssessment.redFlags.filter(
      (r) => r.severity === "high"
    ).length,
    totalActions: analysisResult.actionPlan.length,
    highPriorityActions: analysisResult.actionPlan.filter(
      (a) => a.priority === "high"
    ).length,
    overallRisk: analysisResult.riskAssessment.overallRisk,
    confidence: analysisResult.summary.confidence,
  };

  const getRiskColor = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return "border-destructive/20 bg-destructive/10 text-destructive";
      case "medium":
        return "border-warning/20 bg-warning/10 text-warning";
      case "low":
        return "border-info/20 bg-info/10 text-info";
    }
  };

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const showReference = (text: string) => {
    setSelectedReference(text);
    setShowOriginalText(true);
  };

  const exportToPDF = () => {
    // Create a printable version
    const printContent = `
      <html>
        <head>
          <title>Legal Document Analysis - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .risk-high { color: #dc2626; }
            .risk-medium { color: #ea580c; }
            .risk-low { color: #16a34a; }
            .priority-high { background: #fef2f2; padding: 5px; border-left: 3px solid #dc2626; }
            .priority-medium { background: #fffbeb; padding: 5px; border-left: 3px solid #ea580c; }
            .priority-low { background: #f0f9ff; padding: 5px; border-left: 3px solid #0284c7; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Legal Document Analysis</h1>
            <p>Generated on ${new Date().toLocaleDateString()} by LegaliTea</p>
            <p>Confidence Score: ${Math.round(stats.confidence * 100)}%</p>
          </div>
          
          <div class="section">
            <h2>Summary</h2>
            <p><strong>TL;DR:</strong> ${analysisResult.summary.tldr}</p>
            <h3>Key Points:</h3>
            <ul>
              ${analysisResult.summary.keyPoints
                .map((point) => `<li>${point}</li>`)
                .join("")}
            </ul>
          </div>

          <div class="section">
            <h2>Risk Assessment (${stats.overallRisk.toUpperCase()})</h2>
            ${analysisResult.riskAssessment.redFlags
              .map(
                (flag) => `
              <div class="priority-${flag.severity}">
                <h4>${flag.clause}</h4>
                <p>${flag.explanation}</p>
              </div>
            `
              )
              .join("")}
          </div>

          <div class="section">
            <h2>Action Plan</h2>
            ${analysisResult.actionPlan
              .map(
                (action) => `
              <div class="priority-${action.priority}">
                <h4>${action.task}</h4>
                ${
                  action.deadline
                    ? `<p><strong>Deadline:</strong> ${action.deadline}</p>`
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>

          <div class="section">
            <h2>Important Information</h2>
            <h3>Parties:</h3>
            <ul>${analysisResult.keyInformation.parties
              .map((party) => `<li>${party}</li>`)
              .join("")}</ul>
            
            <h3>Key Dates:</h3>
            <ul>${analysisResult.keyInformation.dates
              .map(
                (date) =>
                  `<li>${formatDate(date.date)} - ${date.description}</li>`
              )
              .join("")}</ul>
            
            <h3>Financial Information:</h3>
            <ul>${analysisResult.keyInformation.monetaryAmounts
              .map(
                (amount) =>
                  `<li>${amount.amount} ${amount.currency} - ${amount.description}</li>`
              )
              .join("")}</ul>
          </div>

          <div class="section">
            <p><em>Disclaimer: This analysis is for educational purposes only and should not be considered as legal advice. Consult an attorney for serious matters.</em></p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t("results.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Document analyzed on {analysisResult.createdAt.toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportToPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={reset}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Risk</p>
                <p
                  className={`text-lg font-semibold ${
                    stats.overallRisk === "high"
                      ? "text-destructive"
                      : stats.overallRisk === "medium"
                      ? "text-warning"
                      : "text-success"
                  }`}
                >
                  {stats.overallRisk.toUpperCase()}
                </p>
              </div>
              <AlertTriangle
                className={`h-8 w-8 ${
                  stats.overallRisk === "high"
                    ? "text-destructive"
                    : stats.overallRisk === "medium"
                    ? "text-warning"
                    : "text-success"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Confidence</p>
                <p className="text-lg font-semibold text-info">
                  {Math.round(stats.confidence * 100)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Red Flags</p>
                <p className="text-lg font-semibold text-destructive">
                  {stats.highRisks}/{stats.totalRisks}
                </p>
              </div>
              <Shield className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Action Items</p>
                <p className="text-lg font-semibold text-primary">
                  {stats.highPriorityActions}/{stats.totalActions}
                </p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* What This Means */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  {t("results.whatThisMeans")}
                </div>
                <TTSSummaryControl summary={analysisResult.summary} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-info/10 border border-info/20 rounded-lg p-4 mb-4">
                <p className="text-info text-lg leading-relaxed">
                  {analysisResult.summary.tldr}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-info/80">
                    AI Confidence:{" "}
                    {Math.round(analysisResult.summary.confidence * 100)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOriginalText(!showOriginalText)}
                  >
                    {showOriginalText ? (
                      <EyeOff className="h-4 w-4 mr-1" />
                    ) : (
                      <Eye className="h-4 w-4 mr-1" />
                    )}
                    {showOriginalText ? "Hide" : "Show"} Original
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-foreground">Key Points:</h4>
                  <TTSKeyPointsControl
                    keyPoints={analysisResult.summary.keyPoints}
                  />
                </div>
                {analysisResult.summary.keyPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-success text-sm font-medium">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground">{point}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-auto p-0 text-xs"
                        onClick={() => showReference(point)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Show Original Clause
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  {t("results.watchOutFor")}
                </div>
                <TTSRisksControl
                  risks={analysisResult.riskAssessment.redFlags}
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult.riskAssessment.redFlags.length > 0 ? (
                <div className="space-y-3">
                  {analysisResult.riskAssessment.redFlags.map(
                    (flag: RiskFlag, index) => (
                      <Alert
                        key={index}
                        className={getRiskColor(flag.severity)}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-2">
                            <div className="font-medium">{flag.clause}</div>
                            <div className="text-sm">{flag.explanation}</div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-auto text-xs"
                              onClick={() => showReference(flag.originalText)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Show original text
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-success" />
                  <p>No major red flags detected!</p>
                  <p className="text-sm">
                    This document appears to have standard terms.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details & Actions */}
        <div className="space-y-6">
          {/* Important Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t("results.importantStuff")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Parties */}
              {analysisResult.keyInformation.parties.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Parties
                  </h4>
                  <div className="space-y-1">
                    {analysisResult.keyInformation.parties.map(
                      (party, index) => (
                        <div
                          key={index}
                          className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded"
                        >
                          {party}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Key Dates */}
              {analysisResult.keyInformation.dates.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Important Dates
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.keyInformation.dates.map(
                      (dateInfo: DateInfo, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {formatDate(dateInfo.date)}
                            </p>
                            <p className="text-muted-foreground">
                              {dateInfo.description}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              dateInfo.importance === "high"
                                ? "bg-destructive/20 text-destructive"
                                : dateInfo.importance === "medium"
                                ? "bg-warning/20 text-warning"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {dateInfo.importance}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Money Matters */}
              {analysisResult.keyInformation.monetaryAmounts.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Financial Terms
                  </h4>
                  <div className="space-y-2">
                    {analysisResult.keyInformation.monetaryAmounts.map(
                      (amount: MonetaryInfo, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
                        >
                          <div>
                            <p className="font-medium text-foreground">
                              {amount.amount} {amount.currency}
                            </p>
                            <p className="text-muted-foreground">
                              {amount.description}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              amount.type === "penalty"
                                ? "bg-destructive/20 text-destructive"
                                : amount.type === "payment"
                                ? "bg-info/20 text-info"
                                : amount.type === "deposit"
                                ? "bg-success/20 text-success"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {amount.type}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  {t("results.whatYouShouldDo")}
                </div>
                <TTSActionPlanControl actionPlan={analysisResult.actionPlan} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult.actionPlan.map((action: ActionItem) => (
                  <div
                    key={action.id}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-primary rounded border-border focus:ring-primary"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">
                            {action.task}
                          </p>
                          {action.deadline && (
                            <p className="text-sm text-muted-foreground mt-1">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              Deadline: {action.deadline}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded border ${getPriorityColor(
                            action.priority
                          )}`}
                        >
                          {action.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Advanced Features Hub */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Advanced Legal Tools
          </CardTitle>
          <CardDescription>
            Unlock powerful features to dive deeper into your document analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdvancedFeaturesHub
            analysisResult={analysisResult}
            originalText={analysisResult.originalText}
          />
        </CardContent>
      </Card>

      {/* Original Text Viewer */}
      {showOriginalText && (
        <OriginalTextViewer
          text={analysisResult.originalText}
          highlightText={selectedReference || undefined}
          onClose={() => {
            setShowOriginalText(false);
            setSelectedReference(null);
          }}
        />
      )}
    </div>
  );
};
