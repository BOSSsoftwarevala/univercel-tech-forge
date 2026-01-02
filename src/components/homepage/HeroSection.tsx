/**
 * Optimized HeroSection - Static SVG, minimal animations
 */
import { memo } from 'react';
import { motion } from 'framer-motion';
import { Play, MessageSquare, Sparkles, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIBrainGraphic from './AIBrainGraphic';

const HeroSection = memo(function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Static Neural Network Pattern - No animations */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(187, 100%, 50%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Static neural nodes */}
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx={100 + (i % 10) * 100}
              cy={150 + Math.floor(i / 10) * 200}
              r="4"
              fill="url(#neuralGrad)"
              opacity="0.6"
            />
          ))}
          {/* Static connections */}
          {[...Array(15)].map((_, i) => (
            <line
              key={`line-${i}`}
              x1={100 + (i % 5) * 200}
              y1={150 + Math.floor(i / 5) * 200}
              x2={200 + (i % 5) * 200}
              y2={250 + Math.floor(i / 5) * 200}
              stroke="url(#neuralGrad)"
              strokeWidth="1"
              opacity="0.4"
            />
          ))}
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content - Single fade-in animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Next-Gen Enterprise Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold leading-tight mb-6">
              <span className="text-foreground">Software Vala</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-neon-teal to-neon-blue bg-clip-text text-transparent">
                AI Powered
              </span>
              <br />
              <span className="text-foreground">Enterprise Ecosystem</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-muted-foreground mb-4">
              <span className="text-primary">Innovation</span>
              <span className="mx-3 text-border">•</span>
              <span className="text-neon-teal">Automation</span>
              <span className="mx-3 text-border">•</span>
              <span className="text-neon-blue">Intelligence</span>
            </p>

            <p className="text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Transform your business with cutting-edge AI automation. 40+ industry solutions, 
              global franchise network, and intelligent analytics - all in one platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-neon-teal text-background font-semibold px-8 hover:shadow-lg hover:shadow-primary/30 transition-shadow"
              >
                <Play className="w-4 h-4 mr-2" />
                Explore Demo
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary px-8"
              >
                Upgrade to Prime
                <Crown className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                size="lg"
                variant="ghost"
                className="text-primary hover:bg-primary/10"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Chat
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 justify-center lg:justify-start">
              {[
                { value: '11,850+', label: 'Software' },
                { value: '2,850+', label: 'Resellers' },
                { value: '52+', label: 'Franchises' },
                { value: '7+', label: 'Countries' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-mono font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - AI Brain Graphic */}
          <div className="relative hidden lg:block">
            <AIBrainGraphic />
          </div>
        </div>
      </div>

      {/* Static gradient lines at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-teal/30 to-transparent" />
      </div>
    </section>
  );
});

export default HeroSection;
