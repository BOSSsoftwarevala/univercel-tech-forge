import { motion } from 'framer-motion';

const hexData = [
  { label: 'Strengths', value: 'AI-Powered Core', color: 'from-primary to-neon-teal' },
  { label: 'Weaknesses', value: 'Market Entry', color: 'from-neon-orange to-neon-red' },
  { label: 'Opportunities', value: 'Global Expansion', color: 'from-neon-green to-neon-teal' },
  { label: 'Threats', value: 'Competition', color: 'from-neon-purple to-neon-blue' }
];

const flowSteps = [
  { step: '01', title: 'Discovery', desc: 'AI analyzes your needs' },
  { step: '02', title: 'Design', desc: 'Custom solution architecture' },
  { step: '03', title: 'Deploy', desc: 'Seamless implementation' },
  { step: '04', title: 'Optimize', desc: 'Continuous AI improvement' }
];

const HologramInfographic = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-mono font-bold text-foreground mb-4">
            System <span className="text-primary">Architecture</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Neural circuit design powering intelligent business operations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* SWOT Hex Matrix */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {hexData.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group"
                >
                  <div className="relative p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/30 overflow-hidden">
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                    
                    {/* Hexagon Icon */}
                    <svg className="w-12 h-12 mb-4" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id={`hexGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(187, 100%, 50%)" />
                          <stop offset="100%" stopColor="hsl(174, 100%, 45%)" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z"
                        fill="none"
                        stroke={`url(#hexGrad-${index})`}
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="15"
                        fill="hsla(187, 100%, 50%, 0.2)"
                        animate={{
                          r: [15, 18, 15],
                          opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </svg>

                    <h3 className="font-mono font-semibold text-foreground mb-1">{item.label}</h3>
                    <p className="text-sm text-primary">{item.value}</p>

                    {/* Corner Glow */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Center Connection */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <motion.div
                className="w-16 h-16 rounded-full border-2 border-primary/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Circular Flow Diagram */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Central Hub */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-neon-teal flex items-center justify-center z-10"
                animate={{
                  boxShadow: [
                    '0 0 30px hsla(187, 100%, 50%, 0.3)',
                    '0 0 60px hsla(187, 100%, 50%, 0.5)',
                    '0 0 30px hsla(187, 100%, 50%, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="font-mono font-bold text-background text-lg">AI</span>
              </motion.div>

              {/* Rotating Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-primary/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />

              {/* Flow Steps */}
              {flowSteps.map((item, index) => {
                const angle = (index * 90 - 45) * (Math.PI / 180);
                const radius = 42;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);

                return (
                  <motion.div
                    key={item.step}
                    className="absolute w-32"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.15 }}
                  >
                    <motion.div
                      className="p-4 rounded-xl bg-card/60 backdrop-blur-xl border border-border/30 text-center group hover:border-primary/50 transition-colors"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-xs font-mono text-primary/60 group-hover:text-primary transition-colors">
                        {item.step}
                      </span>
                      <h4 className="font-mono font-semibold text-foreground text-sm mt-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                {flowSteps.map((_, index) => {
                  const angle1 = (index * 90 - 45) * (Math.PI / 180);
                  const angle2 = ((index + 1) * 90 - 45) * (Math.PI / 180);
                  const r = 42;
                  
                  return (
                    <motion.path
                      key={index}
                      d={`M ${50 + 15 * Math.cos(angle1)} ${50 + 15 * Math.sin(angle1)} Q 50 50 ${50 + 15 * Math.cos(angle2)} ${50 + 15 * Math.sin(angle2)}`}
                      fill="none"
                      stroke="hsl(187, 100%, 50%)"
                      strokeWidth="0.5"
                      strokeDasharray="2 2"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.5 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                    />
                  );
                })}
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 H10 V0" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.3" />
            <circle cx="10" cy="10" r="1" fill="hsl(187, 100%, 50%)" />
          </pattern>
          <rect x="0" y="0" width="100" height="100" fill="url(#circuit)" />
        </svg>
      </div>
    </section>
  );
};

export default HologramInfographic;
