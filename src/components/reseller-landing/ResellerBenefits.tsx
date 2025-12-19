import { motion } from 'framer-motion';
import { 
  Percent, 
  Bot, 
  Users, 
  Share, 
  Code2, 
  Megaphone,
  BarChart3,
  Palette
} from 'lucide-react';

const benefits = [
  {
    icon: Percent,
    title: 'Lifetime Commission 15%',
    description: 'Earn 15% on every sale, forever. No caps, no expiry.',
    gradient: 'from-neon-blue to-primary'
  },
  {
    icon: Bot,
    title: 'AI Automated Sales',
    description: 'AI handles demos, chats, and follow-ups automatically.',
    gradient: 'from-primary to-neon-teal'
  },
  {
    icon: Users,
    title: 'Free Leads from System',
    description: 'Get organic leads routed to you from our SEO engine.',
    gradient: 'from-neon-teal to-neon-green'
  },
  {
    icon: Share,
    title: 'One-Click Demo Sharing',
    description: 'Share live demos instantly via link or QR code.',
    gradient: 'from-neon-green to-neon-blue'
  },
  {
    icon: Code2,
    title: 'No Coding Required',
    description: 'Zero technical skills needed. We handle everything.',
    gradient: 'from-neon-blue to-neon-purple'
  },
  {
    icon: Megaphone,
    title: 'Social Media Tools',
    description: 'Ready-made posts, banners, and videos for promotion.',
    gradient: 'from-neon-purple to-primary'
  },
  {
    icon: BarChart3,
    title: 'Smart Tracking Dashboard',
    description: 'Real-time analytics on leads, clicks, and conversions.',
    gradient: 'from-primary to-neon-orange'
  },
  {
    icon: Palette,
    title: 'Marketing Assets',
    description: 'Professional brochures, videos, and presentation decks.',
    gradient: 'from-neon-orange to-neon-blue'
  }
];

const ResellerBenefits = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="benefits">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-mono font-bold text-foreground mb-4">
            Reseller <span className="text-neon-blue">Benefits</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to earn without the hassle of traditional sales
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group"
              >
                <motion.div
                  className="relative h-full p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/30 overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Hover Glow */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at 50% 50%, hsla(217, 91%, 60%, 0.15) 0%, transparent 70%)'
                    }}
                  />

                  {/* Neon Border Pulse on Hover */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      boxShadow: [
                        '0 0 0 1px hsla(217, 91%, 60%, 0.3)',
                        '0 0 20px 1px hsla(217, 91%, 60%, 0.4)',
                        '0 0 0 1px hsla(217, 91%, 60%, 0.3)'
                      ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />

                  {/* Icon */}
                  <motion.div
                    className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.gradient} p-3.5 mb-4`}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <IconComponent className="w-full h-full text-background" />
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-neon-blue/30 blur-xl -z-10 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>

                  <h3 className="text-base font-mono font-semibold text-foreground mb-2 group-hover:text-neon-blue transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Bottom Glow Line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-blue to-transparent"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResellerBenefits;
