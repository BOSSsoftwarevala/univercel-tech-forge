/**
 * Ultra-Optimized Particle Background
 * Maximum performance with minimal particles
 */

import React, { memo } from 'react';

const ParticleBackground = memo(function ParticleBackground() {
  // Pure CSS static gradient - no canvas, no animation loop, maximum performance
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-primary/3 blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-[200px] h-[200px] rounded-full bg-neon-teal/3 blur-3xl" />
    </div>
  );
});

export default ParticleBackground;
