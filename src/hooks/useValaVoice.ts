/**
 * VALA AI Voice Hook
 * Handles TTS via ElevenLabs edge function
 * API key is NEVER exposed to frontend
 */

import { useState, useCallback, useRef } from 'react';

interface VoiceSettings {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  speed?: number;
}

const VOICE_PRESETS: Record<string, { id: string; label: string }> = {
  george: { id: 'JBFqnCBsd6RMkjVDRZzb', label: 'George (Default)' },
  sarah: { id: 'EXAVITQu4vr4xnSDxMaL', label: 'Sarah' },
  roger: { id: 'CwhRBWXzGAHq8TQ4Fs17', label: 'Roger' },
  alice: { id: 'Xb7hH8MSUJpSbSDYk0k2', label: 'Alice' },
  brian: { id: 'nPczCjzI2devNBz1zQrb', label: 'Brian' },
  lily: { id: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily' },
};

export function useValaVoice() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const speak = useCallback(async (text: string, settings?: VoiceSettings) => {
    if (!text || text.trim().length === 0) return;

    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
    }

    setIsLoading(true);
    setError(null);
    abortRef.current = new AbortController();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            text: text.substring(0, 5000),
            voiceId: settings?.voiceId || VOICE_PRESETS.alice.id,
            stability: settings?.stability ?? 0.7,
            similarityBoost: settings?.similarityBoost ?? 0.85,
            style: settings?.style ?? 0.3,
            speed: settings?.speed ?? 0.85,
          }),
          signal: abortRef.current.signal,
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'TTS failed' }));
        throw new Error(errData.error || `TTS request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsPlaying(false);
        setError('Audio playback failed');
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Voice generation failed';
      setError(msg);
      console.error('VALA Voice error:', msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setIsPlaying(false);
    setIsLoading(false);
  }, []);

  return {
    speak,
    stop,
    isPlaying,
    isLoading,
    error,
    voicePresets: VOICE_PRESETS,
  };
}
