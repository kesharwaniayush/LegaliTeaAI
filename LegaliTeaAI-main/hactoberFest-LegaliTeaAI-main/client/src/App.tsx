import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./lib/queryClient";
import { useAppStore } from "./stores/appStore";
import { UploadPage } from "./components/UploadPage";
import { ProcessingPage } from "./components/ProcessingPage";
import { SaveAnalysisComingSoon } from "./components/SaveAnalysisComingSoon";
import { LegalDisclaimer, TrustSignals } from "./components/LegalDisclaimer";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { DashboardResultsPage } from "./components/DashboardResultsPage";
import { EnhancedNavBar } from "./components/EnhancedNavBar";
import { TextSelectionTTS } from "./components/TextSelectionTTS";
import { DocumentPreview } from "./components/DocumentPreview";

// Import dev helpers in development
if (import.meta.env.DEV) {
  import("./stores/devHelpers");
}

function App() {
  const { processingStage, analysisResult, showPreview, previewText, previewFileName, setProcessingStage } = useAppStore();

  return (
    <ThemeProvider>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-background text-foreground transition-colors">
            <div className="container mx-auto px-4">
              {/* Enhanced Navigation Bar */}
              <EnhancedNavBar />

              <main className="max-w-7xl mx-auto pt-20">
                {/* App content based on current stage */}
                {processingStage === "upload" && !analysisResult && (
                  <UploadPage />
                )}

                {processingStage === "preview" && showPreview && (
                  <DocumentPreview
                    extractedText={previewText}
                    fileName={previewFileName}
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    onConfirm={(editedText) => {
                      setProcessingStage("analyze");
                      // The analysis will be triggered by the DocumentPreview component
                    }}
                    onCancel={() => {
                      setProcessingStage("upload");
                    }}
                  />
                )}

                {(processingStage === "extract" ||
                  processingStage === "analyze") && <ProcessingPage />}

                {processingStage === "complete" && analysisResult && (
                  <div className="space-y-6">
                    <DashboardResultsPage />
                    <SaveAnalysisComingSoon />
                  </div>
                )}

                {/* Legal Disclaimer */}
                <LegalDisclaimer variant="banner" className="mt-8" />

                {/* Trust Signals */}
                {processingStage === "upload" && (
                  <TrustSignals className="mt-6" />
                )}
              </main>
            </div>

            {/* Text Selection TTS */}
            <TextSelectionTTS />
          </div>

          {/* React Query Devtools */}
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
