import React, { useState } from "react";
import { Volume2, VolumeX, Play, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAudioFeedback } from "@/services/audioFeedback";
import { AnimatedButton } from "./ui/animated-button";

export const AudioSettings: React.FC = () => {
  const { settings, setEnabled, setVolume, setSoundEnabled, testSound } =
    useAudioFeedback();

  const [isOpen, setIsOpen] = useState(false);
  const [switchKey, setSwitchKey] = useState(0);
  const [sliderKey, setSliderKey] = useState(0);

  const soundTypes = [
    {
      key: "success" as const,
      label: "Success",
      description: "File upload success",
    },
    {
      key: "error" as const,
      label: "Error",
      description: "Error notifications",
    },
    {
      key: "click" as const,
      label: "Click",
      description: "Button interactions",
    },
    {
      key: "completion" as const,
      label: "Completion",
      description: "Analysis complete",
    },
    { key: "upload" as const, label: "Upload", description: "File processing" },
  ];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <AnimatedButton
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
        >
          {settings.enabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </AnimatedButton>
      </PopoverTrigger>

      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <h4 className="font-medium">Audio Settings</h4>
          </div>

          {/* Master Enable/Disable */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">
                Enable Audio Feedback
              </Label>
              <p className="text-xs text-muted-foreground">
                Play sounds for user interactions
              </p>
            </div>
            <Switch
              key={`master-${switchKey}`}
              checked={settings.enabled}
              onCheckedChange={(checked) => {
                setEnabled(checked);
                setSwitchKey(prev => prev + 1);
              }}
            />
          </div>

          {settings.enabled && (
            <>
              <Separator />

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
                  onValueChange={([value]) => {
                    setVolume(value);
                    setSliderKey(prev => prev + 1);
                  }}
                  max={1}
                  min={0}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Individual Sound Controls */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Sound Types</Label>
                {soundTypes.map((sound) => (
                  <div
                    key={sound.key}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">{sound.label}</Label>
                        <AnimatedButton
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => testSound(sound.key)}
                        >
                          <Play className="h-3 w-3" />
                        </AnimatedButton>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {sound.description}
                      </p>
                    </div>
                    <Switch
                      key={`${sound.key}-${switchKey}`}
                      checked={settings.sounds[sound.key]}
                      onCheckedChange={(checked) => {
                        setSoundEnabled(sound.key, checked);
                        setSwitchKey(prev => prev + 1);
                      }}
                    />
                  </div>
                ))}
              </div>

              <Separator />

              {/* Info */}
              <div className="text-xs text-muted-foreground">
                <p>
                  Audio feedback respects your system's accessibility settings.
                  Sounds are automatically disabled if you have "reduce motion"
                  enabled.
                </p>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
