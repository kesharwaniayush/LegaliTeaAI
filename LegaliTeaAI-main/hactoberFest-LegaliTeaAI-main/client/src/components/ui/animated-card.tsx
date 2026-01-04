import React from "react";
import { Card } from "./card";
import { useAnimations, useIntersectionAnimation } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends React.ComponentProps<"div"> {
  animation?: "fade-up" | "scale" | "slide-right" | "hover-lift" | "glow";
  delay?: number;
  stagger?: boolean;
  hover?: boolean;
  loading?: boolean;
}

export const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  (
    {
      className,
      animation = "fade-up",
      delay = 0,
      stagger = false,
      hover = true,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const { getAnimationClass } = useAnimations();
    const { ref: intersectionRef, isVisible } = useIntersectionAnimation();

    const getAnimationClasses = () => {
      const baseClasses = getAnimationClass(
        "transition-all duration-300 ease-out"
      );

      if (loading) {
        return cn(baseClasses, "animate-skeleton-pulse");
      }

      let animationClasses = "";

      // Entry animations
      if (!isVisible) {
        switch (animation) {
          case "fade-up":
            animationClasses = "opacity-0 translate-y-4";
            break;
          case "scale":
            animationClasses = "opacity-0 scale-95";
            break;
          case "slide-right":
            animationClasses = "opacity-0 translate-x-4";
            break;
          default:
            animationClasses = "opacity-0";
        }
      } else {
        switch (animation) {
          case "fade-up":
            animationClasses = getAnimationClass("animate-fade-in-up");
            break;
          case "scale":
            animationClasses = getAnimationClass("animate-scale-in");
            break;
          case "slide-right":
            animationClasses = getAnimationClass("animate-slide-in-right");
            break;
          default:
            animationClasses = getAnimationClass("animate-fade-in");
        }
      }

      // Hover animations
      if (hover && isVisible) {
        switch (animation) {
          case "hover-lift":
            animationClasses += ` ${getAnimationClass(
              "hover:-translate-y-2 hover:shadow-xl"
            )}`;
            break;
          case "glow":
            animationClasses += ` ${getAnimationClass(
              "hover:shadow-lg hover:shadow-primary/25"
            )}`;
            break;
          default:
            animationClasses += ` ${getAnimationClass(
              "hover:-translate-y-1 hover:shadow-lg"
            )}`;
        }
        animationClasses += ` ${getAnimationClass("hover:border-primary/30")}`;
      }

      return cn(baseClasses, animationClasses, "transform");
    };

    const combinedRef = (node: HTMLDivElement) => {
      intersectionRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    return (
      <Card
        ref={combinedRef}
        className={cn(getAnimationClasses(), className)}
        style={{
          animationDelay: `${delay}ms`,
          ...(props.style || {}),
        }}
        {...props}
      >
        {loading ? (
          <div className="space-y-3 p-6">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-20 w-full" />
          </div>
        ) : (
          children
        )}
      </Card>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

// Staggered cards container
interface StaggeredCardsProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggeredCards: React.FC<StaggeredCardsProps> = ({
  children,
  staggerDelay = 100,
  className = "",
}) => {
  const { getAnimationClass } = useAnimations();

  return (
    <div
      className={cn(
        "stagger-fade-in",
        getAnimationClass("space-y-4"),
        className
      )}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            ...child.props,
            delay: index * staggerDelay,
            stagger: true,
          });
        }
        return child;
      })}
    </div>
  );
};
