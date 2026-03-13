/**
 * VALA AI Voice Controls
 * TTS output panel for VALA AI command responses
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2, Square, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useValaVoice } from '@/hooks/useValaVoice';
import { toast } from 'sonner';

interface ValaVoiceControlsProps {
  textToSpeak?: string;
}

export function ValaVoiceControls({ textToSpeak }: ValaVoiceControlsProps) {
  const { speak, stop, isPlaying, isLoading, error, voicePresets } = useValaVoice();
  const [selectedVoice, setSelectedVoice] = useState('george');
  const [speed, setSpeed] = useState(1.0);
  const [stability, setStability] = useState(0.5);

  const handleSpeak = async () => {
    if (!textToSpeak || textToSpeak.trim().length === 0) {
      toast.error('No text available to speak');
      return;
    }

    const preset = voicePresets[selectedVoice];
    await speak(textToSpeak, {
      voiceId: preset?.id,
      speed,
      stability,
    });
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ 
      background: 'rgba(6, 182, 212, 0.05)', 
      borderColor: 'rgba(6, 182, 212, 0.2)' 
    }}>
      {/* Voice Select */}
      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
        <SelectTrigger className="w-[140px] h-8 bg-slate-800 border-slate-700 text-white text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-800 border-slate-700">
          {Object.entries(voicePresets).map(([key, preset]) => (
            <SelectItem key={key} value={key} className="text-white text-xs">
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Speed */}
      <div className="flex items-center gap-2 min-w-[100px]">
        <span className="text-[10px] text-cyan-400 whitespace-nowrap">Speed</span>
        <Slider
          value={[speed]}
          onValueChange={([v]) => setSpeed(v)}
          min={0.7}
          max={1.2}
          step={0.1}
          className="w-16"
        />
        <span className="text-[10px] text-white">{speed.toFixed(1)}x</span>
      </div>

      {/* Stability */}
      <div className="flex items-center gap-2 min-w-[100px]">
        <span className="text-[10px] text-cyan-400 whitespace-nowrap">Stability</span>
        <Slider
          value={[stability]}
          onValueChange={([v]) => setStability(v)}
          min={0}
          max={1}
          step={0.1}
          className="w-16"
        />
      </div>

      {/* Play/Stop */}
      {isPlaying ? (
        <Button size="sm" variant="ghost" onClick={stop} className="text-red-400 hover:bg-red-500/10 h-8 px-3">
          <Square className="w-4 h-4 mr-1" />
          Stop
        </Button>
      ) : (
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleSpeak} 
          disabled={isLoading || !textToSpeak}
          className="text-cyan-400 hover:bg-cyan-500/10 h-8 px-3"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <Volume2 className="w-4 h-4 mr-1" />
          )}
          Speak
        </Button>
      )}

      {error && (
        <span className="text-[10px] text-red-400 truncate max-w-[120px]">{error}</span>
      )}
    </div>
  );
}
