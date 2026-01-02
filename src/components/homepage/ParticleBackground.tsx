/**
 * Optimized Particle Background
 * Performance-aware with reduced particles and simplified animations
 */

import React, { useEffect, useRef, memo } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const ParticleBackground = memo(function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { performanceMode, speed } = useNetworkStatus();
  
  // Skip heavy animations in lite/ultra-lite mode or slow connections
  const shouldRender = performanceMode === 'full' && speed !== 'slow' && speed !== 'offline';

  useEffect(() => {
    if (!shouldRender) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    
    // Reduced particle count for performance
    const particleCount = Math.min(30, Math.floor(window.innerWidth / 60));
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.4 + 0.1
        });
      }
    };

    let frameCount = 0;
    const drawParticles = () => {
      frameCount++;
      // Skip frames for performance (render every 2nd frame)
      if (frameCount % 2 !== 0) {
        animationId = requestAnimationFrame(drawParticles);
        return;
      }
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle (no connections - major performance gain)
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${particle.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(drawParticles);
    };

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [shouldRender]);

  // Return minimal static background in lite modes
  if (!shouldRender) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-background via-background to-primary/5" />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />
      
      {/* Static gradient orbs instead of animated ones */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-neon-teal/5 blur-3xl" />
    </div>
  );
});

export default ParticleBackground;
