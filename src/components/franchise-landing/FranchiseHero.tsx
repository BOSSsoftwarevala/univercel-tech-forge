import { motion } from 'framer-motion';
import { Handshake, Play, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FranchiseHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Hologram City Skyline Background */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full opacity-10" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="skylineGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="hsl(187, 100%, 50%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Buildings */}
          {[
            { x: 50, w: 40, h: 180 },
            { x: 100, w: 50, h: 220 },
            { x: 160, w: 35, h: 150 },
            { x: 210, w: 60, h: 280 },
            { x: 290, w: 45, h: 200 },
            { x: 350, w: 55, h: 320 },
            { x: 420, w: 40, h: 180 },
            { x: 480, w: 70, h: 350 },
            { x: 570, w: 50, h: 240 },
            { x: 640, w: 45, h: 200 },
            { x: 700, w: 60, h: 300 },
            { x: 780, w: 40, h: 170 },
            { x: 840, w: 55, h: 260 },
            { x: 910, w: 50, h: 220 },
            { x: 980, w: 65, h: 340 },
            { x: 1060, w: 45, h: 190 },
            { x: 1120, w: 50, h: 230 }
          ].map((building, i) => (
            <motion.rect
              key={i}
              x={building.x}
              y={400 - building.h}
              width={building.w}
              height={building.h}
              fill="url(#skylineGrad)"
              stroke="hsl(187, 100%, 50%)"
              strokeWidth="1"
              strokeOpacity="0.3"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.8 }}
            />
          ))}
        </svg>
      </div>

      {/* Glow Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {[400, 500, 600].map((size, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-primary/20"
            style={{ width: size, height: size }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Franchise Opportunity</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold leading-tight mb-6"
            >
              <span className="text-foreground">Become a</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-neon-teal to-neon-blue bg-clip-text text-transparent">
                Software Vala
              </span>
              <br />
              <span className="text-foreground">Franchise</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Own your tech business. AI-powered operations. Lifetime earnings.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="relative group bg-gradient-to-r from-primary to-neon-teal text-background font-semibold px-8 hover:shadow-[0_0_40px_rgba(0,240,255,0.4)] transition-all"
              >
                Apply Now
                <motion.span
                  className="absolute inset-0 rounded-lg bg-primary/50 blur-xl -z-10"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 text-foreground hover:bg-primary/10 group"
              >
                <Play className="w-4 h-4 mr-2" />
                View Earnings Model
              </Button>
              
              <Button
                size="lg"
                variant="ghost"
                className="text-primary hover:bg-primary/10"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Talk with AI
              </Button>
            </motion.div>
          </motion.div>

          {/* Right - 3D Handshake Hologram */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[450px] h-[450px]">
              {/* Outer rotating ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {[0, 60, 120, 180, 240, 300].map((angle) => (
                  <div
                    key={angle}
                    className="absolute w-3 h-3 rounded-full bg-primary"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${angle}deg) translateX(225px) translateY(-50%)`
                    }}
                  />
                ))}
              </motion.div>

              {/* Inner ring */}
              <motion.div
                className="absolute inset-12 rounded-full border border-neon-teal/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />

              {/* Handshake Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative"
                  animate={{
                    y: [0, -10, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-neon-teal/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center">
                    <Handshake className="w-20 h-20 text-primary" />
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/30 blur-2xl -z-10"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </motion.div>
              </div>

              {/* Floating Elements */}
              {[
                { x: -100, y: -80, label: '₹50L+', sub: 'Potential' },
                { x: 100, y: -60, label: '30%', sub: 'Commission' },
                { x: -120, y: 80, label: 'AI', sub: 'Powered' },
                { x: 110, y: 100, label: '24/7', sub: 'Support' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="absolute glass-panel px-4 py-2 text-center"
                  style={{
                    left: `calc(50% + ${item.x}px)`,
                    top: `calc(50% + ${item.y}px)`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                >
                  <p className="font-mono font-bold text-primary">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
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

export default FranchiseHero;
