import React, { useState } from "react";
import { Volume2, Play, Pause, Square, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useTextToSpeech } from "@/services/textToSpeech";
import { AnimatedButton } from "./ui/animated-button";
import { TTSSettings } from "./TTSSettings";

export const TTSDemo: React.FC = () => {
  const [demoText, setDemoText] = useState(
    "Welcome to LegaliTea's text-to-speech feature! This tool helps make legal documents more accessible by reading analysis results aloud. You can select any text in the analysis results and click the speaker icon to hear it read aloud. This is especially helpful for understanding complex legal language and key points in your documents."
  );

  const { isPlaying, isPaused, speak, pause, resume, stop, settings } =
    useTextToSpeech();

  const handleSpeak = async () => {
    if (isPlaying) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      await speak(demoText);
    }
  };

  const handleStop = () => {
    stop();
  };

  const sampleTexts = [
    {
      title: "Legal Summary Example",
      text: "This lease agreement establishes a one-year rental term with monthly payments of $1,200. The tenant is responsible for utilities and must provide 30 days notice before termination. Key risks include a broad liability clause and automatic renewal terms.",
    },
    {
      title: "Risk Assessment Example",
      text: "High risk identified: The contract contains an unlimited liability clause that could expose you to significant financial damages beyond your control. Consider negotiating a liability cap or seeking legal counsel before signing.",
    },
    {
      title: "Action Plan Example",
      text: "Action required: Review the termination clause carefully, as it requires 60 days written notice. Clarify the maintenance responsibilities section, and consider adding a force majeure clause for unexpected circumstances.",
    },
  ];

  if (!settings.enabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Text-to-Speech Demo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Volume2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              Text-to-speech is currently disabled. Enable it in settings to try
              this demo.
            </p>
            <TTSSettings />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Text-to-Speech Demo
          </div>
          <TTSSettings />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Custom Text Demo */}
        <div className="space-y-3">
          <h4 className="font-medium">Try with custom text:</h4>
          <Textarea
            value={demoText}
            onChange={(e) => setDemoText(e.target.value)}
            placeholder="Enter text to be read aloud..."
            className="min-h-[100px]"
          />
          <div className="flex items-center gap-2">
            <AnimatedButton
              animation="scale"
              onClick={handleSpeak}
              disabled={!demoText.trim()}
            >
              {isPlaying ? (
                isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                )
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Read Aloud
                </>
              )}
            </AnimatedButton>

            {isPlaying && (
              <AnimatedButton
                variant="outline"
                animation="scale"
                onClick={handleStop}
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </AnimatedButton>
            )}
          </div>
        </div>

        {/* Sample Texts */}
        <div className="space-y-3">
          <h4 className="font-medium">Try sample legal text:</h4>
          <div className="grid gap-3">
            {sampleTexts.map((sample, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-sm">{sample.title}</h5>
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    animation="scale"
                    onClick={() => speak(sample.text)}
                  >
                    <Volume2 className="h-4 w-4" />
                  </AnimatedButton>
                </div>
                <p className="text-sm text-muted-foreground">{sample.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <h4 className="font-medium text-info mb-2">
            How to use Text-to-Speech:
          </h4>
          <ul className="text-sm text-info/80 space-y-1">
            <li>
              • Click the speaker icons next to analysis sections to hear them
              read aloud
            </li>
            <li>
              • Select any text in the results and click "Read Selection" to
              hear specific parts
            </li>
            <li>• Adjust voice, speed, and volume in the TTS settings</li>
            <li>• Use pause/resume controls during playback</li>
            <li>• Perfect for understanding complex legal language</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
