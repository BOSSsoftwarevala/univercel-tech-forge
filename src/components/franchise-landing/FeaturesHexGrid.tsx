import { motion } from 'framer-motion';
import { 
  Bot, 
  PlayCircle, 
  Wallet, 
  Users, 
  Gift, 
  BarChart3,
  MapPin,
  UserCheck,
  Truck,
  HeadphonesIcon
} from 'lucide-react';

const features = [
  { icon: Bot, label: 'AI Lead System' },
  { icon: PlayCircle, label: 'Auto Demo Engine' },
  { icon: Wallet, label: 'Wallet & Payments' },
  { icon: Users, label: 'Reseller Network' },
  { icon: Gift, label: 'Influencer Bonus' },
  { icon: BarChart3, label: 'Performance Tracking' },
  { icon: MapPin, label: 'Territory Lock' },
  { icon: UserCheck, label: 'Client Management' },
  { icon: Truck, label: 'One-Click Delivery' },
  { icon: HeadphonesIcon, label: 'Support AI' }
];

const FeaturesHexGrid = () => {
  return (
    <section className="relative py-24 overflow-hidden" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-mono font-bold text-foreground mb-4">
            Franchise <span className="text-primary">Features</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to run a successful tech business
          </p>
        </motion.div>

        {/* Hex Grid */}
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group"
              >
                <motion.div
                  className="relative w-28 h-32 cursor-pointer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Hexagon SVG */}
                  <svg viewBox="0 0 100 115" className="w-full h-full">
                    <defs>
                      <linearGradient id={`hexGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(187, 100%, 50%)" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.05" />
                      </linearGradient>
                      <linearGradient id={`hexStroke-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(187, 100%, 50%)" />
                        <stop offset="100%" stopColor="hsl(174, 100%, 45%)" />
                      </linearGradient>
                    </defs>
                    
                    {/* Hexagon Background */}
                    <motion.path
                      d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
                      fill={`url(#hexGrad-${index})`}
                      stroke={`url(#hexStroke-${index})`}
                      strokeWidth="2"
                      className="transition-all duration-300"
                      initial={{ strokeOpacity: 0.3 }}
                      whileHover={{ strokeOpacity: 1 }}
                    />
                    
                    {/* Hover Glow */}
                    <motion.path
                      d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
                      fill="none"
                      stroke="hsl(187, 100%, 50%)"
                      strokeWidth="4"
                      className="opacity-0 group-hover:opacity-50 blur-sm transition-opacity"
                    />
                  </svg>

                  {/* Icon */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                      animate={{
                        y: [0, -3, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.1 }}
                    >
                      <IconComponent className="w-8 h-8 text-primary mb-1" />
                    </motion.div>
                    <span className="text-[10px] text-muted-foreground group-hover:text-foreground transition-colors text-center px-2 leading-tight">
                      {feature.label}
                    </span>
                  </div>

                  {/* Pulse Effect on Hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    initial={false}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Background Circuit Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <pattern id="hexPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M5 0 L10 2.5 L10 7.5 L5 10 L0 7.5 L0 2.5 Z" fill="none" stroke="hsl(187, 100%, 50%)" strokeWidth="0.2" />
          </pattern>
          <rect x="0" y="0" width="100" height="100" fill="url(#hexPattern)" />
        </svg>
      </div>
    </section>
  );
};

export default FeaturesHexGrid;
