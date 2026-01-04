import React, { useState } from "react";
import { Volume2, VolumeX, Play, Pause, Square, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTextToSpeech } from "@/services/textToSpeech";
import { AnimatedButton } from "./ui/animated-button";

export const TTSSettings: React.FC = () => {
  const {
    settings,
    voices,
    updateSettings,
    testVoice,
    isPlaying,
    isPaused,
    stop,
  } = useTextToSpeech();

  const [isOpen, setIsOpen] = useState(false);
  const [switchKey, setSwitchKey] = useState(0);
  const [sliderKey, setSliderKey] = useState(0);

  const handleVoiceChange = (voiceName: string) => {
    updateSettings({ voice: voiceName });
  };

  const handleRateChange = ([rate]: number[]) => {
    updateSettings({ rate });
    setSliderKey(prev => prev + 1);
  };

  const handlePitchChange = ([pitch]: number[]) => {
    updateSettings({ pitch });
    setSliderKey(prev => prev + 1);
  };

  const handleVolumeChange = ([volume]: number[]) => {
    updateSettings({ volume });
    setSliderKey(prev => prev + 1);
  };

  const handleTestVoice = async () => {
    if (isPlaying) {
      stop();
    } else {
      await testVoice(settings.voice || undefined);
    }
  };

  // Group voices by language for better organization
  const groupedVoices = voices.reduce((groups, voice) => {
    const lang = voice.lang.split("-")[0];
    if (!groups[lang]) groups[lang] = [];
    groups[lang].push(voice);
    return groups;
  }, {} as Record<string, SpeechSynthesisVoice[]>);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <AnimatedButton
          variant="ghost"
          size="sm"
          animation="scale"
          className="h-9 w-9 p-0"
        >
          {settings.enabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </AnimatedButton>
      </PopoverTrigger>

      <PopoverContent className="w-96" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <h4 className="font-medium">Text-to-Speech Settings</h4>
            </div>
            <AnimatedButton
              variant="ghost"
              size="sm"
              animation="scale"
              onClick={handleTestVoice}
              disabled={!settings.enabled}
            >
              {isPlaying ? (
                <Square className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </AnimatedButton>
          </div>

          {/* Master Enable/Disable */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">
                Enable Text-to-Speech
              </Label>
              <p className="text-xs text-muted-foreground">
                Read analysis results aloud
              </p>
            </div>
            <Switch
              key={switchKey}
              checked={settings.enabled}
              onCheckedChange={(enabled) => {
                updateSettings({ enabled });
                setSwitchKey(prev => prev + 1); // Force re-render
              }}
            />
          </div>

          {settings.enabled && (
            <>
              <Separator />

              {/* Voice Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Voice</Label>
                <Select
                  value={settings.voice || ""}
                  onValueChange={handleVoiceChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(groupedVoices).map(([lang, langVoices]) => (
                      <div key={lang}>
                        <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                          {lang === "en" ? "English" : lang}
                        </div>
                        {langVoices.map((voice) => (
                          <SelectItem key={voice.name} value={voice.name}>
                            <div className="flex items-center justify-between w-full">
                              <span>{voice.name}</span>
                              {voice.default && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  (default)
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Rate Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Speed</Label>
                  <span className="text-xs text-muted-foreground">
                    {settings.rate.toFixed(1)}x
                  </span>
                </div>
                <Slider
                  key={`rate-${sliderKey}`}
                  value={[settings.rate]}
                  onValueChange={handleRateChange}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Slow</span>
                  <span>Fast</span>
                </div>
              </div>

              {/* Pitch Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Pitch</Label>
                  <span className="text-xs text-muted-foreground">
                    {settings.pitch.toFixed(1)}
                  </span>
                </div>
                <Slider
                  key={`pitch-${sliderKey}`}
                  value={[settings.pitch]}
                  onValueChange={handlePitchChange}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Volume</Label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(settings.volume * 100)}%
                  </span>
                </div>
                <Slider
                  key={`volume-${sliderKey}`}
                  value={[settings.volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Info */}
              <div className="text-xs text-muted-foreground">
                <p>
                  Text-to-speech helps make legal analysis more accessible.
                  Click the speaker icons next to analysis sections to hear them
                  read aloud.
                </p>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
