import React, { useState, useCallback, useRef } from "react";
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  File,
  FileImage,
  Coffee,
  Globe,
  Link,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatedButton } from "@/components/ui/animated-button";
import { AnimatedCard, StaggeredCards } from "@/components/ui/animated-card";
import { AnimatedTextarea } from "@/components/ui/animated-input";
import { useAudioFeedback } from "@/services/audioFeedback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAppStore } from "@/stores/appStore";
import { useDocumentProcessor } from "@/hooks/useDocumentProcessor";
import { useAnalysis } from "@/hooks/useAnalysis";
import { sampleDocuments } from "@/services/documentProcessor";
import { AnimatedLanguageText } from "./LanguageSelector";
import { UrlExtractor } from "@/services/urlExtractor";

// Define TypeScript interfaces for type safety
interface AppStore {
  uploadedFile: File | null;
  error: string | null;
  setError: (error: string) => void;
  clearError: () => void;
}

interface DocumentProcessor {
  processFile: (file: File) => Promise<string | null>;
  processText: (text: string) => boolean;
  validateFile: (file: File) => { valid: boolean; error?: string };
}

interface Analysis {
  analyzeDocument: (text: string, type?: string) => void;
}

export const UploadPage: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [activeTab, setActiveTab] = useState("upload");
  const [isUrlLoading, setIsUrlLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_CHAR_LIMIT = 200000;

  const { uploadedFile, error, setError, clearError } =
    useAppStore() as AppStore;
  const { processFile, processText, validateFile } =
    useDocumentProcessor() as DocumentProcessor;
  const { analyzeDocument } = useAnalysis() as Analysis;
  const { playUpload, playSuccess, playError } = useAudioFeedback();
  const urlExtractor = new UrlExtractor();

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Process uploaded file
  const handleFileUpload = useCallback(
    async (file: File) => {
      clearError();
      console.log(
        "Starting file upload processing:",
        file.name,
        file.type,
        file.size
      );

      // Validate file first
      const validation = validateFile(file);
      if (!validation.valid) {
        setError(validation.error || "Invalid file.");
        playError();
        return;
      }

      try {
        playUpload();
        console.log("Calling processFile...");
        const extractedText = await processFile(file);
        console.log(
          "processFile completed, extracted text length:",
          extractedText?.length
        );
        if (extractedText) {
          playSuccess();
          console.log("Text extracted successfully, showing preview...");
          // Preview will be shown automatically by the app state management
          // User can review and edit before proceeding to analysis
        } else {
          setError("No text could be extracted from the file.");
          playError();
        }
      } catch (error) {
        console.error("File processing error:", error);
        setError("Failed to process file. Please try again.");
        playError();
      }
    },
    [
      clearError,
      setError,
      validateFile,
      processFile,
      analyzeDocument,
      playUpload,
      playSuccess,
      playError,
    ]
  );

  // Handle file drop
  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      clearError();

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await handleFileUpload(files[0]);
      }
    },
    [clearError, handleFileUpload]
  );

  // Handle file selection
  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        await handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  // Handle text input
  const handleTextSubmit = useCallback(() => {
    clearError();

    if (textInput.length > MAX_CHAR_LIMIT) {
      setError(
        `Text exceeds ${MAX_CHAR_LIMIT.toLocaleString()} character limit.`
      );
      playError();
      return;
    }

    if (textInput.trim().length < 50) {
      setError("Text input must be at least 50 characters.");
      playError();
      return;
    }

    if (processText(textInput)) {
      playUpload();
      // Automatically start analysis
      analyzeDocument(textInput);
      playSuccess();
    } else {
      setError("Failed to process text. Please try again.");
      playError();
    }
  }, [
    textInput,
    clearError,
    setError,
    processText,
    analyzeDocument,
    playUpload,
    playSuccess,
    playError,
  ]);

  // Handle URL input
  const handleUrlSubmit = useCallback(async () => {
    clearError();

    if (!UrlExtractor.isValidUrl(urlInput)) {
      setError("Please enter a valid URL (e.g., https://example.com)");
      playError();
      return;
    }

    setIsUrlLoading(true);

    try {
      playUpload();
      const result = await urlExtractor.extractWithRetry(urlInput);

      if (!result.text || result.text.trim().length < 50) {
        setError("The webpage doesn't contain enough readable text content.");
        playError();
        return;
      }

      if (processText(result.text)) {
        playSuccess();
        // Automatically start analysis with the extracted text
        analyzeDocument(result.text, "webpage");
      } else {
        setError("Failed to process extracted text. Please try again.");
        playError();
      }
    } catch (error) {
      console.error("URL extraction error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to extract content from URL. Please try again."
      );
      playError();
    } finally {
      setIsUrlLoading(false);
    }
  }, [
    urlInput,
    clearError,
    setError,
    processText,
    analyzeDocument,
    playUpload,
    playSuccess,
    playError,
    urlExtractor,
  ]);

  // Load sample document
  const loadSample = useCallback((sampleKey: keyof typeof sampleDocuments) => {
    const sampleText = sampleDocuments[sampleKey];
    setTextInput(sampleText);
    setActiveTab("text");
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  return (
    <div className="max-w-4xl mx-auto pt-20">
      {/* Header */}
      <div className="text-center mb-8">
        {/* <div className="flex justify-center mb-6">
          <HeroLogo />
        </div> */}
        <div className="flex items-center justify-center mb-4">
          <Coffee className="h-10 w-10 text-amber-600 mr-4" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent">
            Understand any legal document in <AnimatedLanguageText />
          </h1>
          <Coffee className="h-10 w-10 text-amber-600 ml-4" />
        </div>
        <p className="text-lg text-amber-700 mb-2 font-medium">
          Upload your contract, lease, or legal document to get started
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          <span>Your document stays private and secure</span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-destructive/20 bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Upload Interface */}
      <AnimatedCard animation="fade-up" className="mb-6">
        <CardHeader>
          <CardTitle>Choose how to add your document</CardTitle>
          <CardDescription>
            We support PDF and Word documents, paste text directly, or extract
            content from webpages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="text">Paste Text</TabsTrigger>
              <TabsTrigger value="url">Enter URL</TabsTrigger>
            </TabsList>

            {/* File Upload Tab */}
            <TabsContent value="upload" className="mt-6">
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-info bg-info/10"
                    : uploadedFile
                    ? "border-success bg-success/10"
                    : "border-border hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {uploadedFile ? (
                  // File uploaded state
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-700">
                        File Ready!
                      </h3>
                      <p className="text-green-600">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(uploadedFile.size)} •{" "}
                        {uploadedFile.type.includes("pdf")
                          ? "PDF"
                          : "Word Document"}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose Different File
                    </Button>
                  </div>
                ) : (
                  // Default upload state
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Upload className="h-12 w-12 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700">
                        Drop your contract here
                      </h3>
                      <p className="text-gray-500">
                        or click to browse your files
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <File className="h-4 w-4" />
                        <span>PDF</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        <span>Word</span>
                      </div>
                      <span>•</span>
                      <span>Max 10MB</span>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4"
                    >
                      Browse Files
                    </Button>
                  </div>
                )}
              </div>

              {/* Document Type Examples */}
              <StaggeredCards className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <AnimatedCard
                  animation="hover-lift"
                  className="text-center p-4"
                >
                  <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h4 className="font-medium">Leases & Rentals</h4>
                  <p className="text-sm text-muted-foreground">
                    Apartment leases, rental agreements
                  </p>
                </AnimatedCard>
                <AnimatedCard
                  animation="hover-lift"
                  className="text-center p-4"
                >
                  <FileImage className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h4 className="font-medium">Contracts & NDAs</h4>
                  <p className="text-sm text-muted-foreground">
                    Service agreements, NDAs
                  </p>
                </AnimatedCard>
                <AnimatedCard
                  animation="hover-lift"
                  className="text-center p-4"
                >
                  <File className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h4 className="font-medium">Terms of Service</h4>
                  <p className="text-sm text-muted-foreground">
                    Website terms, user agreements
                  </p>
                </AnimatedCard>
              </StaggeredCards>
            </TabsContent>

            {/* Text Input Tab */}
            <TabsContent value="text" className="mt-6">
              <div className="space-y-4">
                <AnimatedTextarea
                  placeholder="Paste your legal text here..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[200px] resize-none"
                  animation="focus-ring"
                />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {textInput.length.toLocaleString()} /{" "}
                    {MAX_CHAR_LIMIT.toLocaleString()} characters
                  </div>
                  <AnimatedButton
                    onClick={handleTextSubmit}
                    disabled={
                      textInput.trim().length < 50 ||
                      textInput.length > MAX_CHAR_LIMIT
                    }
                  >
                    Analyze Text
                  </AnimatedButton>
                </div>
              </div>

              {/* Sample Documents */}
              <div className="mt-6">
                <h4 className="font-medium mb-3">Try a sample document:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <AnimatedButton
                    variant="outline"
                    size="sm"
                    onClick={() => loadSample("lease")}
                    className="justify-start"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Sample Lease
                  </AnimatedButton>
                  <AnimatedButton
                    variant="outline"
                    size="sm"
                    onClick={() => loadSample("nda")}
                    className="justify-start"
                  >
                    <File className="h-4 w-4 mr-2" />
                    Sample NDA
                  </AnimatedButton>
                  <AnimatedButton
                    variant="outline"
                    size="sm"
                    onClick={() => loadSample("contract")}
                    className="justify-start"
                  >
                    <FileImage className="h-4 w-4 mr-2" />
                    Sample Contract
                  </AnimatedButton>
                </div>
              </div>
            </TabsContent>

            {/* URL Input Tab */}
            <TabsContent value="url" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="url-input" className="text-sm font-medium">
                    Enter webpage URL
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        id="url-input"
                        type="url"
                        placeholder="https://example.com/legal-document"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        disabled={isUrlLoading}
                      />
                    </div>
                    <AnimatedButton
                      onClick={handleUrlSubmit}
                      disabled={
                        !urlInput.trim() ||
                        !UrlExtractor.isValidUrl(urlInput) ||
                        isUrlLoading
                      }
                      className="px-6"
                    >
                      {isUrlLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Extracting...
                        </>
                      ) : (
                        <>
                          <Link className="h-4 w-4 mr-2" />
                          Extract Text
                        </>
                      )}
                    </AnimatedButton>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We'll extract the main text content from the webpage,
                    removing navigation, ads, and other non-content elements.
                  </p>
                </div>

                {/* URL Examples */}
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Try extracting from:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <AnimatedButton
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setUrlInput(
                          "https://policies.google.com/privacy?hl=en-US"
                        )
                      }
                      className="justify-start text-left"
                      disabled={isUrlLoading}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Privacy Policy (Google)
                    </AnimatedButton>
                    <AnimatedButton
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setUrlInput(
                          "https://en.wikipedia.org/wiki/Terms_of_service"
                        )
                      }
                      className="justify-start text-left"
                      disabled={isUrlLoading}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Terms of Service (Wikipedia)
                    </AnimatedButton>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </AnimatedCard>

      {/* Trust Signals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span>Documents processed locally</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span>No data stored permanently</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <span>Secure & private analysis</span>
        </div>
      </div>
    </div>
  );
};
