// Text-to-Speech Service using Web Speech API

interface TTSSettings {
  enabled: boolean;
  voice: string | null;
  rate: number; // 0.1 - 10
  pitch: number; // 0 - 2
  volume: number; // 0 - 1
}

type TTSEventType = "start" | "end" | "pause" | "resume" | "error" | "boundary";

type TTSEventCallback = (data?: unknown) => void;

class TextToSpeechService {
  private synthesis: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private settings: TTSSettings;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isInitialized = false;
  private eventListeners: Map<TTSEventType, Set<TTSEventCallback>> = new Map();

  constructor() {
    this.settings = this.loadSettings();
    this.initializeTTS();
  }

  private loadSettings(): TTSSettings {
    const saved = localStorage.getItem("legalitea-tts-settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.warn("Failed to parse TTS settings:", error);
      }
    }

    return {
      enabled: true,
      voice: null,
      rate: 1.0,
      pitch: 1.0,
      volume: 0.8,
    };
  }

  private saveSettings(): void {
    localStorage.setItem(
      "legalitea-tts-settings",
      JSON.stringify(this.settings)
    );
  }

  private async initializeTTS(): Promise<void> {
    try {
      if (!("speechSynthesis" in window)) {
        console.warn("Speech synthesis not supported");
        this.settings.enabled = false;
        return;
      }

      this.synthesis = window.speechSynthesis;
      await this.loadVoices();
      this.isInitialized = true;
    } catch (error) {
      console.warn("Failed to initialize TTS:", error);
      this.settings.enabled = false;
    }
  }

  private async loadVoices(): Promise<void> {
    return new Promise((resolve) => {
      const loadVoicesImpl = () => {
        this.voices = this.synthesis?.getVoices() || [];

        // Set default voice if none selected
        if (!this.settings.voice && this.voices.length > 0) {
          // Prefer English voices
          const englishVoice =
            this.voices.find(
              (voice) => voice.lang.startsWith("en") && voice.default
            ) ||
            this.voices.find((voice) => voice.lang.startsWith("en")) ||
            this.voices[0];

          this.settings.voice = englishVoice.name;
          this.saveSettings();
        }

        resolve();
      };

      if (this.voices.length === 0) {
        // Voices might not be loaded yet
        this.synthesis?.addEventListener("voiceschanged", loadVoicesImpl);
        // Also try immediately in case they're already loaded
        setTimeout(loadVoicesImpl, 100);
      } else {
        loadVoicesImpl();
      }
    });
  }

  // Event management
  addEventListener(event: TTSEventType, callback: TTSEventCallback): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback);
  }

  removeEventListener(event: TTSEventType, callback: TTSEventCallback): void {
    this.eventListeners.get(event)?.delete(callback);
  }

  private emit(event: TTSEventType, data?: unknown): void {
    this.eventListeners.get(event)?.forEach((callback) => callback(data));
  }

  // Main TTS functionality
  async speak(text: string, options?: Partial<TTSSettings>): Promise<void> {
    if (!this.settings.enabled || !this.isInitialized || !this.synthesis) {
      return;
    }

    // Stop any current speech
    this.stop();

    // Clean and prepare text
    const cleanText = this.cleanText(text);
    if (!cleanText.trim()) return;

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Apply settings
      const voice = this.voices.find(
        (v) => v.name === (options?.voice || this.settings.voice)
      );
      if (voice) utterance.voice = voice;

      utterance.rate = options?.rate || this.settings.rate;
      utterance.pitch = options?.pitch || this.settings.pitch;
      utterance.volume = options?.volume || this.settings.volume;

      // Event handlers
      utterance.onstart = () => {
        this.emit("start");
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        this.emit("end");
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        this.emit("error", event.error);
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      utterance.onpause = () => {
        this.emit("pause");
      };

      utterance.onresume = () => {
        this.emit("resume");
      };

      utterance.onboundary = (event) => {
        this.emit("boundary", event);
      };

      this.currentUtterance = utterance;
      this.synthesis?.speak(utterance);
    });
  }

  // Control methods
  pause(): void {
    if (this.synthesis && this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  resume(): void {
    if (this.synthesis && this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  stop(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
      this.currentUtterance = null;
    }
  }

  // Status methods
  isSpeaking(): boolean {
    return this.synthesis?.speaking || false;
  }

  isPaused(): boolean {
    return this.synthesis?.paused || false;
  }

  // Text processing
  private cleanText(text: string): string {
    return (
      text
        // Remove markdown formatting
        .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
        .replace(/\*(.*?)\*/g, "$1") // Italic
        .replace(/`(.*?)`/g, "$1") // Code
        .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Links
        // Clean up whitespace
        .replace(/\s+/g, " ")
        .trim()
    );
  }

  // Utility methods for analysis results
  speakSummary(summary: { tldr: string; keyPoints: string[] }): Promise<void> {
    const text = `Summary: ${
      summary.tldr
    }. Key points: ${summary.keyPoints.join(". ")}.`;
    return this.speak(text);
  }

  speakKeyPoints(keyPoints: string[]): Promise<void> {
    const text = `Key points: ${keyPoints
      .map((point, index) => `Point ${index + 1}: ${point}`)
      .join(". ")}.`;
    return this.speak(text);
  }

  speakRisks(
    risks: Array<{ clause: string; risk: string; explanation: string }>
  ): Promise<void> {
    if (risks.length === 0) {
      return this.speak("No significant risks identified in this document.");
    }

    const text = `Risk assessment: ${risks
      .map(
        (risk, index) =>
          `Risk ${index + 1}: ${risk.clause}. ${risk.explanation}`
      )
      .join(". ")}.`;
    return this.speak(text);
  }

  speakActionPlan(
    actions: Array<{ task: string; priority: string }>
  ): Promise<void> {
    const text = `Action plan: ${actions
      .map(
        (action, index) =>
          `Action ${index + 1}: ${action.task}. Priority: ${action.priority}`
      )
      .join(". ")}.`;
    return this.speak(text);
  }

  // Settings management
  getSettings(): TTSSettings {
    return { ...this.settings };
  }

  getVoices(): SpeechSynthesisVoice[] {
    return [...this.voices];
  }

  updateSettings(newSettings: Partial<TTSSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled;
    if (!enabled) this.stop();
    this.saveSettings();
  }

  setVoice(voiceName: string): void {
    this.settings.voice = voiceName;
    this.saveSettings();
  }

  setRate(rate: number): void {
    this.settings.rate = Math.max(0.1, Math.min(10, rate));
    this.saveSettings();
  }

  setPitch(pitch: number): void {
    this.settings.pitch = Math.max(0, Math.min(2, pitch));
    this.saveSettings();
  }

  setVolume(volume: number): void {
    this.settings.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  // Test method
  async testVoice(voiceName?: string): Promise<void> {
    const testText =
      "This is a test of the text to speech system for LegaliTea.";
    return this.speak(testText, voiceName ? { voice: voiceName } : undefined);
  }
}

// Create singleton instance
export const textToSpeech = new TextToSpeechService();

// React hook for text-to-speech
export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    const handleStart = () => setIsPlaying(true);
    const handleEnd = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    const handlePause = () => setIsPaused(true);
    const handleResume = () => setIsPaused(false);

    textToSpeech.addEventListener("start", handleStart);
    textToSpeech.addEventListener("end", handleEnd);
    textToSpeech.addEventListener("pause", handlePause);
    textToSpeech.addEventListener("resume", handleResume);

    return () => {
      textToSpeech.removeEventListener("start", handleStart);
      textToSpeech.removeEventListener("end", handleEnd);
      textToSpeech.removeEventListener("pause", handlePause);
      textToSpeech.removeEventListener("resume", handleResume);
    };
  }, []);

  return {
    isPlaying,
    isPaused,
    speak: (text: string) => textToSpeech.speak(text),
    speakSummary: (summary: { tldr: string; keyPoints: string[] }) =>
      textToSpeech.speakSummary(summary),
    speakKeyPoints: (keyPoints: string[]) =>
      textToSpeech.speakKeyPoints(keyPoints),
    speakRisks: (
      risks: Array<{ clause: string; risk: string; explanation: string }>
    ) => textToSpeech.speakRisks(risks),
    speakActionPlan: (actions: Array<{ task: string; priority: string }>) =>
      textToSpeech.speakActionPlan(actions),
    pause: () => textToSpeech.pause(),
    resume: () => textToSpeech.resume(),
    stop: () => textToSpeech.stop(),
    settings: textToSpeech.getSettings(),
    voices: textToSpeech.getVoices(),
    updateSettings: (settings: Partial<TTSSettings>) =>
      textToSpeech.updateSettings(settings),
    testVoice: (voiceName?: string) => textToSpeech.testVoice(voiceName),
  };
};

// Fix React import
import React from "react";
