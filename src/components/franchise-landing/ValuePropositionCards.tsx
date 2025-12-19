import { motion } from 'framer-motion';
import { 
  Percent, 
  MapPin, 
  Infinity, 
  Zap, 
  Bot, 
  GraduationCap 
} from 'lucide-react';

const cards = [
  {
    icon: Percent,
    title: 'High Commission',
    description: 'Up to 30% commission on every sale with lifetime earning potential.',
    color: 'from-primary to-neon-teal'
  },
  {
    icon: MapPin,
    title: 'Territory Rights',
    description: 'Exclusive territory lock - no competition within your assigned region.',
    color: 'from-neon-teal to-neon-blue'
  },
  {
    icon: Infinity,
    title: 'Lifetime Pricing',
    description: 'One-time franchise fee. No recurring royalties or hidden charges.',
    color: 'from-neon-blue to-neon-purple'
  },
  {
    icon: Zap,
    title: 'Lead Automation',
    description: 'AI-powered lead generation and routing directly to your dashboard.',
    color: 'from-neon-purple to-primary'
  },
  {
    icon: Bot,
    title: 'AI Sales Support',
    description: '24/7 AI assistant to help close deals and answer client queries.',
    color: 'from-primary to-neon-green'
  },
  {
    icon: GraduationCap,
    title: 'Zero Technical Skill',
    description: 'Complete training and support. No coding knowledge required.',
    color: 'from-neon-green to-neon-teal'
  }
];

const ValuePropositionCards = () => {
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
            Why Choose <span className="text-primary">Software Vala</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join an ecosystem designed for your success with unmatched benefits
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                      background: 'radial-gradient(circle at 50% 50%, hsla(187, 100%, 50%, 0.15) 0%, transparent 70%)'
                    }}
                  />

                  {/* Neon Border on Hover */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 rounded-2xl border-2 border-primary/50" />
                    <div className="absolute inset-0 rounded-2xl blur-sm border border-primary/30" />
                  </div>

                  {/* Icon */}
                  <motion.div
                    className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${card.color} p-4 mb-4`}
                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <IconComponent className="w-8 h-8 text-background" />
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-primary/30 blur-xl -z-10 opacity-0 group-hover:opacity-100"
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>

                  <h3 className="text-lg font-mono font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>

                  {/* Bottom Line */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
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

export default ValuePropositionCards;
