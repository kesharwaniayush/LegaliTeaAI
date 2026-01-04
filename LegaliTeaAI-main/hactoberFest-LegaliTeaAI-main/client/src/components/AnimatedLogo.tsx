import React, { useState, useEffect } from "react";
import { Scale, Sparkles, Coffee } from "lucide-react";
import { useAnimations } from "@/hooks/useAnimations";

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSubtext?: boolean;
  autoStart?: boolean;
  className?: string;
  onAnimationComplete?: () => void;
}

interface SteamParticle {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = "md",
  showText = true,
  showSubtext = false,
  autoStart = true,
  className = "",
  onAnimationComplete,
}) => {
  const [animationStage, setAnimationStage] = useState(0);
  const [steamParticles, setSteamParticles] = useState<SteamParticle[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const { getAnimationClass } = useAnimations();

  // Typewriter effect disabled for stable logo

  // Size configurations
  const sizeConfig = {
    sm: {
      icon: "h-6 w-6",
      text: "text-lg",
      subtext: "text-xs",
      container: "space-x-2",
    },
    md: {
      icon: "h-8 w-8",
      text: "text-xl",
      subtext: "text-xs",
      container: "space-x-3",
    },
    lg: {
      icon: "h-12 w-12",
      text: "text-3xl",
      subtext: "text-sm",
      container: "space-x-4",
    },
    xl: {
      icon: "h-16 w-16",
      text: "text-4xl",
      subtext: "text-base",
      container: "space-x-6",
    },
  };

  const config = sizeConfig[size];

  // Generate steam particles
  const generateSteamParticles = () => {
    const particles: SteamParticle[] = [];
    const particleCount = isHovered ? 8 : 4;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: Date.now() + i,
        x: Math.random() * 20 - 10, // Random x offset
        y: 0,
        delay: i * 200,
        duration: 2000 + Math.random() * 1000,
      });
    }

    setSteamParticles(particles);
  };

  // Animation sequence
  useEffect(() => {
    if (!autoStart) return;

    const sequence = [
      { stage: 1, delay: 0 }, // Initial scale and fade
      { stage: 2, delay: 400 }, // Color reveal
      { stage: 3, delay: 800 }, // Steam animation
      { stage: 4, delay: 1000 }, // Text reveal
      { stage: 5, delay: 2000 }, // Complete
    ];

    const timeouts = sequence.map(({ stage, delay }) =>
      setTimeout(() => {
        setAnimationStage(stage);
        if (stage === 3) generateSteamParticles();
        if (stage === 5) onAnimationComplete?.();
      }, delay)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [autoStart, showText, onAnimationComplete]);

  // Hover effect for steam
  useEffect(() => {
    if (animationStage >= 3) {
      generateSteamParticles();
    }
  }, [isHovered, animationStage]);

  // Continuous steam generation after initial animation
  useEffect(() => {
    if (animationStage >= 5) {
      const interval = setInterval(() => {
        generateSteamParticles();
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [animationStage]);

  return (
    <div
      className={`
        flex items-center ${config.container} cursor-pointer
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo Icon with Steam */}
      <div className="relative">
        {/* Main Scale Icon */}
        <Scale
          className={`
            ${config.icon}
            ${
              animationStage >= 1
                ? getAnimationClass("animate-scale-in fill-forwards")
                : "opacity-0 scale-90"
            }
            ${
              animationStage >= 2
                ? "text-[#ff6e00] bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 bg-clip-text"
                : "text-amber-600"
            }
            ${getAnimationClass("transition-all duration-500 ease-out")}
            ${
              isHovered
                ? getAnimationClass("animate-bounce-gentle")
                : getAnimationClass("animate-logo-pulse")
            }
          `}
          style={{
            backgroundSize: animationStage >= 2 ? "200% 200%" : "100% 100%",
            animation:
              animationStage >= 2
                ? `${getAnimationClass(
                    "logo-gradient"
                  )} 3s ease-in-out infinite, ${getAnimationClass(
                    isHovered ? "bounce-gentle" : "logo-pulse"
                  )} 2s ease-in-out infinite`
                : undefined,
          }}
        />

        {/* Decorative Sparkle */}
        <Sparkles
          className={`
            absolute -top-1 -right-1 h-3 w-3 text-amber-500
            ${
              animationStage >= 2
                ? getAnimationClass("animate-ping opacity-75")
                : "opacity-0"
            }
            ${getAnimationClass("transition-opacity duration-300")}
          `}
        />

        {/* Steam Particles */}
        {animationStage >= 3 && (
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 pointer-events-none">
            {steamParticles.map((particle) => (
              <div
                key={particle.id}
                className={`
                  absolute w-1 h-1 bg-amber-500/30 rounded-full
                  ${getAnimationClass("animate-steam-float")}
                `}
                style={{
                  left: `${particle.x}px`,
                  animationDelay: `${particle.delay}ms`,
                  animationDuration: `${particle.duration}ms`,
                }}
              />
            ))}
          </div>
        )}

        {/* Glow Effect on Hover */}
        {isHovered && (
          <div
            className={`
              absolute inset-0 rounded-full
              bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-amber-600/20
              ${getAnimationClass("animate-ping")}
              blur-sm -z-10
            `}
          />
        )}
      </div>

      {/* Text Content */}
      {showText && (
        <div className="flex flex-col">
          {/* Main Title */}
          <div className="relative overflow-hidden">
            <h1
              className={`
                ${config.text} font-bold
                bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent
                ${getAnimationClass("transition-all duration-500 ease-out")}
                drop-shadow-sm
              `}
              style={{
                backgroundSize: "200% 200%",
                animation: `${getAnimationClass("logo-gradient")} 3s ease-in-out infinite`,
              }}
            >
              LegaliTea
            </h1>

            {/* Typewriter Cursor - Removed since effect is disabled */}
          </div>

          {/* Subtitle */}
          {showSubtext && (
            <span
              className={`
                ${config.subtext} text-muted-foreground -mt-1
                ${getAnimationClass("animate-fade-in delay-500")}
              `}
            >
              AI Legal Assistant
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Simplified version for navbar
export const NavbarLogo: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <AnimatedLogo
      size="md"
      showText={true}
      showSubtext={true}
      autoStart={true}
      className={className}
    />
  );
};

// Hero version for main page
export const HeroLogo: React.FC<{
  className?: string;
  onComplete?: () => void;
}> = ({ className = "", onComplete }) => {
  return (
    <AnimatedLogo
      size="xl"
      showText={true}
      showSubtext={false}
      autoStart={true}
      className={className}
      onAnimationComplete={onComplete}
    />
  );
};
