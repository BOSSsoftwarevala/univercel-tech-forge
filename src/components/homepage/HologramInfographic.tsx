/**
 * Optimized Hologram Infographic
 * Simplified animations for performance
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const hexData = [
  { label: 'Software Products', value: '5170+', color: 'from-primary to-neon-teal', note: '2hr Prime Delivery' },
  { label: 'Franchises', value: '52+', color: 'from-neon-green to-neon-teal' },
  { label: 'Resellers', value: '2850+', color: 'from-neon-orange to-neon-red' },
  { label: 'Premium Agencies', value: '300+', color: 'from-neon-purple to-primary' },
  { label: 'Govt. Projects', value: '10+', color: 'from-neon-teal to-neon-green', note: '2 Mega Ongoing' },
  { label: 'Global Support', value: '24/7', color: 'from-primary to-neon-purple' },
];

const flowSteps = [
  { step: '01', label: 'Browse', desc: 'Explore software catalog' },
  { step: '02', label: 'Demo', desc: 'Try before you buy' },
  { step: '03', label: 'Purchase', desc: 'Secure checkout' },
  { step: '04', label: 'Deploy', desc: 'Instant access' },
];

const HologramInfographic = memo(function HologramInfographic() {
  const { performanceMode } = useNetworkStatus();
  const isLite = performanceMode !== 'full';

  return (
    <section className="py-16 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* World's First Badge */}
        <motion.div
          initial={isLite ? {} : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/20 via-neon-purple/20 to-neon-teal/20 border border-primary/40 backdrop-blur-sm">
            <span className="text-2xl">🌍</span>
            <span className="text-sm md:text-base font-bold bg-gradient-to-r from-primary via-neon-purple to-neon-teal bg-clip-text text-transparent">
              WORLD'S FIRST COMPLETE SOFTWARE ECOSYSTEM
            </span>
            <span className="text-2xl">🚀</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 max-w-md mx-auto">
            No one else offers this complete technology ecosystem — from software catalog to franchise network, 
            reseller programs, government projects & AI-powered management.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
            Platform Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {hexData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={isLite ? {} : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <div className="relative p-4 rounded-xl bg-card/40 backdrop-blur-sm border border-border/30 text-center hover:border-primary/50 transition-all duration-300">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5 rounded-xl group-hover:opacity-10 transition-opacity`} />
                  <p className="text-2xl font-bold text-primary mb-1">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  {item.note && (
                    <p className="text-[10px] text-primary/70 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.note}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Flow Diagram */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-center mb-8 text-foreground">
            How It Works
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {flowSteps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={isLite ? {} : { opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{item.step}</span>
                </div>
                <h4 className="font-semibold text-foreground mb-1">{item.label}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default HologramInfographic;
