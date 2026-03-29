import { motion } from 'framer-motion';
import { Users, PlayCircle, MessageSquare, UserCheck, CheckCircle, Wallet } from 'lucide-react';

const steps = [
  { icon: Users, label: 'Lead', description: 'Share your link' },
  { icon: PlayCircle, label: 'Demo', description: 'Auto demo plays' },
  { icon: MessageSquare, label: 'AI Chat', description: 'AI answers queries' },
  { icon: UserCheck, label: 'Expert', description: 'Team closes deal' },
  { icon: CheckCircle, label: 'Conversion', description: 'Sale confirmed' },
  { icon: Wallet, label: 'Commission', description: 'You get paid' }
];

const LeadFlowSystem = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="flow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-mono font-bold text-foreground mb-4">
            Lead Flow <span className="text-neon-blue">System</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your only job is sharing. AI and our team handle the rest.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Flow Diagram */}
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-blue via-primary to-neon-green hidden md:block" />
            
            {/* Animated Flow Particles */}
            <motion.div
              className="absolute top-16 left-0 w-3 h-3 rounded-full bg-neon-blue hidden md:block"
              animate={{
                left: ['0%', '100%'],
                opacity: [0, 1, 1, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                boxShadow: '0 0 20px hsl(217, 91%, 60%)'
              }}
            />

            {/* Steps */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative text-center group"
                  >
                    {/* Step Circle */}
                    <motion.div
                      className="relative inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-neon-blue/20 to-primary/20 border-2 border-neon-blue/50 mb-3 mx-auto"
                      whileHover={{ scale: 1.1 }}
                      animate={{
                        boxShadow: [
                          '0 0 15px hsla(217, 91%, 60%, 0.2)',
                          '0 0 30px hsla(217, 91%, 60%, 0.4)',
                          '0 0 15px hsla(217, 91%, 60%, 0.2)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      <IconComponent className="w-6 h-6 text-neon-blue" />
                      
                      {/* Step Number */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-neon-blue flex items-center justify-center">
                        <span className="text-[10px] font-bold text-background">{index + 1}</span>
                      </div>
                    </motion.div>

                    {/* Hologram Checkmark */}
                    <motion.div
                      className="absolute -top-2 right-1/4"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 0.6, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.15 }}
                    >
                      <CheckCircle className="w-4 h-4 text-neon-green" />
                    </motion.div>

                    <h4 className="font-mono font-semibold text-foreground text-sm mb-1">{step.label}</h4>
                    <p className="text-xs text-muted-foreground">{step.description}</p>

                    {/* Tooltip on Hover */}
                    <motion.div
                      className="absolute -bottom-12 left-1/2 -translate-x-1/2 glass-panel px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap"
                      initial={{ y: 5 }}
                      whileHover={{ y: 0 }}
                    >
                      <p className="text-xs text-neon-blue">
                        {index === 0 && '🔗 Just share your link'}
                        {index === 1 && '▶️ Auto-plays to prospects'}
                        {index === 2 && '🤖 AI handles questions'}
                        {index === 3 && '👤 Our team steps in'}
                        {index === 4 && '✅ Deal closed for you'}
                        {index === 5 && '💰 Money in your wallet'}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="inline-flex items-center gap-4 glass-panel px-6 py-4 rounded-xl">
              <span className="text-3xl">🎯</span>
              <div className="text-left">
                <p className="font-mono font-bold text-foreground">Your Only Task: Share Links</p>
                <p className="text-sm text-muted-foreground">Everything else is automated by AI + our expert team</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LeadFlowSystem;
