import React, { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  File,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { useAnimations } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";
import { AnimatedButton } from "./animated-button";

interface AnimatedUploadProps {
  onFileSelect: (file: File) => void;
  onFileRemove?: () => void;
  accept?: string;
  maxSize?: number; // in bytes
  uploadedFile?: File | null;
  error?: string;
  loading?: boolean;
  className?: string;
}

export const AnimatedUpload: React.FC<AnimatedUploadProps> = ({
  onFileSelect,
  onFileRemove,
  accept = ".pdf,.docx,.doc",
  maxSize = 10 * 1024 * 1024, // 10MB
  uploadedFile,
  error,
  loading = false,
  className = "",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const { getAnimationClass } = useAnimations();

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);

  const handleDragOut = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragCounter((prev) => prev - 1);
      if (dragCounter <= 1) {
        setDragActive(false);
      }
    },
    [dragCounter]
  );

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setDragCounter(0);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileValidation(file);
    }
  }, []);

  const handleFileValidation = (file: File) => {
    // Size validation
    if (file.size > maxSize) {
      return;
    }

    // Type validation
    const acceptedTypes = accept.split(",").map((type) => type.trim());
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    if (!acceptedTypes.includes(fileExtension)) {
      return;
    }

    onFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileValidation(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getUploadAreaClasses = () => {
    const baseClasses = cn(
      "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
      getAnimationClass("transition-all duration-300 ease-out transform")
    );

    if (loading) {
      return cn(
        baseClasses,
        "border-primary bg-primary/5 animate-pulse cursor-wait"
      );
    }

    if (error) {
      return cn(baseClasses, "border-red-500 bg-red-50 dark:bg-red-950/20");
    }

    if (uploadedFile) {
      return cn(
        baseClasses,
        "border-green-500 bg-green-50 dark:bg-green-950/20",
        getAnimationClass("animate-bounce-gentle")
      );
    }

    if (dragActive) {
      return cn(
        baseClasses,
        "border-primary bg-primary/10 scale-[1.02]",
        getAnimationClass("animate-bounce-gentle")
      );
    }

    return cn(
      baseClasses,
      "border-border hover:border-primary/50 hover:bg-accent/50",
      getAnimationClass("hover:scale-[1.01] hover:shadow-lg")
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={getUploadAreaClasses()}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() =>
          !loading && document.getElementById("file-input")?.click()
        }
      >
        <input
          id="file-input"
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          disabled={loading}
        />

        {loading ? (
          // Loading state
          <div
            className={cn("space-y-4", getAnimationClass("animate-fade-in"))}
          >
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">
                Processing...
              </h3>
              <p className="text-muted-foreground">
                Please wait while we process your file
              </p>
            </div>
          </div>
        ) : uploadedFile ? (
          // File uploaded state
          <div
            className={cn("space-y-4", getAnimationClass("animate-scale-in"))}
          >
            <div className="flex items-center justify-center">
              <CheckCircle2
                className={cn(
                  "h-12 w-12 text-green-500",
                  getAnimationClass("animate-bounce-gentle")
                )}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                File Ready!
              </h3>
              <p className="text-green-600 dark:text-green-300 font-medium">
                {uploadedFile.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(uploadedFile.size)} •{" "}
                {uploadedFile.type.includes("pdf") ? "PDF" : "Word Document"}
              </p>
            </div>
            {onFileRemove && (
              <AnimatedButton
                variant="outline"
                size="sm"
                animation="scale"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileRemove();
                }}
                className="mt-2"
              >
                <X className="h-4 w-4 mr-2" />
                Remove File
              </AnimatedButton>
            )}
          </div>
        ) : error ? (
          // Error state
          <div
            className={cn("space-y-4", getAnimationClass("animate-fade-in"))}
          >
            <div className="flex items-center justify-center">
              <AlertCircle
                className={cn(
                  "h-12 w-12 text-red-500",
                  getAnimationClass("animate-bounce-gentle")
                )}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                Upload Error
              </h3>
              <p className="text-red-600 dark:text-red-300">{error}</p>
            </div>
            <AnimatedButton
              variant="outline"
              size="sm"
              animation="scale"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById("file-input")?.click();
              }}
            >
              Try Again
            </AnimatedButton>
          </div>
        ) : (
          // Default upload state
          <div
            className={cn("space-y-4", getAnimationClass("animate-fade-in"))}
          >
            <div className="flex items-center justify-center">
              <Upload
                className={cn(
                  "h-12 w-12 text-muted-foreground",
                  dragActive &&
                    getAnimationClass("animate-bounce-gentle text-primary")
                )}
              />
            </div>
            <div>
              <h3
                className={cn(
                  "text-lg font-semibold transition-colors duration-200",
                  dragActive ? "text-primary" : "text-foreground"
                )}
              >
                {dragActive ? "Drop your file here" : "Drop your contract here"}
              </h3>
              <p className="text-muted-foreground">
                or click to browse your files
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <File className="h-4 w-4" />
                <span>PDF</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Word</span>
              </div>
              <span>•</span>
              <span>Max {Math.round(maxSize / (1024 * 1024))}MB</span>
            </div>
            <AnimatedButton
              animation="scale"
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById("file-input")?.click();
              }}
            >
              Browse Files
            </AnimatedButton>
          </div>
        )}

        {/* Drag overlay */}
        {dragActive && (
          <div
            className={cn(
              "absolute inset-0 bg-primary/10 border-2 border-primary border-dashed rounded-lg",
              "flex items-center justify-center",
              getAnimationClass("animate-fade-in")
            )}
          >
            <div className="text-center">
              <Upload
                className={cn(
                  "h-16 w-16 text-primary mx-auto mb-2",
                  getAnimationClass("animate-bounce-gentle")
                )}
              />
              <p className="text-primary font-semibold">Drop to upload</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
