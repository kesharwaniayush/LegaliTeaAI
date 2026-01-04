// Audio Feedback Service using Web Audio API

interface AudioSettings {
  enabled: boolean;
  volume: number; // 0-1
  sounds: {
    success: boolean;
    error: boolean;
    click: boolean;
    completion: boolean;
    upload: boolean;
  };
}

type SoundType = keyof AudioSettings["sounds"];

class AudioFeedbackService {
  private audioContext: AudioContext | null = null;
  private sounds: Map<SoundType, AudioBuffer> = new Map();
  private settings: AudioSettings;
  private initialized = false;

  constructor() {
    this.settings = this.loadSettings();
    this.initializeAudioContext();
  }

  private loadSettings(): AudioSettings {
    const saved = localStorage.getItem("legalitea-audio-settings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.warn("Failed to parse audio settings:", error);
      }
    }

    return {
      enabled: true,
      volume: 0.3,
      sounds: {
        success: true,
        error: true,
        click: true,
        completion: true,
        upload: true,
      },
    };
  }

  private saveSettings(): void {
    localStorage.setItem(
      "legalitea-audio-settings",
      JSON.stringify(this.settings)
    );
  }

  private async initializeAudioContext(): Promise<void> {
    try {
      // Check if user prefers reduced motion (includes audio)
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        this.settings.enabled = false;
        return;
      }

      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      await this.generateSounds();
      this.initialized = true;
    } catch (error) {
      console.warn("Failed to initialize audio context:", error);
      this.settings.enabled = false;
    }
  }

  private async generateSounds(): Promise<void> {
    if (!this.audioContext) return;

    const sampleRate = this.audioContext.sampleRate;

    // Generate success sound (C major chord)
    const successBuffer = this.audioContext.createBuffer(
      1,
      sampleRate * 0.3,
      sampleRate
    );
    const successData = successBuffer.getChannelData(0);
    for (let i = 0; i < successData.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 3); // Decay envelope
      successData[i] =
        envelope *
        (Math.sin(2 * Math.PI * 523.25 * t) * 0.3 + // C5
          Math.sin(2 * Math.PI * 659.25 * t) * 0.2 + // E5
          Math.sin(2 * Math.PI * 783.99 * t) * 0.2); // G5
    }
    this.sounds.set("success", successBuffer);

    // Generate error sound (minor chord)
    const errorBuffer = this.audioContext.createBuffer(
      1,
      sampleRate * 0.4,
      sampleRate
    );
    const errorData = errorBuffer.getChannelData(0);
    for (let i = 0; i < errorData.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 2.5);
      errorData[i] =
        envelope *
        (Math.sin(2 * Math.PI * 440 * t) * 0.3 + // A4
          Math.sin(2 * Math.PI * 523.25 * t) * 0.2 + // C5
          Math.sin(2 * Math.PI * 659.25 * t) * 0.2); // E5
    }
    this.sounds.set("error", errorBuffer);

    // Generate click sound (short pop)
    const clickBuffer = this.audioContext.createBuffer(
      1,
      sampleRate * 0.1,
      sampleRate
    );
    const clickData = clickBuffer.getChannelData(0);
    for (let i = 0; i < clickData.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 50);
      clickData[i] = envelope * Math.sin(2 * Math.PI * 800 * t) * 0.2;
    }
    this.sounds.set("click", clickBuffer);

    // Generate completion sound (triumphant chord progression)
    const completionBuffer = this.audioContext.createBuffer(
      1,
      sampleRate * 1.2,
      sampleRate
    );
    const completionData = completionBuffer.getChannelData(0);
    for (let i = 0; i < completionData.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 1.5);

      // Chord progression: C -> F -> G -> C
      let frequency = 523.25; // C5
      if (t > 0.3) frequency = 698.46; // F5
      if (t > 0.6) frequency = 783.99; // G5
      if (t > 0.9) frequency = 1046.5; // C6

      completionData[i] =
        envelope *
        (Math.sin(2 * Math.PI * frequency * t) * 0.3 +
          Math.sin(2 * Math.PI * frequency * 1.25 * t) * 0.2 +
          Math.sin(2 * Math.PI * frequency * 1.5 * t) * 0.1);
    }
    this.sounds.set("completion", completionBuffer);

    // Generate upload sound (whoosh with rising pitch)
    const uploadBuffer = this.audioContext.createBuffer(
      1,
      sampleRate * 0.5,
      sampleRate
    );
    const uploadData = uploadBuffer.getChannelData(0);
    for (let i = 0; i < uploadData.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.sin((Math.PI * t) / 0.5); // Bell curve envelope
      const frequency = 200 + t * 400; // Rising from 200Hz to 600Hz
      uploadData[i] = envelope * Math.sin(2 * Math.PI * frequency * t) * 0.2;
    }
    this.sounds.set("upload", uploadBuffer);
  }

  private async resumeAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === "suspended") {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn("Failed to resume audio context:", error);
      }
    }
  }

  async playSound(type: SoundType): Promise<void> {
    if (
      !this.settings.enabled ||
      !this.settings.sounds[type] ||
      !this.initialized
    ) {
      return;
    }

    if (!this.audioContext || !this.sounds.has(type)) {
      return;
    }

    try {
      await this.resumeAudioContext();

      const buffer = this.sounds.get(type);
      if (!buffer) return;

      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      gainNode.gain.value = this.settings.volume;

      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      source.start();
    } catch (error) {
      console.warn(`Failed to play ${type} sound:`, error);
    }
  }

  // Public API methods
  success(): Promise<void> {
    return this.playSound("success");
  }

  error(): Promise<void> {
    return this.playSound("error");
  }

  click(): Promise<void> {
    return this.playSound("click");
  }

  completion(): Promise<void> {
    return this.playSound("completion");
  }

  upload(): Promise<void> {
    return this.playSound("upload");
  }

  // Settings management
  getSettings(): AudioSettings {
    return { ...this.settings };
  }

  updateSettings(newSettings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  setEnabled(enabled: boolean): void {
    this.settings.enabled = enabled;
    this.saveSettings();
  }

  setVolume(volume: number): void {
    this.settings.volume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  setSoundEnabled(soundType: SoundType, enabled: boolean): void {
    this.settings.sounds[soundType] = enabled;
    this.saveSettings();
  }

  // Test method for settings UI
  async testSound(type: SoundType): Promise<void> {
    const originalEnabled = this.settings.sounds[type];
    this.settings.sounds[type] = true;
    await this.playSound(type);
    this.settings.sounds[type] = originalEnabled;
  }
}

// Create singleton instance
export const audioFeedback = new AudioFeedbackService();

// React hook for audio feedback
export const useAudioFeedback = () => {
  const settings = audioFeedback.getSettings();

  return {
    settings,
    playSuccess: () => audioFeedback.success(),
    playError: () => audioFeedback.error(),
    playClick: () => audioFeedback.click(),
    playCompletion: () => audioFeedback.completion(),
    playUpload: () => audioFeedback.upload(),
    setEnabled: (enabled: boolean) => audioFeedback.setEnabled(enabled),
    setVolume: (volume: number) => audioFeedback.setVolume(volume),
    setSoundEnabled: (type: SoundType, enabled: boolean) =>
      audioFeedback.setSoundEnabled(type, enabled),
    testSound: (type: SoundType) => audioFeedback.testSound(type),
    updateSettings: (settings: Partial<AudioSettings>) =>
      audioFeedback.updateSettings(settings),
  };
};
