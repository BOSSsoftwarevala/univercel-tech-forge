import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  GraduationCap, 
  Building, 
  Stethoscope, 
  Users, 
  UserCog,
  Car,
  Hotel,
  Plane
} from 'lucide-react';

const industries = [
  { icon: <ShoppingCart className="w-8 h-8" />, name: 'POS System', color: 'primary' },
  { icon: <GraduationCap className="w-8 h-8" />, name: 'School ERP', color: 'neon-teal' },
  { icon: <Building className="w-8 h-8" />, name: 'Real Estate', color: 'neon-blue' },
  { icon: <Stethoscope className="w-8 h-8" />, name: 'Hospital', color: 'neon-green' },
  { icon: <Users className="w-8 h-8" />, name: 'CRM', color: 'neon-purple' },
  { icon: <UserCog className="w-8 h-8" />, name: 'HRMS', color: 'neon-orange' },
  { icon: <Car className="w-8 h-8" />, name: 'Auto Dealer', color: 'primary' },
  { icon: <Hotel className="w-8 h-8" />, name: 'Hotel PMS', color: 'neon-teal' },
  { icon: <Plane className="w-8 h-8" />, name: 'Travel', color: 'neon-blue' }
];

const IndustryModules = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="demo">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-mono font-bold text-foreground mb-4">
            Industry <span className="text-primary">Modules</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            40+ specialized solutions across diverse industries, each powered by AI
          </p>
        </motion.div>

        {/* Industry Grid with Connection Lines */}
        <div className="relative max-w-4xl mx-auto">
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(187, 100%, 50%)" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(187, 100%, 50%)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(187, 100%, 50%)" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Horizontal connections */}
            {[0, 1, 2].map((row) => (
              <motion.line
                key={`h-${row}`}
                x1="100"
                y1={80 + row * 130}
                x2="700"
                y2={80 + row * 130}
                stroke="url(#lineGrad)"
                strokeWidth="1"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: row * 0.2 }}
              />
            ))}
            
            {/* Vertical connections */}
            {[0, 1, 2].map((col) => (
              <motion.line
                key={`v-${col}`}
                x1={200 + col * 200}
                y1="50"
                x2={200 + col * 200}
                y2="350"
                stroke="url(#lineGrad)"
                strokeWidth="1"
                strokeOpacity="0.3"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5 + col * 0.2 }}
              />
            ))}
          </svg>

          {/* Industry Icons Grid */}
          <div className="grid grid-cols-3 gap-8 relative z-10">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="relative group cursor-pointer"
                  whileHover={{ scale: 1.1, y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Outer Ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/20 scale-150 opacity-0 group-hover:opacity-100 group-hover:scale-[1.8]"
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Icon Container */}
                  <div className={`relative w-20 h-20 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/30 flex items-center justify-center text-${industry.color} group-hover:border-${industry.color}/50 transition-all duration-300 group-hover:shadow-[0_0_40px_rgba(0,240,255,0.3)]`}>
                    {industry.icon}
                    
                    {/* Glow Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 -z-10"
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* Pulse Animation */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border border-primary/50 opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0, 0.5, 0]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>

                {/* Label */}
                <motion.span
                  className="mt-4 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors text-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {industry.name}
                </motion.span>
              </motion.div>
            ))}
          </div>

          {/* Center Hub */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-neon-teal/20 border border-primary/30 flex items-center justify-center pointer-events-none"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="font-mono text-xs text-primary">40+</span>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Each module comes with AI-powered automation and real-time analytics
          </p>
          <motion.button
            className="px-8 py-3 rounded-lg bg-primary/10 border border-primary/50 text-primary font-medium hover:bg-primary/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Demos
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default IndustryModules;
