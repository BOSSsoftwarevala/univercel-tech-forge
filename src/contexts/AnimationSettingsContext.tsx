/**
 * Animation & Sound Settings Provider
 * Global controls for sound ON/OFF and reduced motion
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AnimationSettingsContextType {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
  reducedMotion: boolean;
}

const AnimationSettingsContext = createContext<AnimationSettingsContextType | undefined>(undefined);

const SOUND_KEY = 'sv-sound-enabled';
const ANIMATION_KEY = 'sv-animations-enabled';

export const AnimationSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(SOUND_KEY) !== 'false';
    }
    return true;
  });

  const [animationsEnabled, setAnimationsEnabledState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ANIMATION_KEY) !== 'false';
    }
    return true;
  });

  const [reducedMotion, setReducedMotion] = useState(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    localStorage.setItem(SOUND_KEY, String(enabled));
  };

  const setAnimationsEnabled = (enabled: boolean) => {
    setAnimationsEnabledState(enabled);
    localStorage.setItem(ANIMATION_KEY, String(enabled));
  };

  return (
    <AnimationSettingsContext.Provider value={{
      soundEnabled,
      setSoundEnabled,
      animationsEnabled: animationsEnabled && !reducedMotion,
      setAnimationsEnabled,
      reducedMotion,
    }}>
      {children}
    </AnimationSettingsContext.Provider>
  );
};

export const useAnimationSettings = () => {
  const context = useContext(AnimationSettingsContext);
  if (!context) {
    throw new Error('useAnimationSettings must be used within AnimationSettingsProvider');
  }
  return context;
};

export default AnimationSettingsContext;
