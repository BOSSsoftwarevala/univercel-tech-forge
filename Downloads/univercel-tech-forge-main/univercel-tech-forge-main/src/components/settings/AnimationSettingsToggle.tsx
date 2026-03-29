/**
 * Animation & Sound Settings Toggle
 * User controls for sound and animation preferences
 */

import { Volume2, VolumeX, Zap, ZapOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAnimationSettings } from '@/contexts/AnimationSettingsContext';

interface AnimationSettingsToggleProps {
  compact?: boolean;
}

export const AnimationSettingsToggle = ({ compact = false }: AnimationSettingsToggleProps) => {
  const { soundEnabled, setSoundEnabled, animationsEnabled, setAnimationsEnabled, reducedMotion } = useAnimationSettings();

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-lg transition-colors ${
            soundEnabled ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
          }`}
          title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </motion.button>
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setAnimationsEnabled(!animationsEnabled)}
          className={`p-2 rounded-lg transition-colors ${
            animationsEnabled ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
          }`}
          title={animationsEnabled ? 'Reduce animations' : 'Enable animations'}
          disabled={reducedMotion}
        >
          {animationsEnabled ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 rounded-lg bg-card border border-border">
      <h3 className="font-semibold text-foreground">Experience Settings</h3>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {soundEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
          <Label htmlFor="sound-toggle">Sound Effects</Label>
        </div>
        <Switch
          id="sound-toggle"
          checked={soundEnabled}
          onCheckedChange={setSoundEnabled}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {animationsEnabled ? <Zap className="w-4 h-4 text-primary" /> : <ZapOff className="w-4 h-4 text-muted-foreground" />}
          <Label htmlFor="animation-toggle">Animations</Label>
        </div>
        <Switch
          id="animation-toggle"
          checked={animationsEnabled}
          onCheckedChange={setAnimationsEnabled}
          disabled={reducedMotion}
        />
      </div>
      
      {reducedMotion && (
        <p className="text-xs text-muted-foreground">
          Animations are disabled due to your system's reduced motion preference.
        </p>
      )}
    </div>
  );
};

export default AnimationSettingsToggle;
