import { motion } from 'framer-motion';
import { Link2, Package, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEnterpriseAudit } from '@/hooks/useEnterpriseAudit';

const ResellerCTA = () => {
  const navigate = useNavigate();
  const { logAction } = useEnterpriseAudit();
  return (
    <section className="relative py-24 overflow-hidden" id="apply">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Glowing Frame */}
          <div className="relative p-12 rounded-3xl overflow-hidden">
            {/* Animated Border */}
            <div className="absolute inset-0 rounded-3xl">
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: 'linear-gradient(90deg, hsl(217, 91%, 60%), hsl(187, 100%, 50%), hsl(142, 76%, 50%), hsl(217, 91%, 60%))',
                  backgroundSize: '300% 100%'
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-[2px] rounded-3xl bg-card" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              {/* Floating Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-neon-blue/50"
                  style={{
                    left: `${15 + i * 14}%`,
                    top: `${15 + (i % 3) * 30}%`
                  }}
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.4
                  }}
                />
              ))}

              {/* Icon */}
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-neon-blue to-primary mb-6"
                animate={{
                  boxShadow: [
                    '0 0 30px hsla(217, 91%, 60%, 0.3)',
                    '0 0 60px hsla(217, 91%, 60%, 0.5)',
                    '0 0 30px hsla(217, 91%, 60%, 0.3)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 text-background" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl font-mono font-bold text-foreground mb-4"
              >
                Start selling today.
                <br />
                <span className="bg-gradient-to-r from-neon-blue via-primary to-neon-teal bg-clip-text text-transparent">
                  AI will close for you.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-muted-foreground max-w-xl mx-auto mb-8"
              >
                Join 2000+ resellers earning passive income. Get your affiliate link 
                and start earning within minutes.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button
                  size="lg"
                  onClick={async () => {
                    await logAction({
                      action: 'public_reseller_apply_clicked',
                      module: 'reseller_manager',
                      severity: 'low',
                      metadata: {
                        system_request: {
                          enabled: true,
                          action_type: 'reseller',
                          role_type: 'reseller',
                          status: 'NEW',
                          source: 'frontend',
                          payload_json: {
                            intent: 'apply',
                            entry_point: 'reseller_cta',
                            path: window.location.pathname,
                          },
                        },
                        status: 'pending',
                        source: 'reseller_cta',
                        path: window.location.pathname,
                      },
                    });
                    navigate('/apply?type=reseller');
                  }}
                  className="relative group bg-gradient-to-r from-neon-blue to-primary text-background font-semibold px-10 py-6 text-lg hover:shadow-[0_0_50px_rgba(59,130,246,0.5)] transition-all"
                >
                  <Link2 className="w-5 h-5 mr-2" />
                  Apply as Reseller
                  <motion.span
                    className="absolute inset-0 rounded-lg bg-neon-blue/50 blur-xl -z-10"
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/demos/public')}
                  className="border-neon-blue/50 text-foreground hover:bg-neon-blue/10 hover:border-neon-blue px-10 py-6 text-lg"
                >
                  <Package className="w-5 h-5 mr-2" />
                  Explore Demos
                </Button>
              </motion.div>

              {/* Trust Elements */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap justify-center gap-6 mt-10 text-muted-foreground"
              >
                {['Free to Join', 'Instant Link', 'AI Support', '15% Commission'].map((badge, i) => (
                  <span key={i} className="flex items-center gap-2 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                    {badge}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-neon-blue/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
};

export default ResellerCTA;
