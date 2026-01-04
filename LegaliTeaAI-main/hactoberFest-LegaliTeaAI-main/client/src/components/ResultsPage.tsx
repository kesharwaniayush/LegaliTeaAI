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
import type { RiskFlag, ActionItem, DateInfo, MonetaryInfo } from "@/types";

export const ResultsPage: React.FC = () => {
  const { analysisResult, reset } = useAppStore();
  const [showOriginalText, setShowOriginalText] = useState(false);
  const [selectedSummaryPoint, setSelectedSummaryPoint] = useState<
    number | null
  >(null);

  // Calculate stats directly to avoid selector issues
  const stats = analysisResult
    ? {
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
      }
    : null;

  if (!analysisResult) return null;

  const getRiskColor = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return "border-red-500 bg-red-50 text-red-800";
      case "medium":
        return "border-yellow-500 bg-yellow-50 text-yellow-800";
      case "low":
        return "border-blue-500 bg-blue-50 text-blue-800";
    }
  };

  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Analysis Results
          </h1>
          <p className="text-muted-foreground mt-1">
            Document analyzed on {analysisResult.createdAt.toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
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

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="text-lg font-semibold text-info">
                    {Math.round(stats.confidence * 100)}%
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-info" />
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
                <AlertTriangle className="h-8 w-8 text-destructive" />
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
      )}

      {/* What This Means - TL;DR */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            What This Means
          </CardTitle>
          <CardDescription>
            Plain English summary of your document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800 text-lg leading-relaxed">
              {analysisResult.summary.tldr}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-blue-600">
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
                {showOriginalText ? "Hide" : "Show"} Original Text
              </Button>
            </div>
          </div>

          {/* Key Points */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Key Points:</h4>
            {analysisResult.summary.keyPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() =>
                  setSelectedSummaryPoint(
                    selectedSummaryPoint === index ? null : index
                  )
                }
              >
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm font-medium">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-gray-800">{point}</p>
                  {selectedSummaryPoint === index && (
                    <Button variant="ghost" size="sm" className="mt-2">
                      <Eye className="h-4 w-4 mr-1" />
                      Show Original Clause
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Important Stuff
            </CardTitle>
            <CardDescription>
              Key information extracted from your document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Parties */}
            {analysisResult.keyInformation.parties.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Parties Involved
                </h4>
                <div className="space-y-1">
                  {analysisResult.keyInformation.parties.map((party, index) => (
                    <div
                      key={index}
                      className="text-gray-700 bg-gray-50 px-3 py-2 rounded"
                    >
                      {party}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Important Dates */}
            {analysisResult.keyInformation.dates.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Important Dates
                </h4>
                <div className="space-y-2">
                  {analysisResult.keyInformation.dates.map(
                    (dateInfo: DateInfo, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatDate(dateInfo.date)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {dateInfo.description}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            dateInfo.importance === "high"
                              ? "bg-red-100 text-red-800"
                              : dateInfo.importance === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
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

            {/* Monetary Amounts */}
            {analysisResult.keyInformation.monetaryAmounts.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Money Matters
                </h4>
                <div className="space-y-2">
                  {analysisResult.keyInformation.monetaryAmounts.map(
                    (amount: MonetaryInfo, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {amount.amount} {amount.currency}
                          </p>
                          <p className="text-sm text-gray-600">
                            {amount.description}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            amount.type === "penalty"
                              ? "bg-red-100 text-red-800"
                              : amount.type === "payment"
                              ? "bg-blue-100 text-blue-800"
                              : amount.type === "deposit"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
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

        {/* Watch Out For - Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Watch Out For
            </CardTitle>
            <CardDescription>
              Potential risks and concerning clauses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysisResult.riskAssessment.redFlags.length > 0 ? (
              <div className="space-y-3">
                {analysisResult.riskAssessment.redFlags.map(
                  (flag: RiskFlag, index) => (
                    <Alert key={index} className={getRiskColor(flag.severity)}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <div className="font-medium">{flag.clause}</div>
                          <div className="text-sm">{flag.explanation}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto"
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
              <div className="text-center py-8 text-gray-500">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-green-500" />
                <p>No major red flags detected!</p>
                <p className="text-sm">
                  This document appears to have standard terms.
                </p>
              </div>
            )}

            {/* Recommendations */}
            {analysisResult.riskAssessment.recommendations.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-3">
                  Recommendations:
                </h4>
                <ul className="space-y-2">
                  {analysisResult.riskAssessment.recommendations.map(
                    (rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{rec}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-500" />
            What You Should Do
          </CardTitle>
          <CardDescription>
            Prioritized action items based on your document
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisResult.actionPlan.map((action: ActionItem) => (
              <div
                key={action.id}
                className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{action.task}</p>
                      {action.deadline && (
                        <p className="text-sm text-gray-600 mt-1">
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
                      {action.priority} priority
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Original Text Viewer */}
      {showOriginalText && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Original Document Text
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOriginalText(false)}
              >
                <EyeOff className="h-4 w-4" />
                Hide
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {analysisResult.originalText}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
