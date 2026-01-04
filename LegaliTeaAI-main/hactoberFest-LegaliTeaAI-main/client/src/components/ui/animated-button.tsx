import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  loading?: boolean;
  success?: boolean;
  error?: boolean;
  animation?: "scale" | "bounce" | "pulse" | "none";
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, variant = "default", size = "default", loading = false, success = false, error = false, animation = "none", disabled, ...props }, ref) => {
    const [isClicked, setIsClicked] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      if (success || error) {
        const timer = setTimeout(() => {
          // Reset state after animation
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [success, error]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
      if (props.onClick) {
        props.onClick(e);
      }
    };

    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    };

    const sizeClasses = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md",
      lg: "h-11 px-8 rounded-md",
      icon: "h-10 w-10"
    };

    const stateClasses = success
      ? "bg-green-500 text-white"
      : error
      ? "bg-red-500 text-white"
      : loading
      ? "opacity-75 cursor-not-allowed"
      : "";

    const animationClasses = animation === "scale"
      ? "hover:scale-105 active:scale-95 transition-transform duration-200"
      : animation === "bounce"
      ? "hover:animate-bounce"
      : animation === "pulse"
      ? "hover:animate-pulse"
      : "";

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          stateClasses,
          animationClasses,
          isClicked && "scale-95",
          className
        )}
        ref={ref || buttonRef}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {success && (
          <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
        {error && (
          <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        {success ? "Success!" : error ? "Error!" : children}
      </button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";