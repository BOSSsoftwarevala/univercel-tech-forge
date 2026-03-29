/**
 * Role-Based Premium Sound System
 * Soft, premium, short sounds (0.3s-0.8s) with role-specific tones
 */

import { useCallback, useRef, useState, useEffect } from 'react';

export type SoundType = 
  | 'login_success'
  | 'payment_success'
  | 'button_click'
  | 'error'
  | 'notification'
  | 'action_complete';

// Role-specific sound configurations
const roleSoundProfiles: Record<string, {
  baseFrequency: number;
  type: OscillatorType;
  harmonics: number[];
  gainMultiplier: number;
  characterLabel: string;
}> = {
  // Common User: soft "whoosh + chime"
  user: {
    baseFrequency: 523, // C5
    type: 'sine',
    harmonics: [659, 784], // E5, G5 - major chord
    gainMultiplier: 0.8,
    characterLabel: 'Soft Chime',
  },
  common: {
    baseFrequency: 523,
    type: 'sine',
    harmonics: [659, 784],
    gainMultiplier: 0.8,
    characterLabel: 'Soft Chime',
  },
  // SEO Manager: digital pulse tone
  seo: {
    baseFrequency: 440, // A4
    type: 'square',
    harmonics: [550, 660],
    gainMultiplier: 0.6,
    characterLabel: 'Digital Pulse',
  },
  seo_manager: {
    baseFrequency: 440,
    type: 'square',
    harmonics: [550, 660],
    gainMultiplier: 0.6,
    characterLabel: 'Digital Pulse',
  },
  // Demo Manager: click + tech beep
  demo_manager: {
    baseFrequency: 880, // A5
    type: 'triangle',
    harmonics: [1100, 1320],
    gainMultiplier: 0.7,
    characterLabel: 'Tech Beep',
  },
  // Developer: terminal-style soft tick
  developer: {
    baseFrequency: 300, // Low tick
    type: 'sawtooth',
    harmonics: [400, 500],
    gainMultiplier: 0.5,
    characterLabel: 'Terminal Tick',
  },
  // Franchise/Reseller: success bell light
  franchise: {
    baseFrequency: 698, // F5
    type: 'sine',
    harmonics: [880, 1047, 1175],
    gainMultiplier: 0.85,
    characterLabel: 'Success Bell',
  },
  reseller: {
    baseFrequency: 698,
    type: 'sine',
    harmonics: [880, 1047, 1175],
    gainMultiplier: 0.85,
    characterLabel: 'Success Bell',
  },
  // Master Admin/Super Admin: deep confirmation tone
  master_admin: {
    baseFrequency: 196, // G3 - deep
    type: 'sine',
    harmonics: [294, 392, 494],
    gainMultiplier: 1.0,
    characterLabel: 'Deep Confirmation',
  },
  super_admin: {
    baseFrequency: 220, // A3
    type: 'sine',
    harmonics: [330, 440, 550],
    gainMultiplier: 1.0,
    characterLabel: 'Authority Tone',
  },
  admin: {
    baseFrequency: 262, // C4
    type: 'sine',
    harmonics: [330, 392],
    gainMultiplier: 0.9,
    characterLabel: 'Admin Chime',
  },
  // Support: gentle notification
  support: {
    baseFrequency: 587, // D5
    type: 'sine',
    harmonics: [740, 880],
    gainMultiplier: 0.7,
    characterLabel: 'Gentle Bell',
  },
  // Influencer: bright pop
  influencer: {
    baseFrequency: 784, // G5
    type: 'sine',
    harmonics: [988, 1175, 1319],
    gainMultiplier: 0.75,
    characterLabel: 'Bright Pop',
  },
  // Task Manager: completion ping
  task_manager: {
    baseFrequency: 659, // E5
    type: 'triangle',
    harmonics: [784, 988],
    gainMultiplier: 0.65,
    characterLabel: 'Task Ping',
  },
  // Lead Manager: professional tone
  lead_manager: {
    baseFrequency: 494, // B4
    type: 'sine',
    harmonics: [622, 740],
    gainMultiplier: 0.7,
    characterLabel: 'Professional Tone',
  },
  // Default
  default: {
    baseFrequency: 523,
    type: 'sine',
    harmonics: [659, 784],
    gainMultiplier: 0.7,
    characterLabel: 'Standard Chime',
  },
};

// Sound type configurations
const soundTypeConfigs: Record<SoundType, {
  durationMultiplier: number;
  frequencyOffset: number;
  attackTime: number;
  releaseTime: number;
  volumeScale: number;
}> = {
  login_success: {
    durationMultiplier: 1.2,
    frequencyOffset: 0,
    attackTime: 0.02,
    releaseTime: 0.6,
    volumeScale: 1.0,
  },
  payment_success: {
    durationMultiplier: 1.5,
    frequencyOffset: 100,
    attackTime: 0.01,
    releaseTime: 0.8,
    volumeScale: 1.1,
  },
  button_click: {
    durationMultiplier: 0.3,
    frequencyOffset: 200,
    attackTime: 0.005,
    releaseTime: 0.1,
    volumeScale: 0.4,
  },
  error: {
    durationMultiplier: 0.5,
    frequencyOffset: -150,
    attackTime: 0.01,
    releaseTime: 0.3,
    volumeScale: 0.6,
  },
  notification: {
    durationMultiplier: 0.6,
    frequencyOffset: 50,
    attackTime: 0.02,
    releaseTime: 0.4,
    volumeScale: 0.7,
  },
  action_complete: {
    durationMultiplier: 0.8,
    frequencyOffset: 0,
    attackTime: 0.01,
    releaseTime: 0.5,
    volumeScale: 0.8,
  },
};

const STORAGE_KEY = 'sv-sound-enabled';

export const useRoleSounds = (userRole: string = 'default') => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'false';
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile for softer sounds
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume if suspended (required for mobile)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  }, []);

  const getRoleProfile = useCallback((role: string) => {
    const normalizedRole = role.toLowerCase().replace(/[^a-z_]/g, '');
    return roleSoundProfiles[normalizedRole] || roleSoundProfiles.default;
  }, []);

  const playSound = useCallback((soundType: SoundType) => {
    if (isMuted) return;

    const roleProfile = getRoleProfile(userRole);
    const soundConfig = soundTypeConfigs[soundType];
    
    // Mobile: softer sounds
    const mobileMultiplier = isMobile ? 0.7 : 1.0;
    const baseDuration = 0.4;
    const duration = baseDuration * soundConfig.durationMultiplier;
    const baseGain = 0.12 * roleProfile.gainMultiplier * soundConfig.volumeScale * mobileMultiplier;

    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Master gain node
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(baseGain, now + soundConfig.attackTime);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Main oscillator
      const mainFreq = Math.max(100, roleProfile.baseFrequency + soundConfig.frequencyOffset);
      const mainOsc = ctx.createOscillator();
      mainOsc.type = roleProfile.type;
      mainOsc.frequency.setValueAtTime(mainFreq, now);
      
      // Add slight frequency sweep for richness
      if (soundType === 'login_success' || soundType === 'payment_success') {
        mainOsc.frequency.linearRampToValueAtTime(mainFreq * 1.05, now + duration * 0.3);
        mainOsc.frequency.linearRampToValueAtTime(mainFreq, now + duration);
      }
      
      mainOsc.connect(masterGain);
      mainOsc.start(now);
      mainOsc.stop(now + duration);

      // Harmonics for richer sound
      roleProfile.harmonics.forEach((harmFreq, i) => {
        const adjustedFreq = Math.max(100, harmFreq + soundConfig.frequencyOffset * 0.5);
        const harmGain = ctx.createGain();
        harmGain.connect(ctx.destination);
        harmGain.gain.setValueAtTime(0, now);
        harmGain.gain.linearRampToValueAtTime(
          (baseGain * 0.4) / (i + 1.5), 
          now + soundConfig.attackTime
        );
        harmGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.7);

        const harmOsc = ctx.createOscillator();
        harmOsc.type = 'sine';
        harmOsc.frequency.setValueAtTime(adjustedFreq, now);
        harmOsc.connect(harmGain);
        harmOsc.start(now);
        harmOsc.stop(now + duration);
      });

      // For success sounds, add a subtle high "sparkle"
      if (soundType === 'login_success' || soundType === 'payment_success') {
        const sparkleGain = ctx.createGain();
        sparkleGain.connect(ctx.destination);
        sparkleGain.gain.setValueAtTime(0, now + 0.1);
        sparkleGain.gain.linearRampToValueAtTime(baseGain * 0.2, now + 0.15);
        sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        const sparkleOsc = ctx.createOscillator();
        sparkleOsc.type = 'sine';
        sparkleOsc.frequency.setValueAtTime(mainFreq * 2, now);
        sparkleOsc.connect(sparkleGain);
        sparkleOsc.start(now + 0.1);
        sparkleOsc.stop(now + 0.5);
      }

      // For error sounds, add low rumble
      if (soundType === 'error') {
        const errorGain = ctx.createGain();
        errorGain.connect(ctx.destination);
        errorGain.gain.setValueAtTime(baseGain * 0.3, now);
        errorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        const errorOsc = ctx.createOscillator();
        errorOsc.type = 'sine';
        errorOsc.frequency.setValueAtTime(110, now);
        errorOsc.frequency.linearRampToValueAtTime(80, now + 0.3);
        errorOsc.connect(errorGain);
        errorOsc.start(now);
        errorOsc.stop(now + 0.3);
      }

    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [isMuted, isMobile, userRole, getAudioContext, getRoleProfile]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEY, String(!newValue));
      return newValue;
    });
  }, []);

  const setMuted = useCallback((muted: boolean) => {
    setIsMuted(muted);
    localStorage.setItem(STORAGE_KEY, String(!muted));
  }, []);

  // Convenience methods
  const playLoginSuccess = useCallback(() => playSound('login_success'), [playSound]);
  const playPaymentSuccess = useCallback(() => playSound('payment_success'), [playSound]);
  const playButtonClick = useCallback(() => playSound('button_click'), [playSound]);
  const playError = useCallback(() => playSound('error'), [playSound]);
  const playNotification = useCallback(() => playSound('notification'), [playSound]);
  const playActionComplete = useCallback(() => playSound('action_complete'), [playSound]);

  return {
    playSound,
    playLoginSuccess,
    playPaymentSuccess,
    playButtonClick,
    playError,
    playNotification,
    playActionComplete,
    isMuted,
    toggleMute,
    setMuted,
    roleProfile: getRoleProfile(userRole),
  };
};

export default useRoleSounds;
