import React, { useState } from "react";
import { Input } from "./input";
import type { InputProps } from "./input";
import { Textarea } from "./textarea";
import { useAnimations } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Check, X, AlertCircle } from "lucide-react";

interface AnimatedInputProps extends InputProps {
  label?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  showPasswordToggle?: boolean;
  animation?: "focus-ring" | "scale" | "glow" | "slide";
}

export const AnimatedInput = React.forwardRef<
  HTMLInputElement,
  AnimatedInputProps
>(
  (
    {
      className,
      label,
      error,
      success = false,
      loading = false,
      showPasswordToggle = false,
      animation = "focus-ring",
      type,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { getAnimationClass } = useAnimations();

    const inputType =
      showPasswordToggle && type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

    const getAnimationClasses = () => {
      const baseClasses = getAnimationClass(
        "transition-all duration-300 ease-out"
      );

      let animationClasses = "";

      switch (animation) {
        case "focus-ring":
          animationClasses = cn(
            "focus:ring-2 focus:ring-primary/30 focus:border-primary",
            isFocused &&
              getAnimationClass("ring-2 ring-primary/30 border-primary")
          );
          break;

        case "scale":
          animationClasses = cn(
            "focus:scale-[1.02] transform",
            isFocused && getAnimationClass("scale-[1.02]")
          );
          break;

        case "glow":
          animationClasses = cn(
            "focus:shadow-lg focus:shadow-primary/25",
            isFocused && getAnimationClass("shadow-lg shadow-primary/25")
          );
          break;

        case "slide":
          animationClasses = cn(
            "focus:translate-x-1 transform",
            isFocused && getAnimationClass("translate-x-1")
          );
          break;
      }

      // State-based styling
      if (error) {
        animationClasses +=
          " border-red-500 focus:border-red-500 focus:ring-red-500/30";
      } else if (success) {
        animationClasses +=
          " border-green-500 focus:border-green-500 focus:ring-green-500/30";
      }

      if (loading) {
        animationClasses += " animate-pulse cursor-wait";
      }

      return cn(baseClasses, animationClasses);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label
            className={cn(
              "block text-sm font-medium transition-colors duration-200",
              isFocused ? "text-primary" : "text-foreground",
              error ? "text-red-500" : "",
              success ? "text-green-500" : ""
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          <Input
            ref={ref}
            type={inputType}
            className={cn(getAnimationClasses(), className)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={loading}
            {...props}
          />

          {/* Status Icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {loading && (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-50" />
            )}

            {success && !loading && (
              <Check
                className={cn(
                  "w-4 h-4 text-green-500",
                  getAnimationClass("animate-scale-in")
                )}
              />
            )}

            {error && !loading && (
              <AlertCircle
                className={cn(
                  "w-4 h-4 text-red-500",
                  getAnimationClass("animate-bounce-gentle")
                )}
              />
            )}

            {showPasswordToggle && type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  "p-1 rounded hover:bg-accent transition-colors duration-200",
                  getAnimationClass("hover:scale-110 active:scale-95")
                )}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Error/Success Message */}
        {(error || success) && (
          <div
            className={cn(
              "text-sm flex items-center space-x-1",
              getAnimationClass("animate-fade-in-up"),
              error ? "text-red-500" : "text-green-500"
            )}
          >
            {error && <AlertCircle className="w-3 h-3" />}
            {success && <Check className="w-3 h-3" />}
            <span>{error || (success && "Looks good!")}</span>
          </div>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

// Animated Textarea
interface AnimatedTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  animation?: "focus-ring" | "scale" | "glow";
}

export const AnimatedTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AnimatedTextareaProps
>(
  (
    {
      className,
      label,
      error,
      success = false,
      loading = false,
      animation = "focus-ring",
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const { getAnimationClass } = useAnimations();

    const getAnimationClasses = () => {
      const baseClasses = getAnimationClass(
        "transition-all duration-300 ease-out"
      );

      let animationClasses = "";

      switch (animation) {
        case "focus-ring":
          animationClasses = cn(
            "focus:ring-2 focus:ring-primary/30 focus:border-primary",
            isFocused &&
              getAnimationClass("ring-2 ring-primary/30 border-primary")
          );
          break;

        case "scale":
          animationClasses = cn(
            "focus:scale-[1.01] transform",
            isFocused && getAnimationClass("scale-[1.01]")
          );
          break;

        case "glow":
          animationClasses = cn(
            "focus:shadow-lg focus:shadow-primary/25",
            isFocused && getAnimationClass("shadow-lg shadow-primary/25")
          );
          break;
      }

      if (error) {
        animationClasses +=
          " border-red-500 focus:border-red-500 focus:ring-red-500/30";
      } else if (success) {
        animationClasses +=
          " border-green-500 focus:border-green-500 focus:ring-green-500/30";
      }

      if (loading) {
        animationClasses += " animate-pulse cursor-wait";
      }

      return cn(baseClasses, animationClasses);
    };

    return (
      <div className="space-y-2">
        {label && (
          <label
            className={cn(
              "block text-sm font-medium transition-colors duration-200",
              isFocused ? "text-primary" : "text-foreground",
              error ? "text-red-500" : "",
              success ? "text-green-500" : ""
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <Textarea
          ref={ref}
          className={cn(getAnimationClasses(), className)}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          disabled={loading}
          {...props}
        />

        {(error || success) && (
          <div
            className={cn(
              "text-sm flex items-center space-x-1",
              getAnimationClass("animate-fade-in-up"),
              error ? "text-red-500" : "text-green-500"
            )}
          >
            {error && <AlertCircle className="w-3 h-3" />}
            {success && <Check className="w-3 h-3" />}
            <span>{error || (success && "Looks good!")}</span>
          </div>
        )}
      </div>
    );
  }
);

AnimatedTextarea.displayName = "AnimatedTextarea";
