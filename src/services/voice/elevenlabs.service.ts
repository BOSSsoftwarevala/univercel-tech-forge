import { supabase } from "@/integrations/supabase/client";

export interface VoiceOptions {
  text: string;
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
}

// ElevenLabs default female voice IDs
export const VOICE_IDS = {
  RACHEL: "21m00Tcm4TlvDq8ikWAM", // Default AIRA voice (female)
  DOMI: "AZnzlk1XvdvUeBnXmlld",
  BELLA: "EXAVITQu4vr4xnSDxMaL",
  ELLI: "MF3mGyEYCl7XYWbV9V6O",
};

export const elevenlabsService = {
  // Generate voice audio for AIRA notifications
  async generateVoice(options: VoiceOptions): Promise<ArrayBuffer> {
    const { data, error } = await supabase.functions.invoke("voice-generate", {
      body: {
        text: options.text,
        voiceId: options.voiceId || VOICE_IDS.RACHEL,
        stability: options.stability ?? 0.5,
        similarityBoost: options.similarityBoost ?? 0.75,
      },
    });
    if (error) throw error;
    return data;
  },

  // Generate and play voice in browser
  async speakText(text: string, voiceId?: string): Promise<void> {
    try {
      const audioBuffer = await this.generateVoice({ text, voiceId });
      const blob = new Blob([audioBuffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play();
    } catch (error) {
      console.warn("Voice generation failed:", error);
    }
  },

  // Generate AIRA notification voice
  async speakNotification(title: string, message: string): Promise<void> {
    const text = `${title}. ${message}`;
    await this.speakText(text, VOICE_IDS.RACHEL);
  },
};
