import { useEffect, useRef, useState } from "react";

// Hook for managing animation states and performance
export const useAnimations = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  useEffect(() => {
    // Check for user's motion preferences
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Get animation classes based on user preferences
  const getAnimationClass = (animationClass: string, fallbackClass = "") => {
    if (reducedMotion || !animationsEnabled) {
      return fallbackClass;
    }
    return animationClass;
  };

  return {
    reducedMotion,
    animationsEnabled,
    setAnimationsEnabled,
    getAnimationClass,
  };
};

// Hook for intersection observer animations
export const useIntersectionAnimation = (
  threshold = 0.1,
  rootMargin = "0px"
) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect after first intersection for performance
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isVisible };
};

// Hook for staggered animations
export const useStaggeredAnimation = (
  itemCount: number,
  delay = 100,
  startDelay = 0
) => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    for (let i = 0; i < itemCount; i++) {
      const timeout = setTimeout(() => {
        setVisibleItems((prev) => [...prev, i]);
      }, startDelay + i * delay);

      timeouts.push(timeout);
    }

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [itemCount, delay, startDelay]);

  const isItemVisible = (index: number) => visibleItems.includes(index);

  return { isItemVisible, visibleItems };
};

// Hook for ripple effect
export const useRipple = () => {
  const [ripples, setRipples] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
    }>
  >([]);

  const addRipple = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y }]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);
  };

  return { ripples, addRipple };
};

// Hook for count-up animation
export const useCountUp = (
  end: number,
  duration = 1000,
  start = 0,
  enabled = true
) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = () => {
    if (!enabled || isAnimating) return;

    setIsAnimating(true);
    const startTime = Date.now();
    const startValue = count;
    const difference = end - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + difference * easeOut);

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  };

  return { count, startAnimation, isAnimating };
};

// Hook for typewriter effect
export const useTypewriter = (
  text: string,
  speed = 50,
  startDelay = 0,
  enabled = true
) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const startTyping = () => {
    if (!enabled || isTyping) return;

    setIsTyping(true);
    setDisplayText("");
    setIsComplete(false);

    setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          setIsComplete(true);
        }
      }, speed);
    }, startDelay);
  };

  return { displayText, isTyping, isComplete, startTyping };
};

// Animation timing constants
export const ANIMATION_TIMINGS = {
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
} as const;

// Animation easing functions
export const ANIMATION_EASINGS = {
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  snappy: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
} as const;
