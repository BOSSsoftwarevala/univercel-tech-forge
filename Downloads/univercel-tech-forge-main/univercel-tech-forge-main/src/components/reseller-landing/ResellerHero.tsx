import { motion } from 'framer-motion';
import { Play, BarChart3, Sparkles, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResellerHero = () => {
  // Network nodes for referral chain visualization
  const nodes = [
    { x: 50, y: 30, size: 20, delay: 0 },
    { x: 25, y: 50, size: 16, delay: 0.2 },
    { x: 75, y: 50, size: 16, delay: 0.3 },
    { x: 15, y: 70, size: 12, delay: 0.4 },
    { x: 40, y: 70, size: 12, delay: 0.5 },
    { x: 60, y: 70, size: 12, delay: 0.6 },
    { x: 85, y: 70, size: 12, delay: 0.7 }
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 0, to: 2 },
    { from: 1, to: 3 },
    { from: 1, to: 4 },
    { from: 2, to: 5 },
    { from: 2, to: 6 }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 z-0">
        <svg className="w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="techGrid" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M10 0 L0 0 L0 10" fill="none" stroke="hsl(217, 91%, 60%)" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100" height="100" fill="url(#techGrid)" />
        </svg>
      </div>

      {/* Glow Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, hsla(217, 91%, 60%, 0.1) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
        style={{ background: 'radial-gradient(circle, hsla(187, 100%, 50%, 0.1) 0%, transparent 70%)' }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-blue/10 border border-neon-blue/30 mb-6"
            >
              <Sparkles className="w-4 h-4 text-neon-blue" />
              <span className="text-sm text-neon-blue font-medium">Zero-Skill Selling</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold leading-tight mb-6"
            >
              <span className="text-foreground">Become a</span>
              <br />
              <span className="bg-gradient-to-r from-neon-blue via-primary to-neon-teal bg-clip-text text-transparent">
                Software Vala
              </span>
              <br />
              <span className="text-foreground">Reseller</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Earn lifetime commissions. Sell without technical skills. 
              <span className="text-neon-blue"> AI closes deals for you.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="relative group bg-gradient-to-r from-neon-blue to-primary text-background font-semibold px-8 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] transition-all"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Start Selling
                <motion.span
                  className="absolute inset-0 rounded-lg bg-neon-blue/50 blur-xl -z-10"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-neon-blue/50 text-foreground hover:bg-neon-blue/10 group"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Commission Structure
              </Button>
              
              <Button
                size="lg"
                variant="ghost"
                className="text-neon-blue hover:bg-neon-blue/10"
              >
                <Play className="w-4 h-4 mr-2" />
                AI Sales Demo
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
                { value: '15%', label: 'Commission' },
                { value: '2000+', label: 'Resellers' },
                { value: '₹5Cr+', label: 'Paid Out' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-mono font-bold text-neon-blue">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Network Nodes Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-[450px] h-[450px]">
              {/* SVG Network */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
                    <stop offset="100%" stopColor="hsl(187, 100%, 50%)" />
                  </linearGradient>
                  <filter id="nodeGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Connection Lines */}
                {connections.map((conn, i) => (
                  <motion.line
                    key={i}
                    x1={nodes[conn.from].x}
                    y1={nodes[conn.from].y}
                    x2={nodes[conn.to].x}
                    y2={nodes[conn.to].y}
                    stroke="url(#nodeGrad)"
                    strokeWidth="0.5"
                    strokeOpacity="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  />
                ))}

                {/* Animated Data Flow */}
                {connections.map((conn, i) => (
                  <motion.circle
                    key={`flow-${i}`}
                    r="1"
                    fill="hsl(187, 100%, 50%)"
                    filter="url(#nodeGlow)"
                    initial={{ 
                      cx: nodes[conn.from].x,
                      cy: nodes[conn.from].y,
                      opacity: 0
                    }}
                    animate={{
                      cx: [nodes[conn.from].x, nodes[conn.to].x],
                      cy: [nodes[conn.from].y, nodes[conn.to].y],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "linear"
                    }}
                  />
                ))}

                {/* Network Nodes */}
                {nodes.map((node, i) => (
                  <motion.g key={i}>
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size / 2}
                      fill="url(#nodeGrad)"
                      filter="url(#nodeGlow)"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: node.delay, type: "spring" }}
                    />
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={node.size / 2 + 3}
                      fill="none"
                      stroke="url(#nodeGrad)"
                      strokeWidth="0.5"
                      strokeOpacity="0.5"
                      animate={{
                        r: [node.size / 2 + 3, node.size / 2 + 8, node.size / 2 + 3],
                        opacity: [0.5, 0.2, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: node.delay }}
                    />
                  </motion.g>
                ))}
              </svg>

              {/* Center Label */}
              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <motion.div
                  className="px-4 py-2 glass-panel rounded-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-xs text-neon-blue font-mono">YOU</p>
                </motion.div>
              </div>

              {/* Commission Labels */}
              {[
                { x: '10%', y: '75%', amount: '₹7.5K' },
                { x: '35%', y: '75%', amount: '₹7.5K' },
                { x: '55%', y: '75%', amount: '₹7.5K' },
                { x: '80%', y: '75%', amount: '₹7.5K' }
              ].map((label, i) => (
                <motion.div
                  key={i}
                  className="absolute px-2 py-1 glass-panel rounded text-center"
                  style={{ left: label.x, top: label.y }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                >
                  <p className="text-xs font-mono text-neon-green">{label.amount}</p>
                </motion.div>
              ))}

              {/* Outer Glow */}
              <motion.div
                className="absolute inset-0 rounded-full border border-neon-blue/20"
                animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
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
          className="w-6 h-10 rounded-full border-2 border-neon-blue/30 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [1, 0, 1], y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-neon-blue"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default ResellerHero;
