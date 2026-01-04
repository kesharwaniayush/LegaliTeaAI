import React from "react";
import { AlertTriangle, Shield, Lock, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

interface LegalDisclaimerProps {
  variant?: "banner" | "card" | "inline";
  showTrustSignals?: boolean;
  className?: string;
}

export const LegalDisclaimer: React.FC<LegalDisclaimerProps> = ({
  variant = "banner",
  showTrustSignals = true,
  className = "",
}) => {
  const disclaimerText =
    "LegaliTea provides educational guidance, not legal advice. Consult an attorney for serious matters.";

  if (variant === "banner") {
    return (
      <div
        className={`bg-warning/10 border border-warning/20 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-warning font-medium">{disclaimerText}</p>
            <p className="text-warning/80 text-sm mt-1">
              This analysis is for informational purposes only and should not be
              considered as legal advice. For important legal matters, please
              consult with a qualified attorney.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-amber-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Important Legal Notice
              </h3>
              <p className="text-gray-700 font-medium mb-2">{disclaimerText}</p>
              <p className="text-gray-600 text-sm">
                This AI-powered analysis is designed to help you understand
                legal documents in plain English. However, it cannot replace
                professional legal advice. For contracts involving significant
                financial commitments, property, or legal obligations, we
                strongly recommend consulting with a qualified attorney.
              </p>
            </div>

            {showTrustSignals && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="bg-blue-100 p-2 rounded-full w-fit mx-auto mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600">
                    <strong>Educational Tool</strong>
                    <br />
                    Designed for learning and understanding
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 p-2 rounded-full w-fit mx-auto mb-2">
                    <Lock className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600">
                    <strong>Privacy First</strong>
                    <br />
                    Your documents are processed securely
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 p-2 rounded-full w-fit mx-auto mb-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600">
                    <strong>Transparency</strong>
                    <br />
                    Clear confidence scores provided
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Inline variant
  return (
    <Alert className={`border-amber-200 bg-amber-50 ${className}`}>
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <strong>{disclaimerText}</strong>
      </AlertDescription>
    </Alert>
  );
};

// Trust signals component
export const TrustSignals: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-gray-600 ${className}`}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="bg-green-100 p-1 rounded-full">
          <Shield className="h-4 w-4 text-green-600" />
        </div>
        <span>Documents processed securely</span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="bg-blue-100 p-1 rounded-full">
          <Lock className="h-4 w-4 text-blue-600" />
        </div>
        <span>No permanent data storage</span>
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="bg-purple-100 p-1 rounded-full">
          <Eye className="h-4 w-4 text-purple-600" />
        </div>
        <span>AI analysis with confidence scores</span>
      </div>
    </div>
  );
};

// Privacy notice component
export const PrivacyNotice: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`bg-gray-50 border border-gray-200 rounded-lg p-4 ${className}`}
    >
      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
        <Lock className="h-4 w-4 text-gray-600" />
        Your Privacy & Security
      </h4>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>• Documents are processed locally when possible</li>
        <li>• Analysis results are temporarily stored for 24 hours only</li>
        <li>• No personal information is collected or stored</li>
        <li>• All data transmission is encrypted</li>
        <li>• You can delete your analysis at any time</li>
      </ul>
    </div>
  );
};
