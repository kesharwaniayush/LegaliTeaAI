import React, { useState } from "react";
import { Save, Mail, Clock, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSaveAnalysis } from "@/hooks/useAnalysis";
import { useAppStore } from "@/stores/appStore";

export const SaveAnalysis: React.FC = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const { analysisResult } = useAppStore();
  const { saveAnalysis, isSaving, saveError, saveSuccess } = useSaveAnalysis();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = () => {
    setEmailError("");

    if (!email.trim()) {
      setEmailError("Email address is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!analysisResult) {
      setEmailError("No analysis to save");
      return;
    }

    saveAnalysis({ email: email.trim(), analysis: analysisResult });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
  };

  if (saveSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="bg-green-100 p-3 rounded-full w-fit mx-auto">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Analysis Saved!
              </h3>
              <p className="text-gray-600">
                Your analysis has been saved and will be available for 24 hours.
                We've sent a confirmation to <strong>{email}</strong>.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-700 text-sm">
                <Clock className="h-4 w-4 inline mr-1" />
                This analysis will be automatically deleted after 24 hours for
                your privacy.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5 text-blue-500" />
          Save Your Analysis
        </CardTitle>
        <CardDescription>
          Get a link to access your analysis for the next 24 hours
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="your.email@example.com"
              className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                emailError ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isSaving}
            />
          </div>
          {emailError && (
            <p className="mt-1 text-sm text-red-600">{emailError}</p>
          )}
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          disabled={isSaving || !email.trim()}
          className="w-full"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Analysis for 24 Hours
            </>
          )}
        </Button>

        {/* Error Alert */}
        {saveError && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {saveError.message ||
                "Failed to save analysis. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {/* Privacy Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <h4 className="font-medium text-gray-900 mb-2 text-sm">
            Privacy & Data Retention
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>
              • Your analysis will be stored securely for exactly 24 hours
            </li>
            <li>• We'll send you a link to access your saved analysis</li>
            <li>• Your email is only used for this notification</li>
            <li>• All data is automatically deleted after 24 hours</li>
            <li>• No personal information is permanently stored</li>
          </ul>
        </div>

        {/* Alternative Options */}
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600 mb-3">
            Don't want to save online?
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <span className="text-xs">📄</span>
              <span className="ml-1">Export PDF</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <span className="text-xs">📋</span>
              <span className="ml-1">Copy Summary</span>
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <span className="text-xs">🔗</span>
              <span className="ml-1">Share Link</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
