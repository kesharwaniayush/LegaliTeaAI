import React, { useState, useEffect } from "react";
import { Menu, X, Scale, FileText, Shield, Sparkles, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSelector } from "./LanguageSelector";
import { NavbarLogo } from "./AnimatedLogo";
import { AudioSettings } from "./AudioSettings";
import { TTSSettings } from "./TTSSettings";
import { useAnimations } from "@/hooks/useAnimations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EnhancedNavBarProps {
  className?: string;
}

export const EnhancedNavBar: React.FC<EnhancedNavBarProps> = ({
  className = "",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getAnimationClass } = useAnimations();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".mobile-menu") &&
        !target.closest(".mobile-menu-button")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const navItems = [
    {
      name: "Analyze",
      href: "#",
      icon: FileText,
      dialogContent: {
        title: "Document Analysis Demo",
        description: "Experience our AI-powered legal document analysis in action.",
        content: (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-blue-800 mb-2">Sample Analysis</h4>
              <p className="text-sm text-blue-700 mb-3">
                Upload any legal document (PDF, Word, or text) to see our AI analysis in action.
              </p>
              <div className="space-y-2 text-xs text-blue-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Risk assessment with severity scoring</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Plain English summaries</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Actionable recommendations</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Try it now - upload a document to see the magic happen!
              </p>
            </div>
          </div>
        ),
      },
    },
    {
      name: "Privacy",
      href: "#",
      icon: Shield,
      dialogContent: {
        title: "Privacy & Security",
        description: "Your documents are safe with us.",
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">🔒 End-to-End Encryption</h4>
                <p className="text-sm text-green-700">
                  All data is encrypted in transit and at rest using industry-standard encryption.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">⏰ Auto-Deletion</h4>
                <p className="text-sm text-blue-700">
                  Documents are automatically deleted after 24 hours for your privacy.
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">🚫 No Permanent Storage</h4>
                <p className="text-sm text-purple-700">
                  Files are processed in memory and never permanently stored.
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">🎯 Privacy-First</h4>
                <p className="text-sm text-orange-700">
                  Minimal data collection with your explicit consent only.
                </p>
              </div>
            </div>
          </div>
        ),
      },
    },
    {
      name: "Features",
      href: "#",
      icon: Sparkles,
      dialogContent: {
        title: "Advanced Features",
        description: "Discover what makes LegaliTea special.",
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border">
                <h4 className="font-semibold text-purple-800 mb-2">🎮 Gamified Learning</h4>
                <p className="text-sm text-purple-700 mb-2">
                  Interactive quizzes and achievement system to learn legal concepts.
                </p>
                <div className="flex items-center space-x-2 text-xs text-purple-600">
                  <span>Points & Levels</span>
                  <span>•</span>
                  <span>Badges</span>
                  <span>•</span>
                  <span>Progress Tracking</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border">
                <h4 className="font-semibold text-green-800 mb-2">🔊 Audio Feedback</h4>
                <p className="text-sm text-green-700 mb-2">
                  Procedural audio system with 5 different sound types.
                </p>
                <div className="flex items-center space-x-2 text-xs text-green-600">
                  <span>Success Sounds</span>
                  <span>•</span>
                  <span>Error Feedback</span>
                  <span>•</span>
                  <span>Customizable</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg border">
                <h4 className="font-semibold text-yellow-800 mb-2">🗺️ Visual Mapping</h4>
                <p className="text-sm text-yellow-700 mb-2">
                  Transform contracts into interactive flowcharts.
                </p>
                <div className="flex items-center space-x-2 text-xs text-yellow-600">
                  <span>Party Relationships</span>
                  <span>•</span>
                  <span>Obligation Flows</span>
                  <span>•</span>
                  <span>Timeline Views</span>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-lg border">
                <h4 className="font-semibold text-red-800 mb-2">🌍 Multi-Language</h4>
                <p className="text-sm text-red-700 mb-2">
                  Native AI responses in 12+ languages.
                </p>
                <div className="flex items-center space-x-2 text-xs text-red-600">
                  <span>English, Spanish, French</span>
                  <span>•</span>
                  <span>German, Chinese</span>
                  <span>•</span>
                  <span>Hindi & More</span>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    },
    {
      name: "Legal",
      href: "#",
      icon: Scale,
      dialogContent: {
        title: "Legal Disclaimer",
        description: "Important legal information about our service.",
        content: (
          <div className="space-y-4">
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2">⚠️ Not Legal Advice</h4>
              <p className="text-sm text-amber-700">
                LegaliTea AI provides document analysis and educational tools only. It is not a substitute for professional legal advice.
              </p>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <h5 className="font-medium text-foreground mb-1">AI Analysis</h5>
                <p className="text-muted-foreground">
                  Our AI provides analysis based on patterns and legal concepts, but cannot replace human legal expertise.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground mb-1">Educational Purpose</h5>
                <p className="text-muted-foreground">
                  Features like quizzes and scenarios are designed for educational purposes to help users understand legal concepts.
                </p>
              </div>
              <div>
                <h5 className="font-medium text-foreground mb-1">Professional Consultation</h5>
                <p className="text-muted-foreground">
                  Always consult with a qualified legal professional for specific legal matters and before making important decisions.
                </p>
              </div>
            </div>
          </div>
        ),
      },
    },
  ];

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-40
          ${getAnimationClass("transition-all duration-300 ease-out")}
          ${
            isScrolled
              ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border/50"
              : "bg-background/80 backdrop-blur-sm"
          }
          ${className}
        `}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <NavbarLogo className={getAnimationClass("animate-fade-in")} />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) =>
                item.dialogContent ? (
                  <Dialog key={item.name}>
                    <DialogTrigger asChild>
                      <a
                        href={item.href}
                        className={`
                          flex items-center space-x-2 px-4 py-2 rounded-lg
                          ${getAnimationClass("transition-all duration-200 ease-out")}
                          ${getAnimationClass("hover:scale-105 hover:shadow-md")}
                          text-muted-foreground hover:text-foreground hover:bg-accent/50
                        `}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.name}</span>
                      </a>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{item.dialogContent.title}</DialogTitle>
                        <DialogDescription>
                          {item.dialogContent.description}
                        </DialogDescription>
                      </DialogHeader>
                      {item.dialogContent.content}
                    </DialogContent>
                  </Dialog>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg
                      ${getAnimationClass("transition-all duration-200 ease-out")}
                      ${getAnimationClass("hover:scale-105 hover:shadow-md")}
                      text-muted-foreground hover:text-foreground hover:bg-accent/50
                      ${getAnimationClass(
                        `animate-slide-in-right delay-${index * 100}`
                      )}
                    `}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                )
              )}

              {/* Saved Analyses Button - Coming Soon */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg
                    ${getAnimationClass("transition-all duration-200 ease-out")}
                    text-muted-foreground/60 cursor-not-allowed
                  `}
                >
                  <History className="h-4 w-4" />
                  <span className="font-medium">Saved</span>
                </Button>
                <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-1 py-0.5 rounded-full font-bold">
                  Soon
                </div>
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-border mx-2" />
            </div>

            {/* Controls Section */}
            <div className="flex items-center space-x-2">
              <div
                className={`hidden sm:flex items-center space-x-2 ${getAnimationClass(
                  "animate-fade-in delay-300"
                )}`}
              >
                <AudioSettings />
                <TTSSettings />
                <LanguageSelector />
                <ThemeToggle />
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className={`
                  md:hidden mobile-menu-button
                  ${getAnimationClass("hover:scale-110 active:scale-95")}
                  transition-all duration-200
                `}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu fixed inset-0 z-50 bg-background/95 backdrop-blur-md pt-16 pointer-events-auto">
          <div className="container mx-auto px-4 py-8">
            <div className="grid gap-4">
              {navItems.map((item) =>
                item.dialogContent ? (
                  <Dialog key={item.name}>
                    <DialogTrigger asChild>
                      <a
                        href={item.href}
                        className="flex items-center space-x-3 p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </a>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{item.dialogContent.title}</DialogTitle>
                        <DialogDescription>
                          {item.dialogContent.description}
                        </DialogDescription>
                      </DialogHeader>
                      {item.dialogContent.content}
                    </DialogContent>
                  </Dialog>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
