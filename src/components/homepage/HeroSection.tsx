import { motion } from 'framer-motion';
import { ArrowRight, Play, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AIBrainGraphic from './AIBrainGraphic';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Neural Network Pattern */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full opacity-20" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(187, 100%, 50%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Neural nodes */}
          {[...Array(30)].map((_, i) => (
            <motion.circle
              key={i}
              cx={100 + (i % 10) * 90}
              cy={100 + Math.floor(i / 10) * 150}
              r="4"
              fill="url(#neuralGrad)"
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
          {/* Neural connections */}
          {[...Array(40)].map((_, i) => {
            const x1 = 100 + (i % 10) * 90;
            const y1 = 100 + Math.floor(i / 10) * 150;
            const x2 = 100 + ((i + 1) % 10) * 90;
            const y2 = 100 + Math.floor((i + 1) / 10) * 150;
            return (
              <motion.line
                key={`line-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#neuralGrad)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 2,
                  delay: i * 0.05,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            );
          })}
        </svg>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Next-Gen Enterprise Platform</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold leading-tight mb-6"
            >
              <span className="text-foreground">Software Vala</span>
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-primary via-neon-teal to-neon-blue bg-clip-text text-transparent">
                  AI Powered
                </span>
                <motion.span
                  className="absolute -inset-1 bg-primary/20 blur-2xl -z-10"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </span>
              <br />
              <span className="text-foreground">Enterprise Ecosystem</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-muted-foreground mb-4"
            >
              <span className="text-primary">Innovation</span>
              <span className="mx-3 text-border">•</span>
              <span className="text-neon-teal">Automation</span>
              <span className="mx-3 text-border">•</span>
              <span className="text-neon-blue">Intelligence</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Transform your business with cutting-edge AI automation. 40+ industry solutions, 
              global franchise network, and intelligent analytics - all in one platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="relative group bg-gradient-to-r from-primary to-neon-teal text-background font-semibold px-8 hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] transition-all duration-300"
              >
                <Play className="w-4 h-4 mr-2" />
                Explore Demo
                <motion.span
                  className="absolute inset-0 rounded-lg bg-primary/50 blur-xl -z-10"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary group px-8"
              >
                Become Franchise
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                size="lg"
                variant="ghost"
                className="text-primary hover:bg-primary/10 group"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Chat
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                { value: '40+', label: 'Industries' },
                { value: '500+', label: 'Franchises' },
                { value: '99.9%', label: 'Uptime' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-mono font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - AI Brain Graphic */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <AIBrainGraphic />
          </motion.div>
        </div>
      </div>

      {/* Electromagnetic Animation Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-teal/50 to-transparent"
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [1, 0, 1], y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
