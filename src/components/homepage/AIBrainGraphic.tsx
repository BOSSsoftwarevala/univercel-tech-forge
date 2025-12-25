/**
 * Optimized AI Brain Graphic
 * Static version for performance
 */

import React, { memo } from 'react';
import { Brain, Cpu, Zap, Shield, Database, Cloud } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const AIBrainGraphic = memo(function AIBrainGraphic() {
  const { performanceMode } = useNetworkStatus();
  const isLite = performanceMode !== 'full';

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {/* Static rings for performance */}
      <div className="absolute w-[320px] h-[320px] rounded-full border border-primary/20" />
      <div className="absolute w-[240px] h-[240px] rounded-full border border-neon-teal/20" />
      <div className="absolute w-[160px] h-[160px] rounded-full border border-neon-green/20" />
      
      {/* Central Brain */}
      <div className="relative z-10 p-8 rounded-full bg-card/60 backdrop-blur-sm border border-border/50">
        <Brain className="w-16 h-16 text-primary" />
      </div>

      {/* Static positioned icons */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 p-3 rounded-full bg-card/60 border border-border/30">
        <Cpu className="w-6 h-6 text-neon-teal" />
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 p-3 rounded-full bg-card/60 border border-border/30">
        <Database className="w-6 h-6 text-neon-green" />
      </div>
      <div className="absolute left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-card/60 border border-border/30">
        <Shield className="w-6 h-6 text-neon-orange" />
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-card/60 border border-border/30">
        <Cloud className="w-6 h-6 text-neon-purple" />
      </div>
      <div className="absolute top-16 right-16 p-3 rounded-full bg-card/60 border border-border/30">
        <Zap className="w-6 h-6 text-primary" />
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl" />
    </div>
  );
});

export default AIBrainGraphic;
