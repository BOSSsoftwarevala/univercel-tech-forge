import { motion } from 'framer-motion';
import { 
  Bot, 
  BarChart3, 
  Globe2, 
  Infinity, 
  Shield, 
  Zap,
  Brain,
  Wallet
} from 'lucide-react';

const features = [
  {
    icon: Bot,
    title: 'AI Automation',
    description: 'Intelligent workflows that learn and adapt to your business needs.',
    gradient: 'from-primary to-neon-teal'
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Real-time insights with predictive modeling and trend analysis.',
    gradient: 'from-neon-teal to-neon-blue'
  },
  {
    icon: Globe2,
    title: 'Global Demo System',
    description: '40+ industry demos with auto language and currency adaptation.',
    gradient: 'from-neon-blue to-neon-purple'
  },
  {
    icon: Infinity,
    title: 'Lifetime Pricing',
    description: 'One-time investment for unlimited access to all premium features.',
    gradient: 'from-neon-purple to-primary'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade encryption with compliance for global standards.',
    gradient: 'from-primary to-neon-green'
  },
  {
    icon: Zap,
    title: 'Instant Deployment',
    description: 'Go live in minutes with our pre-configured enterprise modules.',
    gradient: 'from-neon-green to-neon-teal'
  },
  {
    icon: Brain,
    title: 'Neural Processing',
    description: 'Advanced AI models for document analysis and decision support.',
    gradient: 'from-neon-orange to-neon-red'
  },
  {
    icon: Wallet,
    title: 'Wallet Ecosystem',
    description: 'Integrated payment system with multi-currency support.',
    gradient: 'from-neon-teal to-primary'
  }
];

const FeaturesGrid = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="products">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-mono font-bold text-foreground mb-4">
            Enterprise <span className="text-primary">Features</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cutting-edge technology powering the next generation of business solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  className="relative h-full p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-border/30 group cursor-pointer overflow-hidden"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at 50% 50%, hsla(187, 100%, 50%, 0.15) 0%, transparent 70%)'
                    }}
                  />
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 rounded-2xl border border-primary/50" />
                  </div>
                  <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-4 mb-4 group-hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-300`}>
                    <IconComponent className="w-8 h-8 text-background" />
                  </div>
                  <h3 className="text-lg font-mono font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-neon-teal/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
    </section>
  );
};

export default FeaturesGrid;
