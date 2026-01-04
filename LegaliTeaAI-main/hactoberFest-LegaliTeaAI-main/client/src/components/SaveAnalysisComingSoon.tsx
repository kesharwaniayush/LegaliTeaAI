import React from "react";
import { Save, Clock, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const SaveAnalysisComingSoon: React.FC = () => {
  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="relative">
            <Save className="h-12 w-12 text-amber-600" />
            <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
              Soon
            </div>
          </div>
        </div>
        <CardTitle className="text-amber-800 dark:text-amber-200">
          Save Your Analysis
        </CardTitle>
        <CardDescription className="text-amber-700 dark:text-amber-300">
          Coming Soon in Future Release
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-3">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            We're working hard to bring you amazing features!
          </p>

          <div className="bg-white/50 dark:bg-amber-950/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3 text-sm">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-amber-700 dark:text-amber-300">
                <strong>24-Hour Access:</strong> Save analyses and access them later
              </span>
            </div>

            <div className="flex items-center space-x-3 text-sm">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span className="text-amber-700 dark:text-amber-300">
                <strong>Email-Based Storage:</strong> Secure cloud storage with your email
              </span>
            </div>
          </div>

          <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-lg p-3">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              <strong>🚀 Coming Soon:</strong> Save your document analyses securely and access them anytime within 24 hours!
            </p>
          </div>

          <div className="text-xs text-amber-600 dark:text-amber-400">
            <p>📧 Email-based access • 🔒 Secure storage • ⏰ 24-hour availability</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};